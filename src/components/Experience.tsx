import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    id: 1,
    role: "Senior Software Engineer",
    company: "TechCorp Inc.",
    period: "2022 - Present",
    description: "Leading frontend architecture and mentoring junior developers. Implemented micro-frontend architecture reducing build times by 60%.",
    technologies: ["React", "TypeScript", "AWS", "GraphQL"],
    type: "full-time"
  },
  {
    id: 2,
    role: "Full Stack Developer",
    company: "StartupXYZ",
    period: "2020 - 2022",
    description: "Built and scaled the core platform from 0 to 100k users. Designed RESTful APIs and implemented real-time features.",
    technologies: ["Node.js", "React", "PostgreSQL", "Redis"],
    type: "full-time"
  },
  {
    id: 3,
    role: "Frontend Developer",
    company: "Digital Agency Co.",
    period: "2018 - 2020",
    description: "Developed responsive web applications for various clients. Introduced component-based architecture and modern build tools.",
    technologies: ["JavaScript", "Vue.js", "SASS", "Webpack"],
    type: "full-time"
  },
  {
    id: 4,
    role: "Junior Developer",
    company: "WebDev Studio",
    period: "2017 - 2018",
    description: "Started career building websites and learning modern web technologies. Contributed to 20+ client projects.",
    technologies: ["HTML", "CSS", "JavaScript", "jQuery"],
    type: "internship"
  },
];

const TimelineCard = ({ exp, index }: { exp: typeof experiences[0]; index: number }) => {
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

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, scale, x }}
      className={`relative flex items-center mb-12 ${
        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Timeline dot with pulse animation */}
      <motion.div 
        className="absolute left-0 md:left-1/2 transform -translate-x-1/2 z-10"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        viewport={{ once: true }}
      >
        <div className="w-4 h-4 rounded-full bg-primary border-4 border-background relative">
          <motion.div 
            className="absolute inset-0 rounded-full bg-primary"
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

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
              {exp.period}
            </span>
            <span className={`ml-auto font-mono text-xs px-2 py-0.5 rounded ${
              exp.type === 'full-time' ? 'bg-code-green/20 text-code-green' : 'bg-code-orange/20 text-code-orange'
            }`}>
              {exp.type}
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

const Experience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="terminal-header mb-0 rounded-t-lg">
            <div className="terminal-dot bg-destructive"></div>
            <div className="terminal-dot bg-accent"></div>
            <div className="terminal-dot bg-code-green"></div>
            <span className="ml-2 font-mono text-xs text-muted-foreground">experience.json</span>
          </div>
          <div className="bg-card border-x border-b border-border rounded-b-lg p-6">
            <h2 className="text-3xl font-bold font-mono mb-2">
              <span className="text-muted-foreground">{"{ "}</span>
              <span className="text-gradient">"experience"</span>
              <span className="text-muted-foreground">{" }"}</span>
            </h2>
            <p className="text-muted-foreground font-mono text-sm">
              <span className="syntax-comment">{"// "}</span>
              Professional journey through the tech industry
            </p>
          </div>
        </motion.div>

        <div ref={containerRef} className="relative">
          {/* Animated timeline line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-border/30" />
          <motion.div 
            className="absolute left-0 md:left-1/2 transform md:-translate-x-px top-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary"
            style={{ height: lineHeight }}
          />

          {experiences.map((exp, index) => (
            <TimelineCard key={exp.id} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
