import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded border border-border bg-muted/50 hover:border-primary transition-colors flex items-center justify-center overflow-hidden"
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          y: theme === "dark" ? 0 : -36,
          opacity: theme === "dark" ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <Moon className="w-5 h-5 text-primary" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          y: theme === "light" ? 0 : 36,
          opacity: theme === "light" ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <Sun className="w-5 h-5 text-accent" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
