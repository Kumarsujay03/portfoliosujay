import { motion, useReducedMotion } from "framer-motion";

type PageBackgroundVariant =
  | "about"
  | "projects"
  | "skills"
  | "certs"
  | "work"
  | "blog"
  | "blogPost"
  | "contact";

type PageBackgroundProps = {
  variant?: PageBackgroundVariant;
  gridSizePx?: number;
  gridOpacity?: number;
  particleCount?: number;
  glowOpacity?: number;
};

const variantConfig: Record<
  PageBackgroundVariant,
  {
    gridSizePx: number;
    gridOpacity: number;
    particleCount: number;
    glowOpacity: number;
    glowPosition: "center" | "top" | "bottom" | "left" | "right";
    particleBias: "blue" | "green" | "mixed";
  }
> = {
  about: {
    gridSizePx: 70,
    gridOpacity: 0.2,
    particleCount: 9,
    glowOpacity: 0.09,
    glowPosition: "left",
    particleBias: "mixed",
  },
  projects: {
    gridSizePx: 64,
    gridOpacity: 0.23,
    particleCount: 11,
    glowOpacity: 0.1,
    glowPosition: "center",
    particleBias: "blue",
  },
  skills: {
    gridSizePx: 76,
    gridOpacity: 0.18,
    particleCount: 8,
    glowOpacity: 0.08,
    glowPosition: "top",
    particleBias: "green",
  },
  certs: {
    gridSizePx: 80,
    gridOpacity: 0.19,
    particleCount: 8,
    glowOpacity: 0.085,
    glowPosition: "right",
    particleBias: "mixed",
  },
  work: {
    gridSizePx: 68,
    gridOpacity: 0.22,
    particleCount: 10,
    glowOpacity: 0.095,
    glowPosition: "bottom",
    particleBias: "blue",
  },
  blog: {
    gridSizePx: 84,
    gridOpacity: 0.17,
    particleCount: 7,
    glowOpacity: 0.08,
    glowPosition: "top",
    particleBias: "green",
  },
  blogPost: {
    gridSizePx: 74,
    gridOpacity: 0.2,
    particleCount: 9,
    glowOpacity: 0.09,
    glowPosition: "center",
    particleBias: "mixed",
  },
  contact: {
    gridSizePx: 72,
    gridOpacity: 0.21,
    particleCount: 9,
    glowOpacity: 0.1,
    glowPosition: "bottom",
    particleBias: "green",
  },
};

const getGlowGradient = (glowOpacity: number, glowPosition: "center" | "top" | "bottom" | "left" | "right") => {
  const pos =
    glowPosition === "top"
      ? "ellipse at top"
      : glowPosition === "bottom"
        ? "ellipse at bottom"
        : glowPosition === "left"
          ? "ellipse at left"
          : glowPosition === "right"
            ? "ellipse at right"
            : "ellipse at center";

  return `radial-gradient(${pos}, hsl(var(--primary)/${glowOpacity}) 0%, transparent 68%)`;
};

const PageBackground = ({
  variant = "projects",
  gridSizePx,
  gridOpacity,
  particleCount,
  glowOpacity,
}: PageBackgroundProps) => {
  const reduceMotion = useReducedMotion();
  const config = variantConfig[variant];
  const resolvedGridSize = gridSizePx ?? config.gridSizePx;
  const resolvedGridOpacity = gridOpacity ?? config.gridOpacity;
  const resolvedParticleCount = particleCount ?? config.particleCount;
  const resolvedGlowOpacity = glowOpacity ?? config.glowOpacity;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Soft center glow */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: getGlowGradient(resolvedGlowOpacity, config.glowPosition) }}
      />

      {/* Subtle animated grid */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: resolvedGridOpacity,
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border) / 0.18) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.18) 1px, transparent 1px)",
          backgroundSize: `${resolvedGridSize}px ${resolvedGridSize}px`,
          maskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.0) 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.0) 75%)",
        }}
        animate={
          reduceMotion
            ? undefined
            : {
                backgroundPosition: ["0px 0px", `${resolvedGridSize}px ${resolvedGridSize}px`],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 14,
                repeat: Infinity,
                ease: "linear",
              }
        }
      />

      {/* Tiny drifting particles */}
      {!reduceMotion && (
        <>
          {Array.from({ length: resolvedParticleCount }).map((_, i) => (
            <motion.span
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${(i * 9) % 100}%`,
                top: `${(i * 13) % 100}%`,
                width: i % 3 === 0 ? 2 : 1,
                height: i % 3 === 0 ? 2 : 1,
                backgroundColor:
                  config.particleBias === "green"
                    ? "hsl(var(--code-green))"
                    : config.particleBias === "blue"
                      ? "hsl(var(--code-blue))"
                      : i % 4 === 0
                        ? "hsl(var(--code-green))"
                        : "hsl(var(--code-blue))",
                opacity: 0.18,
              }}
              animate={{
                y: [0, i % 2 === 0 ? -16 : 16, 0],
                x: [0, i % 2 === 0 ? 10 : -10, 0],
                opacity: [0.12, 0.22, 0.12],
              }}
              transition={{
                duration: 7 + (i % 5),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default PageBackground;
