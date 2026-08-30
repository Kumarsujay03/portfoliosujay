import { motion } from "framer-motion";
import skillsData from "../data/skills.json";
import RevealOnView from "@/components/RevealOnView";
import SectionHeader from "@/components/SectionHeader";

type SkillCategory = {
  title: string;
  skills: string[];
};

type SkillsData = {
  categories: SkillCategory[];
};

type SkillsProps = {
  hideLabel?: boolean;
  backgroundVariant?: "muted" | "none";
  animateOnView?: boolean;
};

const Skills = ({ animateOnView = false }: SkillsProps) => {
  const { categories } = skillsData as SkillsData;

  const content = (
    <div>
      <SectionHeader index="02" title="skills & tools" className="mb-8" />

      <h2 className="max-w-2xl text-xl md:text-2xl font-medium tracking-tight text-foreground">
        The stack I use to research, build, and ship.
      </h2>

      <div className="mt-10 space-y-8">
        {categories.map((category, ci) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: ci * 0.05 }}
            className="grid gap-3 md:grid-cols-[200px_1fr] md:items-start"
          >
            <div className="flex items-center gap-3">
              <span className="mono-label">{category.title}</span>
              <div className="hidden md:block h-px flex-1 bg-border/60" />
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span key={skill} className="pill">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="skills" className="py-16 md:py-20 relative scroll-offset">
      <div className="container-page">
        {animateOnView ? <RevealOnView>{content}</RevealOnView> : content}
      </div>
    </section>
  );
};

export default Skills;
