import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import skillsData from "../data/skills.json";
import RevealOnView from "@/components/RevealOnView";

type SkillCategory = {
  title: string;
  icon: string;
  skills: string[];
};

type SkillsData = {
  techStackLines: string[];
  categories: SkillCategory[];
};

type SkillsProps = {
  hideLabel?: boolean;
  backgroundVariant?: "muted" | "none";
  animateOnView?: boolean;
};

const Skills = ({ hideLabel, backgroundVariant = "muted", animateOnView = false }: SkillsProps) => {
  const ref = useRef(null);
  const codeRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isCodeInView = useInView(codeRef, { once: true, margin: "-50px" });

  const sectionPaddingClassName = hideLabel ? "pt-6 pb-12" : "py-12";

  const { techStackLines, categories: skillCategories } = skillsData as unknown as SkillsData;

  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isCodeInView && !isTyping) {
      setIsTyping(true);
    }
  }, [isCodeInView, isTyping]);

  useEffect(() => {
    if (!isTyping) return;
    if (currentLineIndex >= techStackLines.length) return;

    const currentLine = techStackLines[currentLineIndex];

    if (currentCharIndex <= currentLine.length) {
      const timeout = setTimeout(() => {
        setTypedLines((prev) => {
          const next = [...prev];
          next[currentLineIndex] = currentLine.slice(0, currentCharIndex);
          return next;
        });
        setCurrentCharIndex((prev) => prev + 1);
      }, 14);

      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setCurrentLineIndex((prev) => prev + 1);
      setCurrentCharIndex(0);
    }, 45);

    return () => clearTimeout(timeout);
  }, [isTyping, currentLineIndex, currentCharIndex, techStackLines]);

  const renderTechLine = (line: string) => {
    if (line.trimStart().startsWith("//")) {
      return <span className="syntax-comment">{line}</span>;
    }

    const parts: JSX.Element[] = [];
    let remaining = line;
    let key = 0;

    const keywordMatch = remaining.match(/^(export const\s+)/);
    if (keywordMatch) {
      const kw = keywordMatch[1];
      const exportPart = "export ";
      const constPart = "const ";
      parts.push(
        <span key={key++}>
          <span className="syntax-keyword">{exportPart}</span>
          <span className="syntax-keyword">{constPart}</span>
        </span>
      );
      remaining = remaining.slice(kw.length);
    }

    const fnMatch = remaining.match(/^(techStack)/);
    if (fnMatch) {
      parts.push(
        <span key={key++} className="syntax-function">
          {fnMatch[1]}
        </span>
      );
      remaining = remaining.slice(fnMatch[1].length);
    }

    const stringRegex = /"[^"]*"/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = stringRegex.exec(remaining)) !== null) {
      const before = remaining.slice(lastIndex, match.index);
      if (before) {
        parts.push(
          <span key={key++} className="text-foreground">
            {before}
          </span>
        );
      }
      parts.push(
        <span key={key++} className="syntax-string">
          {match[0]}
        </span>
      );
      lastIndex = match.index + match[0].length;
    }

    const after = remaining.slice(lastIndex);
    if (after) {
      parts.push(
        <span key={key++} className="text-foreground">
          {after}
        </span>
      );
    }

    return parts;
  };

  const backgroundClassName = backgroundVariant === "muted" ? "bg-muted/20" : "";

  const content = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
          {!hideLabel && (
            <h2 className="font-mono text-sm text-primary mb-2">
              {"// 02. Skills"}
            </h2>
          )}
          <h3 className="text-3xl md:text-4xl font-bold mb-12">
            <span className="syntax-keyword">import</span>{" "}
            <span className="text-foreground">{"{"}</span>{" "}
            <span className="syntax-function">skills</span>{" "}
            <span className="text-foreground">{"}"}</span>{" "}
            <span className="syntax-keyword">from</span>{" "}
            <span className="syntax-string">"./experience"</span>
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="terminal-window group hover:border-primary/50 transition-colors"
              >
                <div className="terminal-header">
                  <div className="terminal-dot bg-destructive" />
                  <div className="terminal-dot bg-accent" />
                  <div className="terminal-dot bg-code-green" />
                  <span className="ml-4 font-mono text-xs text-muted-foreground">
                    {category.title.toLowerCase()}.ts
                  </span>
                </div>
                <div className="terminal-body">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{category.icon}</span>
                    <h4 className="font-semibold text-foreground">{category.title}</h4>
                  </div>
                  <div className="space-y-2">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{
                          duration: 0.3,
                          delay: categoryIndex * 0.1 + skillIndex * 0.05 + 0.3,
                        }}
                        className="flex items-center gap-2 font-mono text-sm"
                      >
                        <span className="text-primary">▹</span>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                          {skill}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Code representation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 code-block max-w-2xl mx-auto"
            ref={codeRef}
          >
          <pre className="text-sm whitespace-pre-wrap">
            {techStackLines.map((_, i) => (
              <span key={i}>
                {renderTechLine(typedLines[i] ?? "")}
                {"\n"}
              </span>
            ))}
          </pre>
          </motion.div>
    </motion.div>
  );

  return (
    <section id="skills" className={`${sectionPaddingClassName} ${backgroundClassName} relative`}>
      <div className="container mx-auto px-6">
        {animateOnView ? <RevealOnView>{content}</RevealOnView> : content}
      </div>
    </section>
  );
};

export default Skills;
