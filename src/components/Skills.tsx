import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const skillCategories = [
    {
      title: "Frontend",
      icon: "🎨",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
    },
    {
      title: "Backend",
      icon: "⚙️",
      skills: ["Node.js", "Python", "PostgreSQL", "Redis", "GraphQL"],
    },
    {
      title: "DevOps",
      icon: "🚀",
      skills: ["Docker", "AWS", "CI/CD", "Kubernetes", "Terraform"],
    },
    {
      title: "Tools",
      icon: "🛠️",
      skills: ["Git", "VS Code", "Figma", "Postman", "Linux"],
    },
  ];

  return (
    <section id="skills" className="py-24 bg-muted/20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-mono text-sm text-primary mb-2">
            {"// 02. Skills"}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-12">
            <span className="syntax-keyword">import</span>{" "}
            <span className="text-foreground">{"{"}</span>{" "}
            <span className="syntax-function">skills</span>{" "}
            <span className="text-foreground">{"}"}</span>{" "}
            <span className="syntax-keyword">from</span>{" "}
            <span className="syntax-string">"./experience"</span>
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          >
            <pre className="text-sm">
              <span className="syntax-keyword">export const</span>{" "}
              <span className="syntax-function">techStack</span>{" "}
              <span className="text-foreground">= [</span>
              <br />
              {"  "}<span className="syntax-string">"TypeScript"</span>,{" "}
              <span className="syntax-string">"React"</span>,{" "}
              <span className="syntax-string">"Node.js"</span>,
              <br />
              {"  "}<span className="syntax-string">"PostgreSQL"</span>,{" "}
              <span className="syntax-string">"Docker"</span>,{" "}
              <span className="syntax-string">"AWS"</span>
              <br />
              <span className="text-foreground">];</span>
              <br />
              <br />
              <span className="syntax-comment">// Always learning something new...</span>
            </pre>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
