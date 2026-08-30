import { Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { prefetchRoute } from "@/lib/routePrefetch";
import SiteStats from "@/components/SiteStats";
import Logo from "@/components/Logo";

type FooterProps = {
  showSocialLinks?: boolean;
};

const socials = [
  { icon: Github, href: "https://github.com/Kumarsujay03", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/kumarsujay03/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:mr.sujaykumar03@gmail.com", label: "Email" },
];

const navLinks = [
  { label: "about", href: "/about" },
  { label: "work", href: "/work" },
  { label: "projects", href: "/projects" },
  { label: "writing", href: "/blog" },
  { label: "contact", href: "/contact" },
];

const Footer = ({ showSocialLinks }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/60">
      <div className="container-page py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="h-6 w-6 text-foreground" />
              <span className="font-mono text-sm font-medium text-foreground">Sujay Kumar</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Machine learning researcher &amp; engineer. Building intelligent systems and
              writing about the journey.
            </p>
            <div className="mt-4 flex items-center gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  aria-label={social.label}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <span className="mono-label mb-1">navigate</span>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onMouseEnter={() => prefetchRoute(link.href)}
                className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-muted-foreground/60">
            © {currentYear} Sujay Kumar · Built with curiosity.
            <span className="ml-2 rounded-full border border-border px-2 py-0.5 text-muted-foreground/70">
              v2.0
            </span>
          </p>
          {showSocialLinks !== false && <SiteStats />}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
