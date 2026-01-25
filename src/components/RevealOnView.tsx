import { motion, useInView } from "framer-motion";
import { PropsWithChildren, useRef } from "react";

type RevealOnViewProps = PropsWithChildren<{
  className?: string;
  amount?: number;
}>;

const RevealOnView = ({ children, className, amount = 0.2 }: RevealOnViewProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount, margin: "-10% 0px -10% 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnView;
