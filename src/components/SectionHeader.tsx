type SectionHeaderProps = {
  index?: string;
  title: string;
  className?: string;
};

const SectionHeader = ({ index, title, className }: SectionHeaderProps) => (
  <div className={`flex items-center gap-4 ${className ?? ""}`.trim()}>
    {index && (
      <span className="font-mono text-xs tabular-nums text-muted-foreground/60">{index}</span>
    )}
    <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-foreground">
      {title}
    </span>
    <span className="h-px flex-1 bg-border" />
  </div>
);

export default SectionHeader;
