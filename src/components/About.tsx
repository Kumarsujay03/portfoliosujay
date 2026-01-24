import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const codeSnippet = `const aboutMe = {
  location: "San Francisco, CA",
  education: "CS @ Stanford",
  interests: [
    "Open Source",
    "System Design",
    "UI/UX",
    "Coffee ☕"
  ],
  currentlyLearning: "Rust",
  funFact: "I debug with console.log"
};`;

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-mono text-sm text-primary mb-2">
            {"// 01. About"}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-12">
            <span className="syntax-keyword">const</span>{" "}
            <span className="syntax-function">aboutMe</span>{" "}
            <span className="text-foreground">=</span>{" "}
            <span className="syntax-string">"..."</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Hello! I'm <span className="text-primary">John</span>, a passionate developer 
                who loves turning complex problems into simple, beautiful solutions. My journey 
                in tech started when I wrote my first "Hello, World!" program and got hooked 
                on the magic of making computers do things.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, I specialize in building robust web applications using modern 
                technologies. I'm particularly interested in{" "}
                <span className="text-code-purple">distributed systems</span>,{" "}
                <span className="text-code-blue">developer tooling</span>, and{" "}
                <span className="text-code-green">performance optimization</span>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                When I'm not coding, you'll find me contributing to open source, 
                writing technical blog posts, or exploring the latest in tech.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="terminal-window"
            >
              <div className="terminal-header">
                <div className="terminal-dot bg-destructive" />
                <div className="terminal-dot bg-accent" />
                <div className="terminal-dot bg-code-green" />
                <span className="ml-4 font-mono text-xs text-muted-foreground">about.js</span>
              </div>
              <div className="terminal-body">
                <pre className="text-sm">
                  <code>
                    {codeSnippet.split('\n').map((line, i) => (
                      <div key={i} className="flex">
                        <span className="text-muted-foreground/50 w-6 select-none">{i + 1}</span>
                        <span className="ml-4">
                          {line.includes('const') && (
                            <>
                              <span className="syntax-keyword">const</span>
                              {line.replace('const', '')}
                            </>
                          )}
                          {line.includes(':') && !line.includes('const') && (
                            <>
                              <span className="text-code-blue">{line.split(':')[0]}</span>
                              <span className="text-foreground">:</span>
                              <span className="syntax-string">{line.split(':').slice(1).join(':')}</span>
                            </>
                          )}
                          {!line.includes('const') && !line.includes(':') && (
                            <span className="text-foreground">{line}</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
