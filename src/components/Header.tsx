import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, ChevronRight } from "lucide-react";
import { useLocation, Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { prefetchRoute } from "@/lib/routePrefetch";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const logoText = "<Dev />";
  const [typedLogo, setTypedLogo] = useState("");
  const [isLogoTyping, setIsLogoTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    setTypedLogo("");
    setIsLogoTyping(true);

    const intervalId = window.setInterval(() => {
      index += 1;
      setTypedLogo(logoText.slice(0, index));

      if (index >= logoText.length) {
        window.clearInterval(intervalId);
        setIsLogoTyping(false);
      }
    }, 90);

    return () => window.clearInterval(intervalId);
  }, []);

  const navItems = [
    { label: "about", href: "/about", isAnchor: false },
    { label: "skills", href: "/skills", isAnchor: false },
    { label: "work", href: "/work", isAnchor: false },
    { label: "certs", href: "/certs", isAnchor: false },
    { label: "projects", href: "/projects", isAnchor: false },
    { label: "blog", href: "/blog", isAnchor: false },
    { label: "contact", href: "/contact", isAnchor: false },
  ];

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const renderNavLink = (item: typeof navItems[0], index: number, isMobile = false) => {
    const baseClassName = isMobile
      ? "font-mono text-base text-muted-foreground hover:text-primary transition-colors flex items-center justify-between py-3 border-b border-border/30"
      : "font-mono text-xs text-muted-foreground hover:text-primary transition-colors";

    const getClassName = ({ isActive }: { isActive: boolean }) => {
      const activeGlowClassName = isActive
        ? "text-primary drop-shadow-[0_0_10px_rgba(45,212,191,0.35)]"
        : "";
      return `${baseClassName} ${activeGlowClassName}`.trim();
    };

    const className = baseClassName;

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
        <NavLink
          to={item.href}
          end
          onClick={handleNavClick}
          onMouseEnter={() => prefetchRoute(item.href)}
          onFocus={() => prefetchRoute(item.href)}
          className={getClassName}
        >
          {item.label}()
          {isMobile && <ChevronRight className="w-4 h-4 opacity-50" />}
        </NavLink>
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
          <Link
            to="/"
            className="font-mono text-base font-bold text-primary"
            aria-label="Home"
            onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <motion.span
              className="inline-flex items-center min-w-[7ch]"
              animate={{
                textShadow: [
                  "0 0 0px rgba(45, 212, 191, 0.0)",
                  "0 0 14px rgba(45, 212, 191, 0.35)",
                  "0 0 0px rgba(45, 212, 191, 0.0)",
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              {typedLogo || "\u00A0"}
            </motion.span>
            <motion.span
              className="ml-1 text-primary/80"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: isLogoTyping ? 1.2 : 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              _
            </motion.span>
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
              href="/Resume_Sujay.pdf"
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
              href="/#contact"
              onMouseEnter={() => prefetchRoute("/")}
              onFocus={() => prefetchRoute("/")}
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
                    href="/Resume_Sujay.pdf"
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
                    href="/#contact"
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
