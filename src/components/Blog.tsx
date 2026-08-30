import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { useBlogPosts, type BlogPost } from "@/lib/blog";
import { getBlogImgSrc, getBlogWebpSrc } from "@/lib/blogImages";
import { prefetchRoute } from "@/lib/routePrefetch";
import SectionHeader from "@/components/SectionHeader";
import SmartImage from "@/components/SmartImage";

type BlogProps = {
  backgroundVariant?: "muted" | "none";
};

const bodyToText = (body: BlogPost["body"]) =>
  Array.isArray(body) ? body.join("\n") : body ?? "";

const searchableText = (post: BlogPost) =>
  [
    post.title,
    post.summary ?? "",
    post.hook ?? "",
    post.category ?? "",
    ...(post.tags ?? []),
    post.content ?? "",
    bodyToText(post.body),
  ]
    .join("\n")
    .toLowerCase();

const Blog = (_props: BlogProps) => {
  const { data: posts = [], isLoading } = useBlogPosts();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const post of posts) for (const tag of post.tags ?? []) set.add(tag);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (activeTag && !(post.tags ?? []).includes(activeTag)) return false;
      if (!q) return true;
      return searchableText(post).includes(q);
    });
  }, [posts, query, activeTag]);

  return (
    <section id="blog" className="py-8">
      <div className="container-page">
        <div className="mb-10">
          <SectionHeader index="07" title="writing" className="mb-6" />
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
            Notes on ML, research, and building.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Papers I reimplement, ideas I'm chewing on, and lessons from turning
            research into working systems.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts…"
              className="w-full rounded-full border border-border bg-card/50 py-2.5 pl-10 pr-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none"
            />
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className={`pill ${activeTag === null ? "border-foreground/40 text-foreground" : ""}`}
              >
                all
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
                  className={`pill ${activeTag === tag ? "border-foreground/40 text-foreground" : ""}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="divide-y divide-border/60">
          {filtered.map((post, index) => {
            const img = getBlogImgSrc(post.image);
            const webp = getBlogWebpSrc(post.image);
            return (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.04 }}
                whileHover={{ y: -3 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  onMouseEnter={() => prefetchRoute(`/blog/${post.slug}`)}
                  onFocus={() => prefetchRoute(`/blog/${post.slug}`)}
                  className="group flex flex-col gap-4 py-7 sm:flex-row sm:items-start"
                >
                  {img && (
                    <SmartImage
                      src={img}
                      webpSrc={webp}
                      alt={post.title}
                      className="w-full shrink-0 rounded-lg sm:w-40"
                      imgClassName="h-32 w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 sm:h-24"
                    />
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                      <time>{post.date}</time>
                      {post.readTime && (
                        <>
                          <span className="opacity-40">·</span>
                          <span>{post.readTime} read</span>
                        </>
                      )}
                    </div>

                    <h2 className="mt-2 flex items-start gap-2 text-lg font-medium text-foreground">
                      <span className="transition-colors group-hover:text-foreground">{post.title}</span>
                      <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </h2>

                    {post.summary && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {post.summary}
                      </p>
                    )}

                    {post.tags?.length ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span key={tag} className="font-mono text-xs text-muted-foreground/60">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Link>
              </motion.article>
            );
          })}

          {filtered.length === 0 && (
            <p className="py-16 text-center font-mono text-sm text-muted-foreground">
              {isLoading ? "loading…" : "No posts match your filters."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;
