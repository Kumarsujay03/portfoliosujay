import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, ArrowUpRight } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { prefetchRoute } from "@/lib/routePrefetch";

const navItems = [
  { label: "about", href: "/about" },
  { label: "skills", href: "/skills" },
  { label: "work", href: "/work" },
  { label: "projects", href: "/projects" },
  { label: "certs", href: "/certs" },
  { label: "writing", href: "/blog" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = () => setIsMenuOpen(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "font-mono text-[13px] tracking-tight transition-colors relative py-1",
      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
    ].join(" ");

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl"
      >
        <div className="container-page h-14 flex items-center justify-between">
          <Link
            to="/"
            aria-label="Home"
            onClick={() => {
              if (location.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-center gap-2.5"
          >
            <Logo className="h-6 w-6 text-foreground transition-transform group-hover:scale-105" animated />
            <span className="font-mono text-sm font-medium text-foreground [word-spacing:-0.2em]">
              Sujay Kumar
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                end
                onClick={handleNavClick}
                onMouseEnter={() => prefetchRoute(item.href)}
                onFocus={() => prefetchRoute(item.href)}
                className={linkClass}
              >
                {({ isActive }) => (
                  <span className="relative">
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-px bg-foreground"
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <a
              href="/Resume_Sujay.pdf"
              download
              className="hover-lift-sm font-mono text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              CV
            </a>
            <Link
              to="/contact"
              onMouseEnter={() => prefetchRoute("/contact")}
              className="hover-lift-sm font-mono text-xs px-3.5 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 inline-flex items-center gap-1"
            >
              contact
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed top-0 right-0 h-full w-72 bg-card border-l border-border z-50 md:hidden"
            >
              <div className="p-5 border-b border-border flex items-center justify-between">
                <span className="mono-label">menu</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-5 flex flex-col gap-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 + 0.05 }}
                  >
                    <NavLink
                      to={item.href}
                      end
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        [
                          "font-mono text-sm py-3 flex items-center justify-between border-b border-border/40 transition-colors",
                          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                        ].join(" ")
                      }
                    >
                      {item.label}
                      <ArrowUpRight className="w-4 h-4 opacity-40" />
                    </NavLink>
                  </motion.div>
                ))}

                <div className="flex flex-col gap-3 pt-6 mt-2">
                  <a
                    href="/Resume_Sujay.pdf"
                    download
                    onClick={handleNavClick}
                    className="hover-lift-sm font-mono text-sm px-4 py-2.5 rounded-full border border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    download CV
                  </a>
                  <Link
                    to="/contact"
                    onClick={handleNavClick}
                    className="hover-lift-sm font-mono text-sm px-4 py-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 text-center"
                  >
                    contact
                  </Link>
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
