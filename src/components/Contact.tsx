import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Mail, Github, Linkedin } from "lucide-react";
import RevealOnView from "@/components/RevealOnView";

type ContactProps = {
  hideLabel?: boolean;
  animateOnView?: boolean;
};

const Contact = ({ hideLabel, animateOnView = false }: ContactProps) => {
  const ref = useRef(null);
  const codeRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isCodeInView = useInView(codeRef, { once: true, margin: "-50px" });

  const commentLines = useMemo(
    () => [
      "/**",
      " * I'm always open to new opportunities,",
      " * collaborations, or just a friendly chat!",
      " * ",
      " * Whether you have a question or just want",
      " * to say hi, my inbox is always open.",
      " */",
    ],
    [],
  );

  const [typedCommentLines, setTypedCommentLines] = useState<string[]>([]);
  const [commentLineIndex, setCommentLineIndex] = useState(0);
  const [commentCharIndex, setCommentCharIndex] = useState(0);
  const [isCommentTyping, setIsCommentTyping] = useState(false);

  useEffect(() => {
    if (isCodeInView && !isCommentTyping) {
      setIsCommentTyping(true);
    }
  }, [isCodeInView, isCommentTyping]);

  useEffect(() => {
    if (!isCommentTyping) return;
    if (commentLineIndex >= commentLines.length) return;

    const currentLine = commentLines[commentLineIndex];

    if (commentCharIndex <= currentLine.length) {
      const timeout = setTimeout(() => {
        setTypedCommentLines((prev) => {
          const next = [...prev];
          next[commentLineIndex] = currentLine.slice(0, commentCharIndex);
          return next;
        });
        setCommentCharIndex((prev) => prev + 1);
      }, 12);

      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setCommentLineIndex((prev) => prev + 1);
      setCommentCharIndex(0);
    }, 45);

    return () => clearTimeout(timeout);
  }, [isCommentTyping, commentLineIndex, commentCharIndex, commentLines]);

  const socials = [
    { icon: Github, href: "https://github.com/Kumarsujay03", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/kumarsujay03/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:mr.sujaykumar03@gmail.com", label: "Email" },
  ];

  return (
    <section id="contact" className="py-12 relative overflow-hidden">
      {/* Animated gradient that fades in from top - seamlessly connects to footer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {animateOnView ? (
          <RevealOnView>
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center"
            >
          {!hideLabel && (
            <h2 className="font-mono text-sm text-primary mb-2">
              {"// 06. Contact"}
            </h2>
          )}
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
            ref={codeRef}
          >
            <pre className="text-sm whitespace-pre-wrap">
              {commentLines.map((_, i) => (
                <span key={i}>
                  <span className="syntax-comment">{typedCommentLines[i] ?? ""}</span>
                  {"\n"}
                </span>
              ))}
            </pre>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            href="mailto:sujayjaiswal03@gmail.com"
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
          </RevealOnView>
        ) : (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            {!hideLabel && (
              <h2 className="font-mono text-sm text-primary mb-2">
                {"// 06. Contact"}
              </h2>
            )}
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
              ref={codeRef}
            >
              <pre className="text-sm whitespace-pre-wrap">
                {commentLines.map((_, i) => (
                  <span key={i}>
                    <span className="syntax-comment">{typedCommentLines[i] ?? ""}</span>
                    {"\n"}
                  </span>
                ))}
              </pre>
            </motion.div>

            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              href="mailto:mr.sujaykumar@gmail.com"
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
        )}
      </div>
    </section>
  );
};

export default Contact;
