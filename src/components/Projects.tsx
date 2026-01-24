import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ExternalLink, Github, ChevronDown, ChevronUp } from "lucide-react";

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showAllFeatured, setShowAllFeatured] = useState(false);
  const [showAllOther, setShowAllOther] = useState(false);
  const [visibleFeaturedCount, setVisibleFeaturedCount] = useState(2);
  const [visibleOtherCount, setVisibleOtherCount] = useState(3);

  const projects = [
    {
      title: "DevFlow",
      description: "A real-time collaborative code editor with syntax highlighting, live cursors, and integrated terminal. Built for remote pair programming.",
      tech: ["React", "WebSocket", "Monaco Editor", "Node.js"],
      github: "#",
      live: "#",
      featured: true,
    },
    {
      title: "CloudDeploy",
      description: "CI/CD pipeline automation tool that simplifies Docker deployments to AWS. Features rollback capabilities and health monitoring.",
      tech: ["Go", "Docker", "AWS SDK", "PostgreSQL"],
      github: "#",
      live: "#",
      featured: true,
    },
    {
      title: "API Nexus",
      description: "A GraphQL gateway that aggregates multiple REST APIs into a unified schema with caching and rate limiting.",
      tech: ["TypeScript", "GraphQL", "Redis", "Express"],
      github: "#",
      live: "#",
      featured: true,
    },
    {
      title: "DataViz Pro",
      description: "Interactive data visualization dashboard with real-time updates and customizable widgets.",
      tech: ["React", "D3.js", "WebSocket", "Python"],
      github: "#",
      live: "#",
      featured: true,
    },
  ];

  const otherProjects = [
    { title: "dotfiles", description: "My personal dev environment config", tech: ["Bash", "Lua"] },
    { title: "cli-todo", description: "Terminal-based task manager", tech: ["Rust"] },
    { title: "react-hooks", description: "Collection of custom React hooks", tech: ["TypeScript"] },
    { title: "markdown-editor", description: "Live preview markdown editor", tech: ["React", "MDX"] },
    { title: "api-tester", description: "Postman alternative for CLI", tech: ["Go"] },
    { title: "color-palette", description: "AI-powered color scheme generator", tech: ["Python", "Flask"] },
  ];

  useEffect(() => {
    const updateVisibleCounts = () => {
      if (window.innerWidth >= 1024) {
        setVisibleFeaturedCount(2);
        setVisibleOtherCount(3);
      } else if (window.innerWidth >= 768) {
        setVisibleFeaturedCount(2);
        setVisibleOtherCount(4);
      } else {
        setVisibleFeaturedCount(2);
        setVisibleOtherCount(3);
      }
    };

    updateVisibleCounts();
    window.addEventListener("resize", updateVisibleCounts);
    return () => window.removeEventListener("resize", updateVisibleCounts);
  }, []);

  const displayedFeatured = showAllFeatured ? projects : projects.slice(0, visibleFeaturedCount);
  const displayedOther = showAllOther ? otherProjects : otherProjects.slice(0, visibleOtherCount);
  const hiddenFeaturedCount = projects.length - visibleFeaturedCount;
  const hiddenOtherCount = otherProjects.length - visibleOtherCount;

  return (
    <section id="projects" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-mono text-sm text-primary mb-2">
            {"// 03. Projects"}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-12">
            <span className="syntax-function">buildProjects</span>
            <span className="text-foreground">()</span>
            <span className="text-primary">{" {"}</span>
          </h3>

          {/* Featured Projects */}
          <div className="space-y-16">
            <AnimatePresence mode="popLayout">
              {displayedFeatured.map((project, index) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative grid md:grid-cols-12 gap-4 items-center ${
                    index % 2 === 1 ? "md:text-right" : ""
                  }`}
                >
                  {/* Project Image/Terminal */}
                  <div
                    className={`md:col-span-7 ${
                      index % 2 === 1 ? "md:order-2" : ""
                    }`}
                  >
                    <motion.div 
                      className="terminal-window group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="terminal-header">
                        <div className="terminal-dot bg-destructive" />
                        <div className="terminal-dot bg-accent" />
                        <div className="terminal-dot bg-code-green" />
                        <span className="ml-4 font-mono text-xs text-muted-foreground">
                          {project.title.toLowerCase()}/README.md
                        </span>
                      </div>
                      <div className="terminal-body h-48 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                        <div className="text-center">
                          <motion.span 
                            className="font-mono text-4xl text-primary/30 group-hover:text-primary/50 transition-colors"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                          >
                            {"</>"}
                          </motion.span>
                          <p className="font-mono text-xs text-muted-foreground mt-2">
                            {project.title}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Project Info */}
                  <div
                    className={`md:col-span-5 ${
                      index % 2 === 1 ? "md:order-1" : ""
                    }`}
                  >
                    <p className="font-mono text-sm text-primary mb-2">Featured Project</p>
                    <h4 className="text-2xl font-bold text-foreground mb-4">
                      {project.title}
                    </h4>
                    <motion.div 
                      className="bg-card p-6 rounded-lg border border-border shadow-lg mb-4"
                      whileHover={{ borderColor: "hsl(var(--primary) / 0.5)" }}
                    >
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </motion.div>
                    <div
                      className={`flex flex-wrap gap-2 mb-4 ${
                        index % 2 === 1 ? "md:justify-end" : ""
                      }`}
                    >
                      {project.tech.map((tech) => (
                        <motion.span
                          key={tech}
                          whileHover={{ scale: 1.1 }}
                          className="font-mono text-xs text-code-green bg-code-green/10 px-2 py-1 rounded cursor-default"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                    <div
                      className={`flex gap-4 ${
                        index % 2 === 1 ? "md:justify-end" : ""
                      }`}
                    >
                      <motion.a
                        href={project.github}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Github size={20} />
                      </motion.a>
                      <motion.a
                        href={project.live}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink size={20} />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Show All Featured Button */}
          {projects.length > visibleFeaturedCount && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <motion.button
                onClick={() => setShowAllFeatured(!showAllFeatured)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="font-mono text-sm px-6 py-3 border border-border rounded-lg bg-card hover:border-primary hover:text-primary transition-all inline-flex items-center gap-2 group"
              >
                {showAllFeatured ? (
                  <>
                    <span>showLess()</span>
                    <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                ) : (
                  <>
                    <span>showMore({hiddenFeaturedCount})</span>
                    <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Other Projects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-20"
          >
            <h4 className="font-mono text-center text-muted-foreground mb-8">
              {"// Other noteworthy projects"}
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {displayedOther.map((project, index) => (
                  <motion.div
                    key={project.title}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="terminal-window group hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <div className="terminal-body">
                      <div className="flex justify-between items-start mb-4">
                        <motion.span 
                          className="text-primary text-2xl"
                          whileHover={{ rotate: 10 }}
                        >
                          📁
                        </motion.span>
                        <motion.div whileHover={{ scale: 1.1 }}>
                          <Github
                            size={18}
                            className="text-muted-foreground group-hover:text-primary transition-colors"
                          />
                        </motion.div>
                      </div>
                      <h5 className="font-semibold text-foreground mb-2">
                        {project.title}
                      </h5>
                      <p className="text-sm text-muted-foreground mb-4">
                        {project.description}
                      </p>
                      <div className="flex gap-2">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="font-mono text-xs text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Show All Other Button */}
            {otherProjects.length > visibleOtherCount && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 }}
                className="mt-8 text-center"
              >
                <motion.button
                  onClick={() => setShowAllOther(!showAllOther)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="font-mono text-sm px-6 py-3 border border-border rounded-lg bg-card hover:border-primary hover:text-primary transition-all inline-flex items-center gap-2 group"
                >
                  {showAllOther ? (
                    <>
                      <span>showLess()</span>
                      <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                    </>
                  ) : (
                    <>
                      <span>showAll({hiddenOtherCount})</span>
                      <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          <p className="font-mono text-3xl md:text-4xl font-bold mt-12 text-primary">
            {"}"}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
