import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Github, ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import projectsData from "../data/projects.json";

type ProjectsProps = {
  hideLabel?: boolean;
};

type FeaturedProject = {
  id: number;
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  featured: boolean;
  isDemo: boolean;
  view?: boolean;
  image?: string;
};

type OtherProject = {
  id: number;
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  featured: boolean;
  isDemo: boolean;
  view?: boolean;
  image?: string;
};

const getProjectImgSrc = (imageFile?: string) => {
  if (!imageFile) return null;
  try {
    return new URL(`../assets/project_img/${imageFile}`, import.meta.url).href;
  } catch {
    return null;
  }
};

const getProjectWebpSrc = (imageFile?: string) => {
  if (!imageFile) return null;

  const webpFile = imageFile.replace(/\.(png|jpe?g)$/i, ".webp");
  if (webpFile === imageFile) return null;

  try {
    return new URL(`../assets/project_img/${webpFile}`, import.meta.url).href;
  } catch {
    return null;
  }
};

const hasUrl = (url?: string) => Boolean(url && url.trim().length > 0);

const Projects = ({ hideLabel }: ProjectsProps) => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showAllFeatured, setShowAllFeatured] = useState(false);
  const [showAllOther, setShowAllOther] = useState(false);
  const [visibleFeaturedCount, setVisibleFeaturedCount] = useState(2);
  const [visibleOtherCount, setVisibleOtherCount] = useState(3);
  const [showFeaturedSection, setShowFeaturedSection] = useState(true);
  const [showOtherSection, setShowOtherSection] = useState(true);

  const allProjects = projectsData as unknown as OtherProject[];
  const visibleProjects = allProjects.filter((p) => p.view !== false);
  const projects: FeaturedProject[] = visibleProjects.filter((p) => p.featured);
  const otherProjects: OtherProject[] = visibleProjects.filter((p) => !p.featured);

  const shouldNavigateToProjectsPage = !hideLabel;

  useEffect(() => {
    if (shouldNavigateToProjectsPage) {
      setVisibleFeaturedCount(3);
      return;
    }

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
  }, [shouldNavigateToProjectsPage]);

  const featuredLimit = shouldNavigateToProjectsPage ? 3 : visibleFeaturedCount;
  const displayedFeatured = shouldNavigateToProjectsPage
    ? projects.slice(0, featuredLimit)
    : showAllFeatured
      ? projects
      : projects.slice(0, featuredLimit);

  const displayedOther = showAllOther ? otherProjects : otherProjects.slice(0, visibleOtherCount);
  const hiddenFeaturedCount = Math.max(0, projects.length - featuredLimit);
  const hiddenOtherCount = Math.max(0, otherProjects.length - visibleOtherCount);

  return (
    <section id="projects" className="py-12 relative">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {!hideLabel && (
            <h2 className="font-mono text-sm text-primary mb-2">
              {"// 03. Projects"}
            </h2>
          )}
          <h3 className="text-3xl md:text-4xl font-bold mb-12">
            <span className="syntax-function">buildProjects</span>
            <span className="text-foreground">()</span>
            <span className="text-primary">{" {"}</span>
          </h3>

          {/* Dedicated page controls */}
          {!shouldNavigateToProjectsPage && (
            <div className="flex flex-wrap gap-3 mb-10">
              <motion.button
                type="button"
                onClick={() => setShowFeaturedSection((prev) => !prev)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="font-mono text-xs px-4 py-2 border border-border rounded-lg bg-card hover:border-primary hover:text-primary transition-all"
              >
                {showFeaturedSection ? "hideFeatured()" : "showFeatured()"}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setShowOtherSection((prev) => !prev)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="font-mono text-xs px-4 py-2 border border-border rounded-lg bg-card hover:border-primary hover:text-primary transition-all"
              >
                {showOtherSection ? "hideOther()" : "showOther()"}
              </motion.button>
            </div>
          )}

          {/* Featured Projects */}
          {(!shouldNavigateToProjectsPage && !showFeaturedSection) ? null : (
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
                      <div className="terminal-body h-72 md:h-80 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
                        {(() => {
                          const pngSrc = getProjectImgSrc(project.image);
                          const webpSrc = getProjectWebpSrc(project.image);

                          if (!pngSrc) return null;

                          return (
                            <picture>
                              {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
                              <img
                                src={pngSrc}
                                alt={project.title}
                                className="h-full w-full object-contain"
                                loading="lazy"
                                decoding="async"
                                fetchPriority="low"
                              />
                            </picture>
                          );
                        })() ?? (
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
                        )}
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
                      {hasUrl(project.github) && (
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Github size={20} />
                        </motion.a>
                      )}
                      {hasUrl(project.live) && (
                        <motion.a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink size={20} />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Show All Featured Button */}
          {shouldNavigateToProjectsPage ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <motion.button
                onClick={() => navigate("/projects")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="font-mono text-sm px-6 py-3 border border-border rounded-lg bg-card hover:border-primary hover:text-primary transition-all inline-flex items-center gap-2 group"
              >
                <span>showAll({visibleProjects.length})</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </motion.div>
          ) : showFeaturedSection && projects.length > featuredLimit ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <motion.button
                onClick={() =>
                  shouldNavigateToProjectsPage
                    ? navigate("/projects")
                    : setShowAllFeatured(!showAllFeatured)
                }
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
          ) : null}

          {/* Other Projects (dedicated /projects page only) */}
          {!shouldNavigateToProjectsPage && showOtherSection && (
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
                      className="terminal-window group hover:border-primary/50 transition-all"
                    >
                      <div className="terminal-body">
                        <div className="flex justify-between items-start mb-4">
                          <motion.span
                            className="text-primary text-2xl"
                            whileHover={{ rotate: 10 }}
                          >
                            📁
                          </motion.span>
                          <div className="flex items-center gap-2">
                            {project.isDemo && (
                              <span className="font-mono text-xs px-2 py-1 rounded bg-code-orange/15 text-code-orange">
                                demo
                              </span>
                            )}
                            {hasUrl(project.github) && (
                              <motion.a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1 }}
                                className="text-muted-foreground hover:text-primary transition-colors"
                                aria-label={`Open GitHub for ${project.title}`}
                              >
                                <Github size={18} />
                              </motion.a>
                            )}
                            {hasUrl(project.live) && (
                              <motion.a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1 }}
                                className="text-muted-foreground hover:text-primary transition-colors"
                                aria-label={`Open live site for ${project.title}`}
                              >
                                <ExternalLink size={18} />
                              </motion.a>
                            )}
                          </div>
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
          )}

          <p className="font-mono text-3xl md:text-4xl font-bold mt-12 text-primary">
            {"}"}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
