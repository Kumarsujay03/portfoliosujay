import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const roles = [
  "Software Engineer",
  "Web Application Developer",
  "Machine Learning Practitioner",
  "Data-Driven Problem Solver",
  "Applied AI Enthusiast"
];

const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const currentRole = roles[roleIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentRole.length) {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100);
    
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <section className="min-h-screen min-h-[100svh] flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.1)_0%,_transparent_70%)]" />
      
      {/* Floating code snippets */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-10 hidden lg:block opacity-20"
      >
        <pre className="font-mono text-xs text-primary">
          {`const developer = {
              name: "Sujay Kumar",
              skills: ["React", "Node"],
              passion: "∞"
            };
          `}
        </pre>
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-10 hidden lg:block opacity-20"
      >
        <pre className="font-mono text-xs text-secondary">
          {`function createAwesome() {
            return ideas.map(
              idea => implement(idea)
            );
          }
        `}
        </pre>
      </motion.div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Terminal window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="terminal-window"
          >
            <div className="terminal-header">
              <div className="terminal-dot bg-destructive" />
              <div className="terminal-dot bg-accent" />
              <div className="terminal-dot bg-code-green" />
              <span className="ml-4 font-mono text-xs text-muted-foreground">~/portfolio</span>
            </div>
            
            <div className="terminal-body space-y-4">
              <div>
                <span className="text-code-green">➜</span>
                <span className="text-code-blue ml-2">~</span>
                <span className="ml-2">whoami</span>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pl-4"
              >
                <p className="text-muted-foreground">// Hello, World! I'm</p>
                <h1 className="text-4xl md:text-6xl font-bold mt-2">
                  <span className="text-gradient">Sujay Kumar</span>
                </h1>
                <p className="text-xl md:text-2xl text-foreground mt-2 h-8 md:h-10">
                  {displayText}
                  <span className="cursor-blink text-primary">|</span>
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <span className="text-code-green">➜</span>
                <span className="text-code-blue ml-2">~</span>
                <span className="ml-2">cat description.txt</span>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-muted-foreground pl-4 max-w-2xl"
              >
                I build scalable software with clean, maintainable code. 
                Passionate about machine learning and intelligent system design.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="flex gap-4 pt-4"
              >
                <a
                  href="#projects"
                  className="font-mono px-6 py-3 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity glow-primary"
                >
                  view_projects()
                </a>
                <a
                  href="#contact"
                  className="font-mono px-6 py-3 border border-border text-foreground rounded hover:border-primary hover:text-primary transition-colors"
                >
                  get_in_touch()
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
