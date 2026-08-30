import { motion } from "framer-motion";
import aboutData from "../data/about.json";
import RevealOnView from "@/components/RevealOnView";
import DitherPortrait from "@/components/DitherPortrait";
import SectionHeader from "@/components/SectionHeader";

type AboutData = {
  headline: string;
  paragraphs: string[];
  focusAreas: { title: string; description: string }[];
  facts: { label: string; value: string }[];
};

type AboutProps = {
  hideLabel?: boolean;
  animateOnView?: boolean;
  showPortrait?: boolean;
  /** Cap how many paragraphs render. The home page shows a shorter intro. */
  maxParagraphs?: number;
};

const About = ({ animateOnView = false, showPortrait = true, maxParagraphs }: AboutProps) => {
  const { headline, paragraphs, focusAreas, facts } = aboutData as AboutData;
  const visibleParagraphs =
    typeof maxParagraphs === "number" ? paragraphs.slice(0, maxParagraphs) : paragraphs;

  const content = (
    <div>
      <SectionHeader index="01" title="about" className="mb-10" />

      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="max-w-xl text-2xl md:text-3xl font-medium tracking-tight text-foreground">
            {headline}
          </h2>
          <div className="mt-6 space-y-4 max-w-xl">
            {visibleParagraphs.map((p, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {showPortrait && (
            <div className="mx-auto w-full max-w-[340px]">
              <DitherPortrait />
            </div>
          )}
          <dl className="surface divide-y divide-border">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-center justify-between px-4 py-2.5">
                <dt className="mono-label">{fact.label}</dt>
                <dd className="font-mono text-xs text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-16">
        <SectionHeader title="focus areas" className="mb-5" />
        <div className="grid gap-4 sm:grid-cols-2">
          {focusAreas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="surface p-5 transition-colors hover:border-foreground/25"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-muted-foreground/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-medium text-foreground">{area.title}</h3>
              </div>
              <p className="mt-2 pl-8 text-sm leading-relaxed text-muted-foreground">
                {area.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section id="about" className="py-16 md:py-20 relative scroll-offset">
      <div className="container-page">
        {animateOnView ? <RevealOnView>{content}</RevealOnView> : content}
      </div>
    </section>
  );
};

export default About;
