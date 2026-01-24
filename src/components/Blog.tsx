import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import blogsData from "../data/blogs.json";
import { getBlogImgSrc, getBlogWebpSrc } from "@/lib/blogImages";
import { prefetchRoute } from "@/lib/routePrefetch";

type BlogPost = {
  slug: string;
  title: string;
  date: string;
  readTime?: string;
  tags?: string[];
  summary?: string;
  image?: string;
  body: string[];
  code?: string;
  view?: boolean;
};

type BlogProps = {
  backgroundVariant?: "muted" | "none";
};

const Blog = ({ backgroundVariant = "muted" }: BlogProps) => {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const posts = useMemo(() => {
    return (blogsData as unknown as BlogPost[])
      .filter((p) => p.view !== false)
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
  }, []);

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const post of posts) {
      for (const tag of post.tags ?? []) set.add(tag);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (activeTag && !(post.tags ?? []).includes(activeTag)) return false;

      if (!q) return true;

      const haystack = [
        post.title,
        post.summary ?? "",
        ...(post.tags ?? []),
        ...(post.body ?? []),
        post.code ?? "",
      ]
        .join("\n")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [posts, query, activeTag]);

  const backgroundClassName = backgroundVariant === "muted" ? "bg-muted/30" : "";

  return (
    <section id="blog" className={`pt-6 pb-12 ${backgroundClassName}`.trim()}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="terminal-header mb-0 rounded-t-lg">
            <div className="terminal-dot bg-destructive"></div>
            <div className="terminal-dot bg-accent"></div>
            <div className="terminal-dot bg-code-green"></div>
            <span className="ml-2 font-mono text-xs text-muted-foreground">blog.md</span>
          </div>
          <div className="bg-card border-x border-b border-border rounded-b-lg p-6">
            <h2 className="text-3xl font-bold font-mono mb-2">
              <span className="text-muted-foreground"># </span>
              <span className="text-gradient">Technical Blog</span>
            </h2>
            <p className="text-muted-foreground font-mono text-sm">
              <span className="syntax-comment">{"// "}</span>
              Thoughts on code, architecture, and development
            </p>
          </div>
        </motion.div>

        {/* Search + tag filters */}
        <div className="mb-10">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dot bg-destructive" />
              <div className="terminal-dot bg-accent" />
              <div className="terminal-dot bg-code-green" />
              <span className="ml-2 font-mono text-xs text-muted-foreground flex-1">
                filter.ts
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {filteredPosts.length}/{posts.length}
              </span>
            </div>
            <div className="p-4 md:p-5">
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="search(title, tags, body...)"
                  className="w-full md:max-w-md bg-background border border-border rounded-lg px-4 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTag(null)}
                    className={`font-mono text-xs px-3 py-1.5 rounded border transition-colors ${
                      activeTag === null
                        ? "border-primary text-primary"
                        : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
                    }`}
                  >
                    all()
                  </button>
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
                      className={`font-mono text-xs px-3 py-1.5 rounded border transition-colors ${
                        activeTag === tag
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="terminal-window group hover:border-primary/50 transition-colors"
            >
              <div className="terminal-header">
                <div className="terminal-dot bg-destructive"></div>
                <div className="terminal-dot bg-accent"></div>
                <div className="terminal-dot bg-code-green"></div>
                <span className="ml-2 font-mono text-xs text-muted-foreground flex-1">
                  {post.slug}.md
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {post.date}
                </span>
              </div>

              <Link
                to={`/blog/${post.slug}`}
                onMouseEnter={() => prefetchRoute(`/blog/${post.slug}`)}
                onFocus={() => prefetchRoute(`/blog/${post.slug}`)}
                className="block p-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {(() => {
                    const imageSrc = getBlogImgSrc(post.image);
                    const webpSrc = getBlogWebpSrc(post.image);
                    if (!imageSrc) return null;

                    return (
                      <div className="w-full md:w-56 shrink-0">
                        <picture>
                          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
                          <img
                            src={imageSrc}
                            alt={post.title}
                            className="w-full h-40 md:h-40 rounded-md border border-border object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </picture>
                      </div>
                    );
                  })()}

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className="font-mono text-xl text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      {post.readTime && (
                        <span className="font-mono text-xs text-muted-foreground">
                          ~ {post.readTime} read
                        </span>
                      )}
                    </div>
                
                    {post.tags?.length ? (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-xs px-2 py-1 rounded bg-muted text-code-blue"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                
                    {post.summary && (
                      <p className="text-muted-foreground text-sm mb-4">
                        {post.summary}
                      </p>
                    )}
                
                    {post.code && (
                      <div className="code-block overflow-x-auto">
                        <pre className="text-xs leading-relaxed">
                          <code>{post.code}</code>
                        </pre>
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-2 font-mono text-sm text-primary group-hover:translate-x-2 transition-transform">
                      <span>readMore()</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}

          {filteredPosts.length === 0 && (
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot bg-destructive" />
                <div className="terminal-dot bg-accent" />
                <div className="terminal-dot bg-code-green" />
                <span className="ml-2 font-mono text-xs text-muted-foreground">no-results.md</span>
              </div>
              <div className="p-6">
                <p className="font-mono text-sm text-muted-foreground">
                  No posts match your filters.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;
