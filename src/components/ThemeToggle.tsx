import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative h-8 w-8 rounded-full border border-border hover:border-foreground/40 transition-colors flex items-center justify-center overflow-hidden text-muted-foreground hover:text-foreground"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ y: theme === "dark" ? 0 : -32, opacity: theme === "dark" ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <Moon className="w-4 h-4" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ y: theme === "light" ? 0 : 32, opacity: theme === "light" ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <Sun className="w-4 h-4" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
