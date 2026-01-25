import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import aboutData from "../data/about.json";
import { RotateCcw } from "lucide-react";

type AboutTextSegment = {
  text: string;
  className?: string;
};

type AboutData = {
  paragraphs: AboutTextSegment[][];
  codeLines: string[];
};

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

  const { paragraphs, codeLines } = aboutData as unknown as AboutData;

  const restartTyping = () => {
    setDisplayedLines([]);
    setCurrentLineIndex(0);
    setCurrentCharIndex(0);
    setIsTyping(true);
  };

  useEffect(() => {
    if (isCodeInView && !isTyping && currentLineIndex < codeLines.length) {
      setIsTyping(true);
    }
  }, [isCodeInView, isTyping, currentLineIndex, codeLines.length]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentLineIndex >= codeLines.length) {
      setIsTyping(false);
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

  const isTypingActive = isTyping && currentLineIndex < codeLines.length;
  const showRestartButton = !isTyping && displayedLines.length > 0 && currentLineIndex >= codeLines.length;

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
                {paragraphs.map((segments, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed">
                    {segments.map((segment, segmentIndex) => (
                      <span key={segmentIndex} className={segment.className ?? undefined}>
                        {segment.text}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            </div>

            <motion.div
              ref={codeRef}
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="terminal-window w-full min-w-0"
            >
              <div className="terminal-header">
                <div className="terminal-dot bg-destructive" />
                <div className="terminal-dot bg-accent" />
                <div className="terminal-dot bg-code-green" />
                <span className="ml-4 font-mono text-xs text-muted-foreground">about.js</span>
                <div className="ml-auto flex items-center gap-2">
                  {isTypingActive && (
                    <motion.span
                      className="font-mono text-xs text-code-green"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      typing...
                    </motion.span>
                  )}
                  {showRestartButton && (
                    <button
                      type="button"
                      onClick={restartTyping}
                      className="inline-flex items-center justify-center rounded p-1 text-muted-foreground hover:text-primary hover:bg-muted/40 transition-colors"
                      aria-label="Restart typing animation"
                      title="Restart typing"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="terminal-body min-h-[320px] overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap break-words">
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
