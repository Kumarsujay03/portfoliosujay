import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const HomeBackground = () => {
  const reduceMotion = useReducedMotion();
  const [enableMotion, setEnableMotion] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    const id = requestAnimationFrame(() => setEnableMotion(true));
    return () => cancelAnimationFrame(id);
  }, [reduceMotion]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0">
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.12)_0%,_transparent_70%)]" />

      {/* Grid */}
      <motion.div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border) / 0.22) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.22) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.0) 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.0) 72%)",
        }}
        animate={
          !reduceMotion && enableMotion
            ? {
                backgroundPosition: ["0px 0px", "56px 56px"],
              }
            : undefined
        }
        transition={
          !reduceMotion && enableMotion
            ? {
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              }
            : undefined
        }
      />

      {/* Floating particles */}
      {!reduceMotion && enableMotion && (
        <>
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.span
              key={`particle-${(i * 7) % 100}-${(i * 11) % 100}`}
              className="absolute rounded-full"
              style={{
                left: `${(i * 7) % 100}%`,
                top: `${(i * 11) % 100}%`,
                width: i % 3 === 0 ? 2 : 1,
                height: i % 3 === 0 ? 2 : 1,
                backgroundColor: i % 4 === 0 ? "hsl(var(--code-green))" : "hsl(var(--code-blue))",
                opacity: 0.2,
              }}
              animate={{
                y: [0, i % 2 === 0 ? -12 : 12, 0],
                x: [0, i % 2 === 0 ? 8 : -8, 0],
                opacity: [0.1, 0.22, 0.1],
              }}
              transition={{
                duration: 10 + (i % 7),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </>
      )}

      {/* Floating code snippets (subtle, across the page) */}
      <motion.div
        animate={enableMotion ? { y: [0, -20, 0] } : undefined}
        transition={enableMotion ? { duration: 10, repeat: Infinity, ease: "easeInOut" } : undefined}
        className="absolute top-[20%] left-8 hidden md:block opacity-30"
      >
        <pre className="font-mono text-xs text-primary drop-shadow-[0_0_8px_rgba(56,189,248,0.25)]">
          {`const developer = {
              name: "Sujay Kumar",
              skills: ["React", "Node"],
              passion: "∞"
            };
          `}
        </pre>
      </motion.div>

      <motion.div
        animate={enableMotion ? { y: [0, 20, 0] } : undefined}
        transition={enableMotion ? { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 } : undefined}
        className="absolute top-[62%] right-8 hidden md:block opacity-30"
      >
        <pre className="font-mono text-xs text-secondary drop-shadow-[0_0_8px_rgba(45,212,191,0.25)]">
          {`function createAwesome() {
            return ideas.map(
              idea => implement(idea)
            );
          }
        `}
        </pre>
      </motion.div>
    </div>
  );
};

export default HomeBackground;
