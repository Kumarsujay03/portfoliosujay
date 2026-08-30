import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Github } from "lucide-react";
import projectsData from "../data/projects.json";
import RevealOnView from "@/components/RevealOnView";
import SectionHeader from "@/components/SectionHeader";
import SmartImage from "@/components/SmartImage";

type ProjectsProps = {
  hideLabel?: boolean;
  animateOnView?: boolean;
};

type Project = {
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

const ProjectImage = ({ project }: { project: Project }) => {
  const png = getProjectImgSrc(project.image);
  const webp = getProjectWebpSrc(project.image);

  if (!png) {
    return (
      <div className="flex aspect-[21/10] w-full items-center justify-center rounded-lg bg-muted/30">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50">
          {project.title.slice(0, 2)}
        </span>
      </div>
    );
  }

  // The screenshots include browser chrome (a coloured scrollbar / window
  // border) at their edges. A slight scale inside an overflow-hidden frame
  // trims those edges without distorting the page content.
  return (
    <SmartImage
      src={png}
      webpSrc={webp}
      alt={project.title}
      className="w-full rounded-lg"
      imgClassName="block h-auto w-full scale-[1.05] object-contain grayscale transition-all duration-500 group-hover:grayscale-0"
    />
  );
};

const FeaturedCard = ({ project, index }: { project: Project; index: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
    whileHover={{ y: -4 }}
    className="group surface overflow-hidden transition-colors hover:border-foreground/25"
  >
    <div className="grid md:grid-cols-2">
      <div className="flex items-center overflow-hidden p-4">
        <ProjectImage project={project} />
      </div>
      <div className="flex flex-col p-6">
        <div className="flex items-center justify-between">
          <span className="mono-label">
            {String(index + 1).padStart(2, "0")} · selected work
          </span>
          <div className="flex items-center gap-3">
            {hasUrl(project.github) && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub for ${project.title}`}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {hasUrl(project.live) && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live site for ${project.title}`}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <h3 className="mt-3 text-xl font-medium text-foreground">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span key={tech} className="pill">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  </motion.article>
);

const CompactCard = ({ project }: { project: Project }) => (
  <motion.article
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.4 }}
    whileHover={{ y: -4 }}
    className="group surface flex flex-col p-5 transition-colors hover:border-foreground/25"
  >
    <div className="flex items-start justify-between">
      <h4 className="font-medium text-foreground">{project.title}</h4>
      <div className="flex items-center gap-2">
        {project.isDemo && <span className="mono-label">demo</span>}
        {hasUrl(project.github) && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub for ${project.title}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
        )}
        {hasUrl(project.live) && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Live site for ${project.title}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
      {project.description}
    </p>
    <div className="mt-4 flex flex-wrap gap-1.5">
      {project.tech.map((tech) => (
        <span key={tech} className="font-mono text-xs text-muted-foreground/70">
          {tech}
        </span>
      ))}
    </div>
  </motion.article>
);

const Projects = ({ hideLabel, animateOnView = false }: ProjectsProps) => {
  const navigate = useNavigate();

  const isProjectsPage = Boolean(hideLabel);
  const allProjects = (projectsData as unknown as Project[]).filter((p) => p.view !== false);
  const featured = allProjects.filter((p) => p.featured);
  const other = allProjects.filter((p) => !p.featured);

  const displayedFeatured = isProjectsPage ? featured : featured.slice(0, 3);

  const content = (
    <div>
      <SectionHeader index="05" title="selected work" className="mb-8" />

      <h2 className="max-w-2xl text-xl md:text-2xl font-medium tracking-tight text-foreground">
        Projects where research meets engineering.
      </h2>

      <div className="mt-10 space-y-6">
        {displayedFeatured.map((project, index) => (
          <FeaturedCard key={project.id} project={project} index={index} />
        ))}
      </div>

      {!isProjectsPage && featured.length > 3 && (
        <div className="mt-10">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="hover-lift-sm group inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-mono text-sm text-foreground hover:border-foreground/40"
          >
            all projects
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      )}

      {isProjectsPage && other.length > 0 && (
        <div className="mt-16">
          <SectionHeader title="more" className="mb-5" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {other.map((project) => (
              <CompactCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section id="projects" className="py-16 md:py-20 relative scroll-offset">
      <div className="container-page">
        {animateOnView ? <RevealOnView>{content}</RevealOnView> : content}
      </div>
    </section>
  );
};

export default Projects;
