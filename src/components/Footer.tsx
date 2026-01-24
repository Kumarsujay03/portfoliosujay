import { motion } from "framer-motion";
import { Coffee, Terminal, Github, Linkedin, Mail } from "lucide-react";

type FooterProps = {
  showSocialLinks?: boolean;
};

const Footer = ({ showSocialLinks }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const socials = [
    { icon: Github, href: "https://github.com/Kumarsujay03", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/kumarsujay03/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:mr.sujaykumar03@gmail.com", label: "Email" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-12 relative overflow-hidden"
    >
      {/* Animated background gradient - continues from contact section */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Terminal-style header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <Terminal className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm text-muted-foreground">
            <span className="text-code-green">~</span> footer.tsx
          </span>
        </motion.div>

        {showSocialLinks && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="flex justify-center gap-4 pt-2 mb-8"
          >
            {socials.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                whileHover={{ y: -2 }}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </motion.a>
            ))}
          </motion.div>
        )}

        {/* Code-style attribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-3"
        >
          <div className="font-mono text-sm">
            <motion.span
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <span className="syntax-keyword">const</span>{" "}
              <span className="text-code-blue">developer</span>{" "}
              <span className="text-foreground">=</span>{" "}
            </motion.span>
            <motion.a
              href="#"
              className="text-primary hover:underline"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
            >
              "Sujay Kumar"
            </motion.a>
            <motion.span
              className="text-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              ;
            </motion.span>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
            className="font-mono text-xs text-muted-foreground/60 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center px-2"
          >
            <span className="text-code-green">git commit</span>
            <span>-m</span>
            <span className="text-code-orange flex flex-wrap items-center justify-center gap-1 text-center whitespace-normal break-words">
              "Built with curiosity and continuous learning{" "}
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex"
              >
                <Coffee className="w-3 h-3 text-code-orange inline" />
              </motion.span>
              "
            </span>
          </motion.div>

          {/* Decorative animated separator */}
          <motion.div
            className="mx-auto my-6 h-px w-64 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.8 }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1 }}
            className="font-mono text-xs text-muted-foreground/40"
          >
            <span className="syntax-comment">{"// "}</span>
            © {currentYear} All rights reserved
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
