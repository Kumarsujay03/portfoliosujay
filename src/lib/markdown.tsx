import { createElement, Fragment, type ReactNode } from "react";

// Renders Markdown to React elements (never dangerouslySetInnerHTML), so
// API-supplied content is escaped by React rather than trusted.

const isSafeHref = (href: string) => {
  const trimmed = href.trim();
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return true;
  return /^(https?:|mailto:)/i.test(trimmed);
};

const renderInline = (text: string, keyPrefix: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  const pattern =
    /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(\*[^*]+\*)|(_[^_]+_)|(\[[^\]]+\]\([^)]+\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<Fragment key={`${keyPrefix}-t-${i}`}>{text.slice(lastIndex, match.index)}</Fragment>);
    }
    const token = match[0];

    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${i}`}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("[")) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch && isSafeHref(linkMatch[2])) {
        const [, label, href] = linkMatch;
        const external = /^https?:/i.test(href);
        nodes.push(
          <a
            key={`${keyPrefix}-a-${i}`}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"
          >
            {label}
          </a>,
        );
      } else {
        nodes.push(<Fragment key={`${keyPrefix}-a-${i}`}>{token}</Fragment>);
      }
    } else {
      nodes.push(
        <em key={`${keyPrefix}-i-${i}`} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }

    lastIndex = match.index + token.length;
    i++;
  }

  if (lastIndex < text.length) {
    nodes.push(<Fragment key={`${keyPrefix}-t-end`}>{text.slice(lastIndex)}</Fragment>);
  }

  return nodes;
};

/**
 * Render PLAIN TEXT (Warehouse body/hook) to React elements. Line breaks are
 * significant: a blank line starts a new paragraph, a single newline is a <br>.
 * No Markdown/HTML syntax is interpreted — matches how Warehouse displays posts
 * (white-space: pre-wrap). React escapes the text, so it's safe by default.
 */
export const renderPlainText = (text: string, className?: string): ReactNode => {
  const normalized = text.replace(/\r\n/g, "\n");
  const paragraphs = normalized.split(/\n{2,}/).map((p) => p.replace(/\s+$/g, "")).filter((p) => p.trim() !== "");

  return (
    <>
      {paragraphs.map((para, pIdx) => {
        const lines = para.split("\n");
        return (
          <p
            key={`pt-${pIdx}`}
            className={className ?? "my-4 leading-relaxed text-muted-foreground"}
          >
            {lines.map((line, lIdx) => (
              <Fragment key={`pt-${pIdx}-${lIdx}`}>
                {line}
                {lIdx < lines.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
};

export const renderMarkdown = (markdown: string): ReactNode => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];

  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trimStart().startsWith("```")) {
      const fence = line.trimStart();
      const lang = fence.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(
        <pre
          key={`md-${key++}`}
          className="my-5 overflow-x-auto rounded-xl border border-border bg-muted/50 p-4"
        >
          <code className="font-mono text-[0.85rem] leading-relaxed text-foreground" data-lang={lang}>
            {code.join("\n")}
          </code>
        </pre>,
      );
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push(<hr key={`md-${key++}`} className="my-8 border-border" />);
      i++;
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      const cls =
        level === 1
          ? "mt-10 mb-4 text-2xl font-semibold tracking-tight text-foreground"
          : level === 2
            ? "mt-9 mb-3 text-xl font-semibold tracking-tight text-foreground"
            : "mt-7 mb-2 text-lg font-medium text-foreground";
      const tag = `h${Math.min(level + 1, 6)}`;
      blocks.push(
        createElement(tag, { key: `md-${key++}`, className: cls }, renderInline(text, `h-${key}`)),
      );
      i++;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote
          key={`md-${key++}`}
          className="my-5 border-l-2 border-border pl-4 text-muted-foreground italic"
        >
          {renderInline(quote.join(" "), `q-${key}`)}
        </blockquote>,
      );
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={`md-${key++}`} className="my-5 list-disc space-y-1.5 pl-6 text-muted-foreground marker:text-muted-foreground/50">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item, `ul-${key}-${idx}`)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={`md-${key++}`} className="my-5 list-decimal space-y-1.5 pl-6 text-muted-foreground marker:text-muted-foreground/50">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item, `ol-${key}-${idx}`)}
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trimStart().startsWith("```") &&
      !/^(#{1,4})\s+/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^\s*>\s?/.test(lines[i]) &&
      !/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={`md-${key++}`} className="my-4 leading-relaxed text-muted-foreground">
        {renderInline(para.join(" "), `p-${key}`)}
      </p>,
    );
  }

  return <>{blocks}</>;
};
