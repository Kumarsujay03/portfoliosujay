import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="py-8 border-t border-border"
    >
      <div className="container mx-auto px-6 text-center">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="syntax-comment">{"// "}</span>
          Designed & Built by{" "}
          <a href="#" className="text-primary hover:underline">
            John Doe
          </a>
        </p>
        <p className="font-mono text-xs text-muted-foreground/60 mt-2">
          <span className="text-code-green">git commit</span> -m{" "}
          <span className="text-code-orange">"Built with ❤️ and lots of ☕"</span>
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
