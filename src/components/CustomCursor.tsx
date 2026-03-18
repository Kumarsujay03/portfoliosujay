import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  "a,button,[role='button'],input,textarea,select,label,[data-cursor='interactive']";

type Burst = {
  id: number;
  x: number;
  y: number;
  particles: Array<{
    id: number;
    dx: number;
    dy: number;
    size: number;
    delay: number;
    rotate: number;
  }>;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createBurst(x: number, y: number): Burst {
  const baseId = Date.now() + Math.floor(Math.random() * 1000);
  const particleCount = 18;
  const particles = Array.from({ length: particleCount }, (_, index) => {
    const angle = (Math.PI * 2 * index) / particleCount + (Math.random() - 0.5) * 0.35;
    const radius = 26 + Math.random() * 42;
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle) * radius;
    const size = 2 + Math.floor(Math.random() * 4); // 2-5
    const delay = Math.random() * 0.05;
    const rotate = (Math.random() - 0.5) * 120;
    return { id: baseId + index + 1, dx, dy, size, delay, rotate };
  });

  return { id: baseId, x, y, particles };
}

function supportsFinePointer(): boolean {
  if (typeof window === "undefined") return false;

  const hasHover = window.matchMedia?.("(hover: hover)").matches ?? false;
  const hasFinePointer = window.matchMedia?.("(pointer: fine)").matches ?? false;
  return hasHover && hasFinePointer;
}

export default function CustomCursor() {
  const reduceMotion = useReducedMotion();

  const enabled = useMemo(() => {
    if (reduceMotion) return false;
    return supportsFinePointer();
  }, [reduceMotion]);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Dot follows quicker; ring follows slower for a trailing feel.
  const dotX = useSpring(x, { stiffness: 900, damping: 40, mass: 0.18 });
  const dotY = useSpring(y, { stiffness: 900, damping: 40, mass: 0.18 });

  const ringX = useSpring(x, { stiffness: 240, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 240, damping: 28, mass: 0.6 });

  // Velocity-reactive trail for a more "tech" feel.
  const trailAngle = useMotionValue(0);
  const trailStrength = useMotionValue(0);
  const trailScaleX = useTransform(trailStrength, (t) => 0.7 + t * 2.2);
  const trailOpacityDefault = useTransform(trailStrength, (t) => 0.45 * clamp(t * 1.15, 0, 1));
  const trailOpacityInteractive = useTransform(trailStrength, (t) => 0.65 * clamp(t * 1.15, 0, 1));
  const lastPos = useRef<{ x: number; y: number; t: number } | null>(null);
  const trailStopTimeoutRef = useRef<number | null>(null);

  const [visible, setVisible] = useState(false);
  const [hoveringInteractive, setHoveringInteractive] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [magnetEl, setMagnetEl] = useState<Element | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const updateHovering = (el: EventTarget | null) => {
      if (!(el instanceof Element)) {
        setHoveringInteractive(false);
        setMagnetEl(null);
        return;
      }
      const closest = el.closest(INTERACTIVE_SELECTOR);
      setHoveringInteractive(Boolean(closest));
      setMagnetEl(closest);
    };

    const onPointerMove = (event: PointerEvent) => {
      let nextX = event.clientX;
      let nextY = event.clientY;

      // Magnetic cursor: subtly pulls toward the hovered interactive element.
      if (magnetEl instanceof Element) {
        const rect = magnetEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = centerX - event.clientX;
        const dy = centerY - event.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
          const influence = clamp(1 - distance / 360, 0, 1);
          const strengthPx = influence * 18; // max pull
          nextX += (dx / distance) * strengthPx;
          nextY += (dy / distance) * strengthPx;
        }
      }

      x.set(nextX);
      y.set(nextY);

      const last = lastPos.current;
      if (last) {
        const dt = Math.max(8, event.timeStamp - last.t);
        const dx = nextX - last.x;
        const dy = nextY - last.y;
        const speedPxPerMs = Math.sqrt(dx * dx + dy * dy) / dt;
        const strength = clamp(speedPxPerMs / 1.2, 0, 1);
        trailStrength.set(strength);
        trailAngle.set((Math.atan2(dy, dx) * 180) / Math.PI);
      }
      lastPos.current = { x: nextX, y: nextY, t: event.timeStamp };

      if (trailStopTimeoutRef.current) {
        window.clearTimeout(trailStopTimeoutRef.current);
      }
      trailStopTimeoutRef.current = window.setTimeout(() => {
        trailStrength.set(0);
        trailStopTimeoutRef.current = null;
      }, 120);

      setVisible(true);
    };

    const onPointerLeave = () => {
      setVisible(false);
      lastPos.current = null;
      trailStrength.set(0);
      if (trailStopTimeoutRef.current) {
        window.clearTimeout(trailStopTimeoutRef.current);
        trailStopTimeoutRef.current = null;
      }
    };

    const onPointerEnter = () => {
      setVisible(true);
    };

    const onPointerOver = (event: PointerEvent) => {
      updateHovering(event.target);
    };

    const onPointerOut = (event: PointerEvent) => {
      // If the pointer is moving to another element, use that to decide.
      updateHovering(event.relatedTarget);
    };

    const onPointerDown = (event: PointerEvent) => {
      setPulseKey((k) => k + 1);
      const burst = createBurst(event.clientX, event.clientY);
      setBursts((prev) => [burst, ...prev].slice(0, 8));
      window.setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== burst.id));
      }, 700);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("pointerenter", onPointerEnter, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      root.classList.remove("has-custom-cursor");

      if (trailStopTimeoutRef.current) {
        window.clearTimeout(trailStopTimeoutRef.current);
        trailStopTimeoutRef.current = null;
      }

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerenter", onPointerEnter);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [enabled, magnetEl, trailAngle, trailStrength, x, y]);

  if (!enabled) return null;

  const ringSize = hoveringInteractive ? 42 : 30;
  const ringThickness = hoveringInteractive ? 2 : 1;
  const interactiveColor = "hsl(var(--code-blue))";
  const baseColor = "hsl(var(--primary))";
  const matrixGreen = "hsl(var(--code-green))";
  const crosshairLen = hoveringInteractive ? 6 : 4;
  const crosshairThickness = 2;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Motion trail */}
      <motion.div
        className="absolute left-0 top-0 rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 22,
          height: 4,
          rotate: trailAngle,
          scaleX: trailScaleX,
          opacity: visible ? (hoveringInteractive ? trailOpacityInteractive : trailOpacityDefault) : 0,
          background: hoveringInteractive
            ? "linear-gradient(90deg, transparent, hsl(var(--code-blue) / 0.95), transparent)"
            : "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.90), transparent)",
          boxShadow: hoveringInteractive
            ? "0 0 16px hsl(var(--code-blue) / 0.35)"
            : "0 0 14px hsl(var(--primary) / 0.30)",
          filter: "blur(0.1px)",
        }}
      />

      {/* Matrix particles (click burst) */}
      <AnimatePresence>
        {bursts.map((burst) => (
          <motion.div
            key={burst.id}
            className="fixed left-0 top-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ transform: `translate(${burst.x}px, ${burst.y}px)` }}
          >
            {burst.particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute left-0 top-0"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: matrixGreen,
                  boxShadow: `0 0 12px ${matrixGreen}55`,
                }}
                initial={{ x: 0, y: 0, opacity: 0.95, scale: 1, rotate: 0 }}
                animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0.25, rotate: p.rotate }}
                transition={{ duration: 0.6, delay: p.delay, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* HUD Ring + Crosshair */}
      <motion.div
        className="absolute left-0 top-0"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
      >
        {/* Scan blip (only on hover) */}
        <AnimatePresence>
          {visible && hoveringInteractive && (
            <motion.div
              className="absolute left-1/2 top-1/2"
              style={{ translateX: "-50%", translateY: "-50%", width: ringSize, height: ringSize }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    borderRadius: 9999,
                    background:
                      "conic-gradient(from 0deg, transparent 0 310deg, hsl(var(--code-blue) / 0.0) 310deg, hsl(var(--code-blue) / 0.95) 335deg, transparent 360deg)",
                    boxShadow: "0 0 16px hsl(var(--code-blue) / 0.25)",
                    WebkitMaskImage:
                      "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
                    maskImage:
                      "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rotating dashed ring */}
        <motion.div
          className="rounded-full"
          style={{
            width: ringSize,
            height: ringSize,
            borderWidth: ringThickness,
            borderStyle: "dashed",
            borderColor: hoveringInteractive ? interactiveColor : "hsl(var(--primary) / 0.55)",
            background:
              "radial-gradient(circle at center, hsl(var(--primary) / 0.10), transparent 65%)",
          }}
          animate={{
            rotate: hoveringInteractive ? 360 : 180,
            scale: hoveringInteractive ? 1.05 : 1,
          }}
          transition={{
            rotate: {
              duration: hoveringInteractive ? 0.8 : 2.2,
              repeat: Infinity,
              ease: "linear",
            },
            scale: { type: "spring", stiffness: 500, damping: 35 },
          }}
        />

        {/* Crosshair ticks */}
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{
            translateX: "-50%",
            translateY: "-50%",
            width: ringSize,
            height: ringSize,
          }}
          animate={{
            opacity: hoveringInteractive ? 1 : 0.85,
            scale: hoveringInteractive ? 1.04 : 1,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        >
          {[
            { left: "50%", top: "-1px", w: `${crosshairThickness}px`, h: `${crosshairLen}px` },
            { left: "50%", bottom: "-1px", w: `${crosshairThickness}px`, h: `${crosshairLen}px` },
            { top: "50%", left: "-1px", w: `${crosshairLen}px`, h: `${crosshairThickness}px` },
            { top: "50%", right: "-1px", w: `${crosshairLen}px`, h: `${crosshairThickness}px` },
          ].map((tick, idx) => (
            <div
              key={`${String(tick.left ?? tick.right)}-${String(tick.top ?? tick.bottom)}`}
              className="absolute rounded-full"
              style={{
                backgroundColor: hoveringInteractive ? interactiveColor : baseColor,
                width: tick.w,
                height: tick.h,
                ...tick,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </motion.div>

        {/* Click pulse */}
        <AnimatePresence>
          {visible && (
            <motion.div
              key={pulseKey}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                translateX: "-50%",
                translateY: "-50%",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: hoveringInteractive ? "hsl(var(--code-blue) / 0.55)" : "hsl(var(--accent) / 0.55)",
              }}
              initial={{ width: 10, height: 10, opacity: 0.0, scale: 0.8 }}
              animate={{ width: 58, height: 58, opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dot */}
      <motion.div
        className="absolute left-0 top-0 rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: hoveringInteractive ? 7 : 6,
          height: hoveringInteractive ? 7 : 6,
          boxShadow: hoveringInteractive
            ? "0 0 14px hsl(var(--code-blue) / 0.55)"
            : "0 0 12px hsl(var(--primary) / 0.45)",
        }}
        animate={{
          opacity: visible ? 1 : 0,
          backgroundColor: hoveringInteractive ? interactiveColor : baseColor,
        }}
        transition={{ type: "spring", stiffness: 800, damping: 35 }}
      />
    </div>
  );
}
