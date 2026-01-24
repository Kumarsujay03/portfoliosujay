import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Heart, Coffee, Terminal } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Mail, href: "mailto:hello@example.com", label: "Email" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-12 border-t border-border relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto px-6 relative z-10">
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

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-8"
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ y: -4, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-lg border border-border bg-card/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors group"
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5 group-hover:animate-pulse" />
            </motion.a>
          ))}
        </motion.div>

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
              "John Doe"
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
            className="font-mono text-xs text-muted-foreground/60 flex items-center justify-center gap-2"
          >
            <span className="text-code-green">git commit</span>
            <span>-m</span>
            <span className="text-code-orange flex items-center gap-1">
              "Built with{" "}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-3 h-3 text-destructive inline fill-destructive" />
              </motion.span>
              {" "}and{" "}
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Coffee className="w-3 h-3 text-code-orange inline" />
              </motion.span>
              "
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="font-mono text-xs text-muted-foreground/40 pt-4"
          >
            <span className="syntax-comment">{"// "}</span>
            © {currentYear} All rights reserved
          </motion.p>
        </motion.div>

        {/* Animated bottom border */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.8 }}
        />
      </div>
    </motion.footer>
  );
};

export default Footer;
