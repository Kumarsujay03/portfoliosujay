import { useEffect } from "react";

// Geometry in a 64x64 space, simplified for legibility at 16px tab size.
// The full 5-node mark turns to mush that small, so the favicon uses a
// reduced 2-into-1 motif that still reads as a network. Keep in sync with
// public/favicon.svg (the pre-JS / reduced-motion fallback).
const NODES: Array<[number, number, number]> = [
  [17, 19, 7],
  [17, 45, 7],
];

const EDGES: Array<[number, number, number, number]> = [
  [17, 19, 45, 32],
  [17, 45, 45, 32],
];

const ACCENT: [number, number, number] = [45, 32, 8.5];

const readColors = () => {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const fg = styles.getPropertyValue("--foreground").trim() || "0 0% 92%";
  const bg = styles.getPropertyValue("--background").trim() || "0 0% 4%";
  const accent = styles.getPropertyValue("--accent").trim() || "152 45% 55%";
  return { fg: `hsl(${fg})`, bg: `hsl(${bg})`, accent: `hsl(${accent})` };
};

const AnimatedFavicon = () => {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const SIZE = 64;
    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    const originalHref = link?.getAttribute("href") ?? "/favicon.svg";
    const originalType = link?.getAttribute("type") ?? "image/svg+xml";

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    let colors = readColors();

    const drawFrame = (pulse: number) => {
      ctx.clearRect(0, 0, SIZE, SIZE);

      ctx.fillStyle = colors.bg;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(0, 0, SIZE, SIZE, 14);
      } else {
        ctx.rect(0, 0, SIZE, SIZE);
      }
      ctx.fill();

      ctx.strokeStyle = colors.fg;
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      for (const [x1, y1, x2, y2] of EDGES) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.fillStyle = colors.fg;
      for (const [x, y, rad] of NODES) {
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      // Accent output node pulses, mirroring the header logo.
      const [ax, ay, arad] = ACCENT;
      ctx.save();
      ctx.shadowColor = colors.accent;
      ctx.shadowBlur = 4 + pulse * 10;
      ctx.globalAlpha = 0.5 + pulse * 0.5;
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(ax, ay, arad + pulse * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      link!.type = "image/png";
      link!.href = canvas.toDataURL("image/png");
    };

    let rafId = 0;
    let running = true;
    const start = performance.now();

    const loop = (t: number) => {
      if (!running) return;
      // ~1.4s pulse cycle, matching the header's animate-pulse feel.
      const pulse = (Math.sin(((t - start) / 1400) * Math.PI * 2) + 1) / 2;
      drawFrame(pulse);
      rafId = requestAnimationFrame(loop);
    };

    // Pause when the tab is hidden to save work.
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!running) {
        running = true;
        rafId = requestAnimationFrame(loop);
      }
    };

    const observer = new MutationObserver(() => {
      colors = readColors();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    document.addEventListener("visibilitychange", onVisibility);
    rafId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
      if (link) {
        link.type = originalType;
        link.href = originalHref;
      }
    };
  }, []);

  return null;
};

export default AnimatedFavicon;
