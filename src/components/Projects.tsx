import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github } from "lucide-react";

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
  ];

  const otherProjects = [
    { title: "dotfiles", description: "My personal dev environment config", tech: ["Bash", "Lua"] },
    { title: "cli-todo", description: "Terminal-based task manager", tech: ["Rust"] },
    { title: "react-hooks", description: "Collection of custom React hooks", tech: ["TypeScript"] },
  ];

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
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
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
                  <div className="terminal-window group">
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
                        <span className="font-mono text-4xl text-primary/30 group-hover:text-primary/50 transition-colors">
                          {"</>"}
                        </span>
                        <p className="font-mono text-xs text-muted-foreground mt-2">
                          {project.title}
                        </p>
                      </div>
                    </div>
                  </div>
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
                  <div className="bg-card p-6 rounded-lg border border-border shadow-lg mb-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div
                    className={`flex flex-wrap gap-2 mb-4 ${
                      index % 2 === 1 ? "md:justify-end" : ""
                    }`}
                  >
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-xs text-code-green bg-code-green/10 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div
                    className={`flex gap-4 ${
                      index % 2 === 1 ? "md:justify-end" : ""
                    }`}
                  >
                    <a
                      href={project.github}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github size={20} />
                    </a>
                    <a
                      href={project.live}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

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
              {otherProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  className="terminal-window group hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div className="terminal-body">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-primary text-2xl">📁</span>
                      <Github
                        size={18}
                        className="text-muted-foreground group-hover:text-primary transition-colors"
                      />
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
            </div>
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
