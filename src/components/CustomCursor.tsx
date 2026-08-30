import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  "a,button,[role='button'],input,textarea,select,label,[data-cursor='interactive']";

type TrailNode = {
  x: number;
  y: number;
  life: number;
  maxLife: number;
};

function supportsFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  const hasHover = window.matchMedia?.("(hover: hover)").matches ?? false;
  const hasFinePointer = window.matchMedia?.("(pointer: fine)").matches ?? false;
  return hasHover && hasFinePointer;
}

const readForeground = () => {
  if (typeof window === "undefined") return "0 0% 92%";
  const value = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim();
  return value || "0 0% 92%";
};

export default function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const enabled = useMemo(() => !reduceMotion && supportsFinePointer(), [reduceMotion]);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, { stiffness: 1200, damping: 45, mass: 0.15 });
  const dotY = useSpring(y, { stiffness: 1200, damping: 45, mass: 0.15 });
  const ringX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 });

  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d") ?? null;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let fg = readForeground();

    const resize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const trail: TrailNode[] = [];
    const SPACING = 26;
    const MAX_NODES = 14;
    const last = { x: -100, y: -100, has: false };

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);

      const el = event.target instanceof Element ? event.target.closest(INTERACTIVE_SELECTOR) : null;
      setHovering(Boolean(el));

      if (!last.has) {
        last.x = event.clientX;
        last.y = event.clientY;
        last.has = true;
        return;
      }
      const dx = event.clientX - last.x;
      const dy = event.clientY - last.y;
      if (Math.hypot(dx, dy) >= SPACING) {
        trail.push({ x: event.clientX, y: event.clientY, life: 0, maxLife: 620 });
        if (trail.length > MAX_NODES) trail.shift();
        last.x = event.clientX;
        last.y = event.clientY;
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    let lastTs = performance.now();
    let rafId = 0;
    const loop = (ts: number) => {
      const dt = Math.min(48, ts - lastTs);
      lastTs = ts;

      if (ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (const node of trail) node.life += dt;
        while (trail.length && trail[0].life >= trail[0].maxLife) trail.shift();

        const factor = (n: TrailNode) => 1 - n.life / n.maxLife;

        ctx.lineWidth = 1;
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i - 1];
          const b = trail[i];
          const k = Math.min(factor(a), factor(b));
          if (k <= 0) continue;
          ctx.strokeStyle = `hsla(${fg} / ${(k * 0.32).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }

        for (const node of trail) {
          const k = factor(node);
          if (k <= 0) continue;
          ctx.beginPath();
          ctx.fillStyle = `hsla(${fg} / ${(k * 0.5).toFixed(3)})`;
          ctx.arc(node.x, node.y, 1.6 * k + 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const observer = new MutationObserver(() => {
      fg = readForeground();
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("pointerenter", onEnter, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      root.classList.remove("has-custom-cursor");
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerenter", onEnter);
      window.removeEventListener("resize", resize);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Ring reads as a node in the neural-field background: hairline halo plus a
          slowly orbiting dotted ring instead of a plain solid circle. */}
      <motion.div
        className="absolute left-0 top-0"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: hovering ? 44 : 26,
          height: hovering ? 44 : 26,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <motion.div
          className="h-full w-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 16, ease: "linear", repeat: Infinity }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="hsl(var(--foreground) / 0.14)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke={`hsl(var(--foreground) / ${hovering ? 0.65 : 0.42})`}
              strokeWidth="1"
              strokeDasharray="9 15"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute left-0 top-0 rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 5,
          height: 5,
          backgroundColor: "hsl(var(--foreground))",
        }}
        animate={{ opacity: visible ? 1 : 0, scale: hovering ? 0.5 : 1 }}
        transition={{ type: "spring", stiffness: 800, damping: 35 }}
      />
    </div>
  );
}
