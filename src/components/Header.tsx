import { motion } from "framer-motion";

const Header = () => {
  const navItems = [
    { label: "about()", href: "#about" },
    { label: "skills()", href: "#skills" },
    { label: "projects()", href: "#projects" },
    { label: "contact()", href: "#contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-mono text-lg font-bold text-primary">
          {"<Dev />"}
        </a>
        
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </motion.a>
          ))}
        </nav>
        
        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          href="#contact"
          className="font-mono text-sm px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition-all glow-primary"
        >
          hire_me()
        </motion.a>
      </div>
    </motion.header>
  );
};

export default Header;
