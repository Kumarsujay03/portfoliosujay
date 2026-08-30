import NeuralField from "@/components/NeuralField";

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
  density?: number;
};

const densityByVariant: Record<PageBackgroundVariant, number> = {
  about: 60,
  projects: 55,
  skills: 58,
  certs: 55,
  work: 60,
  blog: 55,
  blogPost: 45,
  contact: 65,
};

const PageBackground = ({ variant = "projects", density }: PageBackgroundProps) => {
  const resolvedDensity = density ?? densityByVariant[variant];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--foreground)/0.035)_0%,_transparent_55%)]" />
      <NeuralField density={resolvedDensity} connectionDistance={150} intensity={0.7} />
    </div>
  );
};

export default PageBackground;
