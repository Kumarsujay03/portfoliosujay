import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

type AboutProps = {
  hideLabel?: boolean;
};

const About = ({ hideLabel }: AboutProps) => {
  const ref = useRef(null);
  const codeRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isCodeInView = useInView(codeRef, { once: true, margin: "-50px" });
  
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const codeLines = [
  'const aboutMe = {',
  '  location: "India",',
  '  education: "B.Tech (2025 Graduate)",',
  '  background: "Software & Web Development",',
  '  focus: "Machine Learning & Applied AI",',
  '  interests: [',
  '     "Building scalable apps",',
  '     "Working with data",',
  '     "Machine learning",',
  '     "Clean code"',
  '   ],',
  '  currentlyLearning: [',
  '     "Machine learning basics",',
  '     "Deep learning",',
  '     "Improving model accuracy"',
  '   ],',
  '  fuel: "Tea ☕"',
  '  funFact: "I refactor code as often as I tune models"',
  '};',
];
  useEffect(() => {
    if (isCodeInView && !isTyping) {
      setIsTyping(true);
    }
  }, [isCodeInView, isTyping]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentLineIndex >= codeLines.length) {
      return;
    }

    const currentLine = codeLines[currentLineIndex];
    
    if (currentCharIndex <= currentLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = currentLine.slice(0, currentCharIndex);
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, 5); // Typing speed
      
      return () => clearTimeout(timeout);
    } else {
      // Move to next line
      const timeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, 25); // Delay between lines
      
      return () => clearTimeout(timeout);
    }
  }, [isTyping, currentLineIndex, currentCharIndex, codeLines]);

  const renderLine = (line: string, lineNumber: number) => {
    // Syntax highlighting
    const parts: JSX.Element[] = [];
    let remaining = line;
    let key = 0;

    // Handle 'const' keyword
    if (remaining.startsWith('const ')) {
      parts.push(<span key={key++} className="syntax-keyword">const </span>);
      remaining = remaining.slice(6);
    }

    // Handle property names and values
    const colonIndex = remaining.indexOf(':');
    if (colonIndex !== -1 && !remaining.trim().startsWith('"') && !remaining.trim().startsWith('[') && !remaining.trim().startsWith(']')) {
      const propName = remaining.slice(0, colonIndex);
      const afterColon = remaining.slice(colonIndex);
      
      parts.push(<span key={key++} className="text-code-blue">{propName}</span>);
      
      // Handle the colon and value
      if (afterColon.includes('"')) {
        const beforeQuote = afterColon.split('"')[0];
        const quoted = afterColon.match(/"[^"]*"?/g);
        parts.push(<span key={key++} className="text-foreground">{beforeQuote}</span>);
        if (quoted) {
          quoted.forEach(q => {
            parts.push(<span key={key++} className="syntax-string">{q}</span>);
          });
          const afterQuotes = afterColon.replace(beforeQuote, '').replace(quoted.join(''), '');
          if (afterQuotes) {
            parts.push(<span key={key++} className="text-foreground">{afterQuotes}</span>);
          }
        }
      } else if (afterColon.includes('[')) {
        parts.push(<span key={key++} className="text-foreground">{afterColon}</span>);
      } else {
        parts.push(<span key={key++} className="text-foreground">{afterColon}</span>);
      }
    } else if (remaining.includes('"')) {
      // Handle string values in arrays
      const beforeQuote = remaining.split('"')[0];
      parts.push(<span key={key++} className="text-foreground">{beforeQuote}</span>);
      const quoted = remaining.match(/"[^"]*"?/g);
      if (quoted) {
        quoted.forEach(q => {
          parts.push(<span key={key++} className="syntax-string">{q}</span>);
        });
        const afterQuotes = remaining.slice(beforeQuote.length + quoted.join('').length);
        if (afterQuotes) {
          parts.push(<span key={key++} className="text-foreground">{afterQuotes}</span>);
        }
      }
    } else {
      parts.push(<span key={key++} className="text-foreground">{remaining}</span>);
    }

    return (
      <div key={lineNumber} className="flex">
        <span className="text-muted-foreground/50 w-6 select-none text-right pr-2">
          {lineNumber + 1}
        </span>
        <span className="ml-2">
          {parts}
          {lineNumber === currentLineIndex && currentLineIndex < codeLines.length && (
            <span className="cursor-blink text-primary">|</span>
          )}
        </span>
      </div>
    );
  };

  return (
    <section id="about" className="py-12 relative">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {!hideLabel && (
            <h2 className="font-mono text-sm text-primary mb-2">
              {"// 01. About"}
            </h2>
          )}

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-8">
                <span className="syntax-keyword">const</span>{" "}
                <span className="syntax-function">aboutMe</span>{" "}
                <span className="text-foreground">=</span>{" "}
                <span className="syntax-string">"..."</span>
              </h3>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                Hello! I'm <span className="text-primary">Sujay</span>, a 2025 B.Tech graduate with a strong
                foundation in software and web development. I enjoy breaking down complex problems and
                turning them into clean, scalable solutions that work reliably in real-world systems.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                My journey began with building full-stack web applications, which helped me develop a
                solid understanding of system design, APIs, and performance considerations. Today, my
                focus is expanding toward{" "}
                <span className="text-code-purple">machine learning</span>,{" "}
                <span className="text-code-blue">data-driven systems</span>, and{" "}
                <span className="text-code-green">applied AI</span>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                When I’m not coding or experimenting with models, I spend time refining my fundamentals,
                exploring new technologies, and continuously learning how to build intelligent systems
                that scale and evolve.
              </p>
              </div>
            </div>

            <motion.div
              ref={codeRef}
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
                {isTyping && currentLineIndex < codeLines.length && (
                  <motion.span 
                    className="ml-auto font-mono text-xs text-code-green"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    typing...
                  </motion.span>
                )}
              </div>
              <div className="terminal-body min-h-[320px]">
                <pre className="text-sm">
                  <code>
                    {displayedLines.map((line, i) => renderLine(line, i))}
                    {currentLineIndex < codeLines.length && displayedLines.length <= currentLineIndex && (
                      <div className="flex">
                        <span className="text-muted-foreground/50 w-6 select-none text-right pr-2">
                          {currentLineIndex + 1}
                        </span>
                        <span className="ml-2">
                          <span className="cursor-blink text-primary">|</span>
                        </span>
                      </div>
                    )}
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
