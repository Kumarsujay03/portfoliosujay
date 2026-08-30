import NeuralField from "@/components/NeuralField";

const HomeBackground = () => {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--background))_65%,hsl(var(--muted)/0.2)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--foreground)/0.05)_0%,_transparent_60%)]" />
      <NeuralField density={80} connectionDistance={160} intensity={1} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_55%,_hsl(var(--background)/0.55)_100%)]" />
    </div>
  );
};

export default HomeBackground;
