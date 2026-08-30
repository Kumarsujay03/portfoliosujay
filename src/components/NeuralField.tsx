import { useEffect, useRef } from "react";

type NeuralFieldProps = {
  density?: number;
  connectionDistance?: number;
  intensity?: number;
  cursorLinkDistance?: number;
  repelRadius?: number;
  repelStrength?: number;
  className?: string;
};

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  glow: number;
};

type Pulse = {
  a: number;
  b: number;
  t: number;
  speed: number;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const supportsFinePointer = () => {
  if (typeof window === "undefined") return false;
  const hasHover = window.matchMedia?.("(hover: hover)").matches ?? false;
  const hasFine = window.matchMedia?.("(pointer: fine)").matches ?? false;
  return hasHover && hasFine;
};

const readForeground = () => {
  if (typeof window === "undefined") return "0 0% 92%";
  const value = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim();
  return value || "0 0% 92%";
};

const NeuralField = ({
  density = 70,
  connectionDistance = 150,
  intensity = 1,
  cursorLinkDistance = 165,
  repelRadius = 95,
  repelStrength = 14,
  className,
}: NeuralFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let rx: number[] = [];
    let ry: number[] = [];
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let fg = readForeground();

    const reduced = prefersReducedMotion();
    const interactive = !reduced && supportsFinePointer();
    const maxDistSq = connectionDistance * connectionDistance;
    const cursorLinkSq = cursorLinkDistance * cursorLinkDistance;

    const pointer = { x: -9999, y: -9999, active: false };
    const smooth = { x: -9999, y: -9999 };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(14, Math.round(((width * height) / 1_000_000) * density));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.1 + 0.8,
        glow: 0,
      }));
      rx = new Array(count).fill(0);
      ry = new Array(count).fill(0);
      pulses = [];
    };

    const neighbors = (i: number) => {
      const out: number[] = [];
      const a = nodes[i];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        if (dx * dx + dy * dy < maxDistSq) out.push(j);
      }
      return out;
    };

    const spawnPulse = () => {
      if (nodes.length < 2 || pulses.length > 6) return;
      const a = Math.floor(Math.random() * nodes.length);
      const ns = neighbors(a);
      if (ns.length === 0) return;
      const b = ns[Math.floor(Math.random() * ns.length)];
      pulses.push({ a, b, t: 0, speed: 0.006 + Math.random() * 0.01 });
      nodes[a].glow = 1;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (interactive && pointer.active) {
        if (smooth.x < -9000) {
          smooth.x = pointer.x;
          smooth.y = pointer.y;
        } else {
          smooth.x += (pointer.x - smooth.x) * 0.18;
          smooth.y += (pointer.y - smooth.y) * 0.18;
        }
      }
      const cursorOn = interactive && pointer.active && smooth.x > -9000;

      if (!reduced) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
          n.glow *= 0.96;
        }
      }

      // Repulsion is a render-time offset so nodes always ease back on their own.
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        rx[i] = n.x;
        ry[i] = n.y;
        if (!cursorOn) continue;

        const dx = n.x - smooth.x;
        const dy = n.y - smooth.y;
        const dist = Math.hypot(dx, dy);
        if (dist >= repelRadius || dist < 0.0001) continue;

        const falloff = 1 - dist / repelRadius;
        const push = repelStrength * falloff * falloff;
        rx[i] = n.x + (dx / dist) * push;
        ry[i] = n.y + (dy / dist) * push;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = rx[i] - rx[j];
          const dy = ry[i] - ry[j];
          const dsq = dx * dx + dy * dy;
          if (dsq >= maxDistSq) continue;
          const proximity = 1 - Math.sqrt(dsq) / connectionDistance;
          ctx.strokeStyle = `hsla(${fg} / ${(proximity * 0.1 * intensity).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(rx[i], ry[i]);
          ctx.lineTo(rx[j], ry[j]);
          ctx.stroke();
        }
      }

      if (cursorOn) {
        for (let i = 0; i < nodes.length; i++) {
          const dx = rx[i] - smooth.x;
          const dy = ry[i] - smooth.y;
          const dsq = dx * dx + dy * dy;
          if (dsq >= cursorLinkSq) continue;
          const proximity = 1 - Math.sqrt(dsq) / cursorLinkDistance;

          ctx.strokeStyle = `hsla(${fg} / ${(proximity * 0.3 * intensity).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(smooth.x, smooth.y);
          ctx.lineTo(rx[i], ry[i]);
          ctx.stroke();

          ctx.beginPath();
          ctx.fillStyle = `hsla(${fg} / ${(proximity * 0.5 * intensity).toFixed(3)})`;
          ctx.arc(rx[i], ry[i], nodes[i].r * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reduced) {
        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i];
          p.t += p.speed;
          if (p.a >= nodes.length || p.b >= nodes.length || p.t >= 1) {
            if (nodes[p.b]) nodes[p.b].glow = 1;
            pulses.splice(i, 1);
            continue;
          }
          const px = rx[p.a] + (rx[p.b] - rx[p.a]) * p.t;
          const py = ry[p.a] + (ry[p.b] - ry[p.a]) * p.t;
          ctx.beginPath();
          ctx.fillStyle = `hsla(${fg} / ${(0.7 * intensity).toFixed(3)})`;
          ctx.arc(px, py, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const base = 0.3 + n.glow * 0.6;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${fg} / ${(base * intensity).toFixed(3)})`;
        ctx.arc(rx[i], ry[i], n.r + n.glow * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let rafId = 0;
    let lastSpawn = 0;
    const loop = (t: number) => {
      if (!reduced && t - lastSpawn > 520) {
        spawnPulse();
        lastSpawn = t;
      }
      draw();
      rafId = requestAnimationFrame(loop);
    };

    build();
    if (reduced) draw();
    else rafId = requestAnimationFrame(loop);

    const onResize = () => {
      build();
      if (reduced) draw();
    };
    window.addEventListener("resize", onResize);

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      smooth.x = -9999;
      smooth.y = -9999;
    };

    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    const observer = new MutationObserver(() => {
      fg = readForeground();
      if (reduced) draw();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      if (interactive) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerleave", onPointerLeave);
      }
      observer.disconnect();
    };
  }, [density, connectionDistance, intensity, cursorLinkDistance, repelRadius, repelStrength]);

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`.trim()}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};

export default NeuralField;
