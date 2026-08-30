import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { prefetchRoute } from "@/lib/routePrefetch";
import RevealOnView from "@/components/RevealOnView";
import SectionHeader from "@/components/SectionHeader";
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
  startDate: string;
  endDate: string | null;
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
  if (exp.isCurrent || !exp.endDate) return `${start} — Present`;
  return `${start} — ${formatMonthYear(exp.endDate)}`;
};

const getTypeLabel = (exp: ExperienceItem) => {
  if (exp.isVolunteer) return "volunteer";
  if (/\bintern\b/i.test(exp.role)) return "internship";
  return "role";
};

const TimelineItem = ({ exp }: { exp: ExperienceItem }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });

  return (
    <div ref={ref} className="relative pl-10">
      <motion.span
        aria-hidden
        initial={{ scale: 0.5, opacity: 0.3 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0.3 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute left-0 top-[7px] flex h-[15px] w-[15px] items-center justify-center rounded-full border border-border bg-background"
      >
        <motion.span
          className="h-1.5 w-1.5 rounded-full"
          animate={{
            backgroundColor: inView
              ? "hsl(var(--foreground))"
              : "hsl(var(--muted-foreground) / 0.5)",
          }}
          transition={{ duration: 0.5 }}
        />
        {exp.isCurrent && (
          <span className="absolute inset-0 animate-ping rounded-full border border-accent/50" />
        )}
      </motion.span>

      <motion.span
        aria-hidden
        className="absolute left-[15px] top-[14px] h-px bg-border origin-left"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
        style={{ width: 22 }}
      />

      <motion.div
        initial={{ opacity: 0, x: 14 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 14 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-xs text-muted-foreground">{formatPeriod(exp)}</span>
          <span className="mono-label">{getTypeLabel(exp)}</span>
        </div>

        <h3 className="mt-1.5 text-base font-medium text-foreground">
          {exp.role} <span className="text-muted-foreground">· {exp.company}</span>
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {exp.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {exp.technologies.map((tech) => (
            <span key={tech} className="text-xs text-muted-foreground/70">
              {tech}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const Experience = ({ limit, showViewAll, animateOnView = false }: ExperienceProps) => {
  const railRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 80%", "end 55%"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });
  const railHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  const experiences = useMemo(() => {
    const items = (experiencesData as unknown as ExperienceItem[]) ?? [];
    return [...items].sort((a, b) => {
      const aStart = parseYearMonth(a.startDate)?.getTime() ?? 0;
      const bStart = parseYearMonth(b.startDate)?.getTime() ?? 0;
      if (aStart !== bStart) return bStart - aStart;
      return (b.id ?? 0) - (a.id ?? 0);
    });
  }, []);

  const displayed = useMemo(() => {
    if (!limit || limit <= 0) return experiences;
    return experiences.slice(0, limit);
  }, [experiences, limit]);

  const content = (
    <div>
      <SectionHeader index="03" title="experience" className="mb-8" />

      <h2 className="max-w-2xl text-xl md:text-2xl font-medium tracking-tight text-foreground">
        Where I've built, researched, and contributed.
      </h2>

      <div ref={railRef} className="mt-10 relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/50" aria-hidden />
        <motion.div
          aria-hidden
          className="absolute left-[7px] top-2 w-px origin-top bg-gradient-to-b from-foreground/70 via-foreground/40 to-transparent"
          style={{ height: railHeight, maxHeight: "calc(100% - 1rem)" }}
        />

        <div className="space-y-10">
          {displayed.map((exp) => (
            <TimelineItem key={exp.id} exp={exp} />
          ))}
        </div>
      </div>

      {showViewAll && displayed.length < experiences.length && (
        <div className="mt-10 pl-10">
          <Link
            to="/work"
            onMouseEnter={() => prefetchRoute("/work")}
            onFocus={() => prefetchRoute("/work")}
            className="hover-lift-sm group inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-foreground hover:border-foreground/40"
          >
            full history
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <section id="experience" className="py-16 md:py-20 relative scroll-offset">
      <div className="container-page">
        {animateOnView ? <RevealOnView>{content}</RevealOnView> : content}
      </div>
    </section>
  );
};

export default Experience;
