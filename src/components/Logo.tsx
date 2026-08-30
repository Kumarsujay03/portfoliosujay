type LogoProps = {
  className?: string;
  animated?: boolean;
};

const Logo = ({ className, animated = false }: LogoProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    role="img"
    aria-label="Sujay Kumar logo"
  >
    <g stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.55">
      <line x1="5" y1="8" x2="13" y2="12" />
      <line x1="5" y1="16" x2="13" y2="12" />
      <line x1="13" y1="12" x2="19" y2="7" />
      <line x1="13" y1="12" x2="19" y2="17" />
    </g>

    <g fill="currentColor">
      <circle cx="5" cy="8" r="1.9" />
      <circle cx="5" cy="16" r="1.9" />
      <circle cx="13" cy="12" r="2.2" />
      <circle cx="19" cy="17" r="1.9" />
    </g>

    <circle
      cx="19"
      cy="7"
      r="2.2"
      className={`fill-accent ${animated ? "animate-pulse" : ""}`.trim()}
    />
  </svg>
);

export default Logo;
