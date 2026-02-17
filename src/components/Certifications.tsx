import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Award, ExternalLink, ChevronRight } from "lucide-react";
import certificateData from "../data/certificates.json";
import RevealOnView from "@/components/RevealOnView";

type Certificate = {
  id?: number;
  priority?: number;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  link?: string;
  logo?: string;
  kind?: "specialization" | "certificate";
  group?: string;
};

type CertificateData = Record<string, Certificate[]>;

type CertificateWithComputed = Certificate & {
  computedId: number;
  computedPriority: number;
};

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

const monthIndex: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

const parseMonthYear = (value?: string) => {
  if (!value) return 0;
  const raw = value.trim();
  const parts = raw.split(/\s+/);
  if (parts.length < 2) return 0;

  const month = monthIndex[parts[0].slice(0, 3).toLowerCase()];
  const year = Number(parts[1]);
  if (!Number.isFinite(year) || typeof month !== "number") return 0;
  return new Date(year, month, 1).getTime();
};

const getCertificateKey = (cert: Certificate, fallbackIndex: number) => {
  const stable = (cert.credentialId && cert.credentialId.trim()) || (cert.link && cert.link.trim());
  if (stable) return stable;
  return `${cert.issuer}|${cert.name}|${cert.date}|${fallbackIndex}`;
};

const isSpecialization = (cert: Certificate) => {
  if (cert.kind === "specialization") return true;
  return cert.name.trim().toLowerCase().startsWith("(specialization)");
};

const getGroupValue = (cert: Certificate) => {
  const group = cert.group?.trim();
  return group ? group : "other";
};

const buildGroupOrder = (items: Array<{ item: Certificate; index: number }>) => {
  const seen = new Set<string>();
  const order: string[] = [];

  for (const entry of items) {
    if (!isSpecialization(entry.item)) continue;
    const g = getGroupValue(entry.item);
    if (seen.has(g)) continue;
    seen.add(g);
    order.push(g);
  }

  for (const entry of items) {
    const g = getGroupValue(entry.item);
    if (seen.has(g)) continue;
    seen.add(g);
    order.push(g);
  }

  return order;
};

const getGroupRank = (groupOrder: string[], group: string) => {
  const idx = groupOrder.indexOf(group);
  return idx >= 0 ? idx : Number.POSITIVE_INFINITY;
};

const sortCertificates = (categoryKey: (typeof CATEGORY_ORDER)[number], items: Certificate[]) => {
  const itemsWithIndex = items.map((item, index) => ({ item, index }));

  if (categoryKey === "machineLearning") {
    const groupOrder = buildGroupOrder(itemsWithIndex);
    return [...itemsWithIndex]
      .sort((a, b) => {
        const aIsSpec = isSpecialization(a.item) ? 0 : 1;
        const bIsSpec = isSpecialization(b.item) ? 0 : 1;
      if (aIsSpec !== bIsSpec) return aIsSpec - bIsSpec;

        const aGroup = getGroupValue(a.item);
        const bGroup = getGroupValue(b.item);
        const aRank = getGroupRank(groupOrder, aGroup);
        const bRank = getGroupRank(groupOrder, bGroup);
      if (aRank !== bRank) return aRank - bRank;

        return a.index - b.index;
      })
      .map((x) => x.item);
  }

  return [...itemsWithIndex]
    .sort((a, b) => {
      const da = parseMonthYear(a.item.date);
      const db = parseMonthYear(b.item.date);
      if (da !== db) return db - da;
      return a.index - b.index;
    })
    .map((x) => x.item);
};

const withComputedOrdering = (categoryKey: (typeof CATEGORY_ORDER)[number], items: Certificate[], startId: number) => {
  const sorted = sortCertificates(categoryKey, items);
  return sorted.map((cert, index) => {
    const computedId = startId + index;
    const computedPriority = index + 1;
    return { ...cert, computedId, computedPriority } satisfies CertificateWithComputed;
  });
};

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

  const categories = (() => {
    let nextId = 1;
    return CATEGORY_ORDER.map((key) => {
      const computedItems = withComputedOrdering(key, (data[key] ?? []) as Certificate[], nextId);
      nextId += computedItems.length;

    const visibleCount = DEFAULT_VISIBLE_BY_CATEGORY[key] ?? 0;
    return {
      key,
      title: CATEGORY_TITLES[key],
      items: computedItems,
      displayed: isShowingAll ? computedItems : computedItems.slice(0, visibleCount),
      hiddenCount: Math.max(0, computedItems.length - visibleCount),
    };
    });
  })();

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
                        key={getCertificateKey(cert, index)}
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
