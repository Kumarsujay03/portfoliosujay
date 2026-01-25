import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { prefetchRoute } from "@/lib/routePrefetch";
import RevealOnView from "@/components/RevealOnView";
import experiencesData from "../data/experiences.json";

type ExperienceProps = {
  hideLabel?: boolean;
  limit?: number;
  showViewAll?: boolean;
  animateOnView?: boolean;
};

type ExperienceItem = {
  id: number;
  role: string;
  company: string;
  startDate: string; // YYYY-MM
  endDate: string | null; // YYYY-MM
  isCurrent: boolean;
  isVolunteer: boolean;
  description: string;
  technologies: string[];
};

const parseYearMonth = (value: string) => {
  const [yearStr, monthStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return null;
  return new Date(year, month - 1, 1);
};

const formatMonthYear = (value: string) => {
  const date = parseYearMonth(value);
  if (!date) return value;
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
};

const formatPeriod = (exp: ExperienceItem) => {
  const start = formatMonthYear(exp.startDate);
  if (exp.isCurrent || !exp.endDate) return `${start} - Present`;
  return `${start} - ${formatMonthYear(exp.endDate)}`;
};

const getTypeLabel = (exp: ExperienceItem) => {
  if (exp.isVolunteer) return "volunteer";
  if (/\bintern\b/i.test(exp.role)) return "internship";
  return "experience";
};

const Experience = ({ hideLabel, limit, showViewAll, animateOnView = false }: ExperienceProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const experiences = useMemo(() => {
    const items = (experiencesData as unknown as ExperienceItem[]) ?? [];
    return [...items].sort((a, b) => {
      const aStart = parseYearMonth(a.startDate)?.getTime() ?? 0;
      const bStart = parseYearMonth(b.startDate)?.getTime() ?? 0;
      if (aStart !== bStart) return bStart - aStart;
      return (b.id ?? 0) - (a.id ?? 0);
    });
  }, []);

  const displayedExperiences = useMemo(() => {
    if (!limit || limit <= 0) return experiences;
    return experiences.slice(0, limit);
  }, [experiences, limit]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const fillProgress = useTransform(
    scrollYProgress,
    [0, 0.22, 0.72, 1],
    [0, 0.45, 0.8, 1],
    { clamp: true }
  );

  const lineHeight = useTransform(fillProgress, [0, 1], ["0%", "100%"], { clamp: true });

  const TimelineCard = ({ exp, index }: { exp: ExperienceItem; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.8, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 0.95, 1]);
  const x = useTransform(
    scrollYProgress, 
    [0, 1], 
    [index % 2 === 0 ? -60 : 60, 0]
  );
  const blur = useTransform(scrollYProgress, [0, 0.5, 1], [4, 1, 0]);

  // Dot reveal synced to the main timeline fill.
  // Uses an index-based threshold so each dot "activates" as the line reaches it.
  const dotThreshold = (index + 1) / displayedExperiences.length;
  const dotReveal = useTransform(
    fillProgress,
    [Math.max(0, dotThreshold - 0.12), dotThreshold],
    [0, 1],
    { clamp: true }
  );
  const dotScale = useTransform(dotReveal, [0, 1], [0.75, 1], { clamp: true });
  const dotOpacity = useTransform(dotReveal, [0, 1], [0.35, 1], { clamp: true });
  const pulseOpacity = useTransform(dotReveal, [0, 1], [0, 0.5], { clamp: true });

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, scale, x }}
      className={`relative flex items-center mb-12 ${
        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Timeline dot with pulse animation */}
      <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 z-10">
        <motion.div style={{ scale: dotScale, opacity: dotOpacity }}>
          <div className="w-4 h-4 rounded-full bg-primary border-4 border-background relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-primary"
              style={{ opacity: pulseOpacity }}
              animate={{ scale: [1, 1.8, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Content card */}
      <motion.div 
        className={`ml-8 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}
        style={{ filter: blur.get() > 0 ? `blur(${blur}px)` : 'none' }}
      >
        <motion.div 
          className="terminal-window hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
          whileHover={{ y: -4 }}
        >
          <div className="terminal-header">
            <div className="terminal-dot bg-destructive"></div>
            <div className="terminal-dot bg-accent"></div>
            <div className="terminal-dot bg-code-green"></div>
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              {formatPeriod(exp)}
            </span>
            <span
              className={`ml-auto font-mono text-xs px-2 py-0.5 rounded ${
                getTypeLabel(exp) === "experience"
                  ? "bg-code-green/20 text-code-green"
                  : "bg-code-orange/20 text-code-orange"
              }`}
            >
              {getTypeLabel(exp)}
            </span>
          </div>
          
          <div className="p-6">
            <motion.div 
              className="mb-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-mono text-lg text-primary">
                {exp.role}
              </h3>
              <p className="font-mono text-sm text-muted-foreground">
                @ {exp.company}
              </p>
            </motion.div>
            
            <motion.p 
              className="text-sm text-foreground/80 mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              {exp.description}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              {exp.technologies.map((tech, techIndex) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + techIndex * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                  className="font-mono text-xs px-2 py-1 rounded bg-muted text-code-purple cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
            
            <motion.div 
              className="mt-4 font-mono text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <span className="syntax-keyword">export</span>{" "}
              <span className="syntax-keyword">default</span>{" "}
              <span className="text-code-blue">{exp.role.replace(/\s+/g, '')}</span>;
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

  const content = (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        {!hideLabel && (
          <h2 className="font-mono text-sm text-primary mb-2">
            {"// 03. Experience"}
          </h2>
        )}
        <div className="terminal-header mb-0 rounded-t-lg">
          <div className="terminal-dot bg-destructive"></div>
          <div className="terminal-dot bg-accent"></div>
          <div className="terminal-dot bg-code-green"></div>
          <span className="ml-2 font-mono text-xs text-muted-foreground">experiences.json</span>
        </div>
        <div className="bg-card border-x border-b border-border rounded-b-lg p-6">
          <h2 className="text-3xl font-bold font-mono mb-2">
            <span className="text-muted-foreground">{"{ "}</span>
            <span className="text-gradient">"experience"</span>
            <span className="text-muted-foreground">{" }"}</span>
          </h2>
          <p className="text-muted-foreground font-mono text-sm">
            <span className="syntax-comment">{"// "}</span>
            Professional and volunteer journey
          </p>
        </div>
      </motion.div>

      <div ref={containerRef} className="relative">
        {/* Animated timeline line */}
        <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-border/30" />
        <motion.div 
          className="absolute left-4 md:left-1/2 transform -translate-x-1/2 top-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary"
          style={{ height: lineHeight }}
        />

        {displayedExperiences.map((exp, index) => (
          <TimelineCard key={exp.id} exp={exp} index={index} />
        ))}
      </div>

      {showViewAll && displayedExperiences.length < experiences.length && (
        <div className="mt-6 text-center">
          <Link
            to="/work"
            onMouseEnter={() => prefetchRoute("/work")}
            onFocus={() => prefetchRoute("/work")}
            className="font-mono text-sm px-6 py-3 border border-border rounded-lg bg-card hover:border-primary hover:text-primary transition-all inline-flex items-center gap-2"
          >
            view_all_work()
          </Link>
        </div>
      )}
    </>
  );

  return (
    <section id="experience" className="py-12 relative">
      <div className="container mx-auto px-6 relative">
        {animateOnView ? <RevealOnView>{content}</RevealOnView> : content}
      </div>
    </section>
  );
};

export default Experience;
