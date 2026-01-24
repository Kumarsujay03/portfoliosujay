import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const navItems = [
    { label: "about", href: "#about", isAnchor: true },
    { label: "skills", href: "#skills", isAnchor: true },
    { label: "certs", href: "#certifications", isAnchor: true },
    { label: "work", href: "#experience", isAnchor: true },
    { label: "projects", href: "#projects", isAnchor: true },
    { label: "blog", href: "/blog", isAnchor: false },
    { label: "contact", href: "#contact", isAnchor: true },
  ];

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const renderNavLink = (item: typeof navItems[0], index: number, isMobile = false) => {
    const className = isMobile
      ? "font-mono text-base text-muted-foreground hover:text-primary transition-colors flex items-center justify-between py-3 border-b border-border/30"
      : "font-mono text-xs text-muted-foreground hover:text-primary transition-colors";

    if (item.isAnchor && isHomePage) {
      return (
        <motion.a
          key={item.label}
          href={item.href}
          onClick={handleNavClick}
          initial={isMobile ? { opacity: 0, x: 20 } : { opacity: 0, y: -20 }}
          animate={isMobile ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 + (isMobile ? 0.1 : 0.2) }}
          className={className}
        >
          {item.label}()
          {isMobile && <ChevronRight className="w-4 h-4 opacity-50" />}
        </motion.a>
      );
    }

    if (item.isAnchor && !isHomePage) {
      return (
        <motion.div key={item.label}>
          <Link
            to={`/${item.href}`}
            onClick={handleNavClick}
            className={className}
          >
            {item.label}()
            {isMobile && <ChevronRight className="w-4 h-4 opacity-50" />}
          </Link>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={item.label}
        initial={isMobile ? { opacity: 0, x: 20 } : { opacity: 0, y: -20 }}
        animate={isMobile ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 + (isMobile ? 0.1 : 0.2) }}
      >
        <Link to={item.href} onClick={handleNavClick} className={className}>
          {item.label}()
          {isMobile && <ChevronRight className="w-4 h-4 opacity-50" />}
        </Link>
      </motion.div>
    );
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-mono text-base font-bold text-primary">
            {"<Dev />"}
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item, index) => renderNavLink(item, index))}
          </nav>
          
          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              href="/resume.pdf"
              download
              className="font-mono text-xs px-3 py-2 border border-border text-muted-foreground rounded hover:border-primary hover:text-primary transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              cv
            </motion.a>
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              href={isHomePage ? "#contact" : "/#contact"}
              className="font-mono text-xs px-3 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-all"
            >
              hire()
            </motion.a>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 md:hidden"
            />
            
            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-72 bg-card border-l border-border z-50 md:hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <span className="font-mono text-sm text-muted-foreground">menu.tsx</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="p-4 flex flex-col">
                {navItems.map((item, index) => renderNavLink(item, index, true))}
                
                <div className="flex flex-col gap-3 pt-6 mt-4 border-t border-border">
                  <motion.a
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    href="/resume.pdf"
                    download
                    onClick={handleNavClick}
                    className="font-mono text-sm px-4 py-2.5 border border-border text-muted-foreground rounded hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    download_cv()
                  </motion.a>
                  <motion.a
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 }}
                    href={isHomePage ? "#contact" : "/#contact"}
                    onClick={handleNavClick}
                    className="font-mono text-sm px-4 py-2.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-all text-center"
                  >
                    hire_me()
                  </motion.a>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
