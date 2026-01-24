import { motion } from "framer-motion";

type FooterBridgeProps = {
  heightClassName?: string;
  className?: string;
};

const FooterBridge = ({ heightClassName = "h-20", className }: FooterBridgeProps) => {
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden ${heightClassName} pointer-events-none ${className ?? ""}`.trim()}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
        }}
      />
    </div>
  );
};

export default FooterBridge;
