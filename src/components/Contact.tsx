import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const socials = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "mailto:hello@johndoe.dev", label: "Email" },
  ];

  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-mono text-sm text-primary mb-2">
            {"// 04. Contact"}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="syntax-keyword">async function</span>{" "}
            <span className="syntax-function">getInTouch</span>
            <span className="text-foreground">()</span>
          </h3>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="code-block text-left mb-8"
          >
            <pre className="text-sm">
              <span className="syntax-comment">/**</span>
              <br />
              <span className="syntax-comment"> * I'm always open to new opportunities,</span>
              <br />
              <span className="syntax-comment"> * collaborations, or just a friendly chat!</span>
              <br />
              <span className="syntax-comment"> * </span>
              <br />
              <span className="syntax-comment"> * Whether you have a question or just want</span>
              <br />
              <span className="syntax-comment"> * to say hi, my inbox is always open.</span>
              <br />
              <span className="syntax-comment"> */</span>
            </pre>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            href="mailto:hello@johndoe.dev"
            className="inline-flex items-center gap-2 font-mono px-8 py-4 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity glow-primary text-lg"
          >
            <Mail size={20} />
            sendEmail()
          </motion.a>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-6 mt-12"
          >
            {socials.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-3 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
                aria-label={social.label}
              >
                <social.icon size={24} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
