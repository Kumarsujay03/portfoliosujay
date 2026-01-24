import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "about()", href: "#about" },
    { label: "skills()", href: "#skills" },
    { label: "experience()", href: "#experience" },
    { label: "projects()", href: "#projects" },
    { label: "blog()", href: "#blog" },
    { label: "contact()", href: "#contact" },
  ];

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

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
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
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
        
        {/* Desktop CTA Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            href="/resume.pdf"
            download
            className="font-mono text-sm px-4 py-2 border border-border text-muted-foreground rounded hover:border-primary hover:text-primary transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            resume.pdf
          </motion.a>
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            href="#contact"
            className="font-mono text-sm px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition-all glow-primary"
          >
            hire_me()
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={handleNavClick}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="font-mono text-lg text-muted-foreground hover:text-primary transition-colors py-2 border-b border-border/50"
                >
                  {item.label}
                </motion.a>
              ))}
              
              <div className="flex flex-col gap-3 pt-4">
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  href="/resume.pdf"
                  download
                  onClick={handleNavClick}
                  className="font-mono text-sm px-4 py-3 border border-border text-muted-foreground rounded hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  download_resume()
                </motion.a>
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 + 0.05 }}
                  href="#contact"
                  onClick={handleNavClick}
                  className="font-mono text-sm px-4 py-3 border border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition-all glow-primary text-center"
                >
                  hire_me()
                </motion.a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
