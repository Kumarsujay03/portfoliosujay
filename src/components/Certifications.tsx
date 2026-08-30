import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import certificateData from "../data/certificates.json";
import RevealOnView from "@/components/RevealOnView";
import SectionHeader from "@/components/SectionHeader";

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

type CategoryModel = {
  key: (typeof CATEGORY_ORDER)[number];
  title: string;
  items: CertificateWithComputed[];
  displayed: CertificateWithComputed[];
  hiddenCount: number;
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
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const parseMonthYear = (value?: string) => {
  if (!value) return 0;
  const parts = value.trim().split(/\s+/);
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
        const aRank = getGroupRank(groupOrder, getGroupValue(a.item));
        const bRank = getGroupRank(groupOrder, getGroupValue(b.item));
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

const withComputedOrdering = (
  categoryKey: (typeof CATEGORY_ORDER)[number],
  items: Certificate[],
  startId: number,
) => {
  const sorted = sortCertificates(categoryKey, items);
  return sorted.map((cert, index) => ({
    ...cert,
    computedId: startId + index,
    computedPriority: index + 1,
  }) satisfies CertificateWithComputed);
};

const DEFAULT_VISIBLE_BY_CATEGORY: Record<(typeof CATEGORY_ORDER)[number], number> = {
  machineLearning: 3,
  softwareAndWeb: 3,
  simulationsAndPrograms: 0,
};

const splitMachineLearningSections = (items: CertificateWithComputed[]) => ({
  specializations: items.filter((cert) => isSpecialization(cert)),
  courses: items.filter((cert) => !isSpecialization(cert)),
});

type CertificationsProps = {
  forceShowAll?: boolean;
  backgroundVariant?: "muted" | "none";
  hideLabel?: boolean;
  animateOnView?: boolean;
};

const CertCard = ({ cert, index }: { cert: CertificateWithComputed; index: number }) => {
  const logo = getLogoSrc(cert.logo);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, delay: (index % 6) * 0.04 }}
      whileHover={{ y: -4 }}
      className="group surface flex flex-col p-5 transition-colors hover:border-foreground/25"
    >
      <div className="flex items-start gap-3">
        {logo ? (
          <img
            src={logo}
            alt={cert.issuer}
            loading="lazy"
            className="h-8 w-8 shrink-0 rounded object-contain grayscale opacity-80 transition-all group-hover:grayscale-0 group-hover:opacity-100"
          />
        ) : (
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded bg-muted/50 text-[0.7rem] font-semibold text-muted-foreground">
            {cert.issuer.slice(0, 2).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <h4 className="text-[0.8rem] font-normal leading-relaxed text-foreground/65">
            {cert.name}
          </h4>
          <p className="mt-1.5 text-[0.7rem] uppercase tracking-wider text-muted-foreground/60">
            {cert.issuer}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[0.7rem] text-muted-foreground/60">{cert.date}</span>
        {cert.link && (
          <a
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[0.7rem] text-muted-foreground/70 transition-colors hover:text-foreground"
          >
            verify
            <ArrowUpRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

const Certifications = ({ forceShowAll, animateOnView = false }: CertificationsProps) => {
  const navigate = useNavigate();
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
      } satisfies CategoryModel;
    });
  })();

  const categoriesToRender = isShowingAll
    ? categories
    : categories.filter((category) => category.displayed.length > 0);

  const totalCertifications = categories.reduce((acc, c) => acc + c.items.length, 0);
  const hiddenCountTotal = categories.reduce((acc, c) => acc + c.hiddenCount, 0);

  const renderGrid = (items: CertificateWithComputed[]) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((cert, index) => (
        <CertCard key={getCertificateKey(cert, index)} cert={cert} index={index} />
      ))}
    </div>
  );

  const renderSubLabel = (label: string, count: number) => (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="h-3 w-0.5 rounded-full bg-foreground/60" />
      <span className="text-[0.8rem] font-semibold text-foreground/90">{label}</span>
      <span className="text-xs text-muted-foreground/70">({count})</span>
    </div>
  );

  const renderCategory = (category: CategoryModel) => {
    if (category.key !== "machineLearning") return renderGrid(category.displayed);
    const { specializations, courses } = splitMachineLearningSections(category.displayed);
    return (
      <div className="space-y-7">
        {specializations.length > 0 && (
          <div>
            {renderSubLabel("Specializations", specializations.length)}
            {renderGrid(specializations)}
          </div>
        )}
        {courses.length > 0 && (
          <div>
            {renderSubLabel("Courses", courses.length)}
            {renderGrid(courses)}
          </div>
        )}
      </div>
    );
  };

  const content = (
    <div>
      <SectionHeader index="04" title="certifications" className="mb-8" />

      <h2 className="max-w-2xl text-xl md:text-2xl font-medium tracking-tight text-foreground">
        Credentials, coursework, and continuous learning.
      </h2>

      <div className="mt-10 space-y-14">
        {categoriesToRender.map((category) => (
          <div key={category.key}>
            <div className="mb-6 flex items-center gap-3 border-b border-border pb-3">
              <h3 className="text-base font-bold tracking-tight text-foreground md:text-lg">
                {category.title}
              </h3>
              <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[0.7rem] font-medium text-foreground/80">
                {category.items.length}
              </span>
            </div>
            {renderCategory(category)}
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        {hiddenCountTotal > 0 && !forceShowAll && (
          <button
            type="button"
            onClick={() => navigate("/certs")}
            className="hover-lift-sm group inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-mono text-sm text-foreground hover:border-foreground/40"
          >
            all {totalCertifications} certifications
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        )}
        <span className="font-mono text-xs text-muted-foreground/60">
          {totalCertifications} total
        </span>
      </div>
    </div>
  );

  return (
    <section id="certifications" className="py-16 md:py-20 relative scroll-offset">
      <div className="container-page">
        {animateOnView ? <RevealOnView>{content}</RevealOnView> : content}
      </div>
    </section>
  );
};

export default Certifications;
