import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Award, ExternalLink, ChevronRight } from "lucide-react";
import certificateData from "../data/certificates.json";
import RevealOnView from "@/components/RevealOnView";

type Certificate = {
  id: number;
  priority?: number;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  link?: string;
  logo?: string;
};

type CertificateData = Record<string, Certificate[]>;

const CATEGORY_ORDER = ["machineLearning", "softwareAndWeb", "simulationsAndPrograms"] as const;

const CATEGORY_TITLES: Record<(typeof CATEGORY_ORDER)[number], string> = {
  machineLearning: "Machine Learning",
  softwareAndWeb: "Software & Web",
  simulationsAndPrograms: "Simulations & Programs",
};

const getLogoSrc = (logoFile?: string) => {
  if (!logoFile) return null;
  try {
    return new URL(`../assets/logo/${logoFile}`, import.meta.url).href;
  } catch {
    return null;
  }
};

const sortByPriority = (items: Certificate[]) =>
  [...items].sort((a, b) => {
    const pa = typeof a.priority === "number" ? a.priority : 999;
    const pb = typeof b.priority === "number" ? b.priority : 999;
    if (pa !== pb) return pa - pb;
    return (a.id ?? 0) - (b.id ?? 0);
  });

const DEFAULT_VISIBLE_BY_CATEGORY: Record<(typeof CATEGORY_ORDER)[number], number> = {
  machineLearning: 3,
  softwareAndWeb: 3,
  simulationsAndPrograms: 0,
};

type CertificationsProps = {
  forceShowAll?: boolean;
  backgroundVariant?: "muted" | "none";
  hideLabel?: boolean;
  animateOnView?: boolean;
};

const Certifications = ({ forceShowAll, backgroundVariant = "muted", hideLabel, animateOnView = false }: CertificationsProps) => {
  const navigate = useNavigate();

  const sectionPaddingClassName = forceShowAll ? "pt-6 pb-12" : "py-20";

  const data = certificateData as unknown as CertificateData;

  const isShowingAll = Boolean(forceShowAll);

  const categories = CATEGORY_ORDER.map((key) => {
    const items = sortByPriority((data[key] ?? []) as Certificate[]);
    const visibleCount = DEFAULT_VISIBLE_BY_CATEGORY[key] ?? 0;
    return {
      key,
      title: CATEGORY_TITLES[key],
      items,
      displayed: isShowingAll ? items : items.slice(0, visibleCount),
      hiddenCount: Math.max(0, items.length - visibleCount),
    };
  });

  const categoriesToRender = isShowingAll
    ? categories
    : categories.filter((category) => category.displayed.length > 0);

  const totalCertifications = categories.reduce((acc, c) => acc + c.items.length, 0);
  const hiddenCountTotal = categories.reduce((acc, c) => acc + c.hiddenCount, 0);

  const hasAnyHidden = hiddenCountTotal > 0;

  const backgroundClassName = backgroundVariant === "muted" ? "bg-muted/30" : "";

  const content = (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-12"
      >
            {!hideLabel && (
              <h2 className="font-mono text-sm text-primary mb-2">
                {"// 04. Certifications"}
              </h2>
            )}

            <div className="terminal-header mb-0 rounded-t-lg">
              <div className="terminal-dot bg-destructive"></div>
              <div className="terminal-dot bg-accent"></div>
              <div className="terminal-dot bg-code-green"></div>
              <span className="ml-2 font-mono text-xs text-muted-foreground">certificates.json</span>
            </div>
            <div className="bg-card border-x border-b border-border rounded-b-lg p-6">
              <h2 className="text-3xl font-bold font-mono mb-2 flex items-center gap-3">
                <Award className="w-8 h-8 text-primary" />
                <span className="text-gradient">Certifications</span>
              </h2>
              <p className="text-muted-foreground font-mono text-sm">
                <span className="syntax-comment">{"// "}</span>
                Professional credentials and achievements
              </p>
            </div>
          </motion.div>

          <div className="space-y-10">
            {categoriesToRender.map((category) => (
              <div key={category.key}>
                <div className="mb-4 flex items-center gap-3">
                  <p className="font-mono text-sm text-muted-foreground">
                    <span className="syntax-comment">{"// "}</span>
                    {category.title}
                  </p>
                  <div className="h-px flex-1 bg-border/60" />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {category.displayed.map((cert, index) => (
                      <motion.div
                        key={cert.id}
                        layout
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="terminal-window group hover:border-primary/50 transition-colors"
                      >
                        <div className="terminal-header">
                          <div className="terminal-dot bg-destructive"></div>
                          <div className="terminal-dot bg-accent"></div>
                          <div className="terminal-dot bg-code-green"></div>
                          <span className="ml-2 font-mono text-xs text-muted-foreground">
                            {cert.date}
                          </span>
                        </div>

                        <div className="p-5">
                          <div className="flex items-start gap-3 mb-3">
                            <motion.span
                              className="shrink-0"
                              whileHover={{ scale: 1.2, rotate: 10 }}
                            >
                              {getLogoSrc(cert.logo) ? (
                                <img
                                  src={getLogoSrc(cert.logo) ?? ""}
                                  alt={cert.issuer}
                                  className="h-8 w-8 rounded object-contain bg-background/40 p-1"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="text-2xl">🏆</span>
                              )}
                            </motion.span>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-mono text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                                {cert.name}
                              </h3>
                              <p className="font-mono text-xs text-muted-foreground mt-1">
                                @ {cert.issuer}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs font-mono">
                            {cert.credentialId && (
                              <div className="flex items-center justify-between text-muted-foreground">
                                <span className="syntax-keyword">credentialId:</span>
                                <span className="syntax-string">"{cert.credentialId}"</span>
                              </div>
                            )}

                            {cert.link && (
                              <motion.a
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ x: 4 }}
                                className="flex items-center gap-1 text-code-blue hover:text-primary transition-colors mt-3"
                              >
                                <span>verify()</span>
                                <ExternalLink className="w-3 h-3" />
                              </motion.a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>

          {hasAnyHidden && !forceShowAll && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center"
            >
              <motion.button
                onClick={() => navigate("/certs")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="font-mono text-sm px-6 py-3 border border-border rounded-lg bg-card hover:border-primary hover:text-primary transition-all inline-flex items-center gap-2 group"
              >
                <span>showAll({hiddenCountTotal})</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
        className="mt-6 text-center"
      >
        <p className="font-mono text-xs text-muted-foreground">
          <span className="syntax-comment">{"// "}</span>
          Total: {totalCertifications} certifications
        </p>
      </motion.div>
    </>
  );

  return (
    <section id="certifications" className={`${sectionPaddingClassName} ${backgroundClassName}`.trim()}>
      <div className="container mx-auto px-6">
        {animateOnView ? <RevealOnView>{content}</RevealOnView> : content}
      </div>
    </section>
  );
};

export default Certifications;
