import { motion } from "framer-motion";

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

const Experience = () => {
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

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative flex items-center mb-8 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />

              {/* Content card */}
              <div className={`ml-8 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <div className="terminal-window hover:border-primary/50 transition-colors">
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
                    <div className="mb-3">
                      <h3 className="font-mono text-lg text-primary">
                        {exp.role}
                      </h3>
                      <p className="font-mono text-sm text-muted-foreground">
                        @ {exp.company}
                      </p>
                    </div>
                    
                    <p className="text-sm text-foreground/80 mb-4">
                      {exp.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-xs px-2 py-1 rounded bg-muted text-code-purple"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-4 font-mono text-xs text-muted-foreground">
                      <span className="syntax-keyword">export</span>{" "}
                      <span className="syntax-keyword">default</span>{" "}
                      <span className="text-code-blue">{exp.role.replace(/\s+/g, '')}</span>;
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
