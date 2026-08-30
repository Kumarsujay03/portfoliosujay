type FooterBridgeProps = {
  heightClassName?: string;
  className?: string;
};

const FooterBridge = ({ heightClassName = "h-16", className }: FooterBridgeProps) => {
  return (
    <div
      aria-hidden
      className={`relative ${heightClassName} pointer-events-none ${className ?? ""}`.trim()}
    >
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
};

export default FooterBridge;
