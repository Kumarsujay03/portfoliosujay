import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import FooterBridge from "@/components/FooterBridge";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";
import blogsData from "@/data/blogs.json";
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

const BlogPostPage = () => {
  const { slug } = useParams();

  const posts = useMemo(() => {
    const all = blogsData as unknown as BlogPost[];
    return all
      .filter((p) => p.view !== false)
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
  }, []);

  const postIndex = useMemo(() => {
    if (!slug) return -1;
    return posts.findIndex((p) => p.slug === slug);
  }, [posts, slug]);

  const post = postIndex >= 0 ? posts[postIndex] : null;
  const prevPost = postIndex >= 0 ? posts[postIndex + 1] ?? null : null;
  const nextPost = postIndex >= 1 ? posts[postIndex - 1] ?? null : null;
  const relatedPosts = useMemo(() => {
    if (!post) return [] as BlogPost[];

    const postTags = new Set(post.tags ?? []);
    if (postTags.size === 0) {
      return posts.filter((p) => p.slug !== post.slug).slice(0, 3);
    }

    const scored = posts
      .filter((p) => p.slug !== post.slug)
      .map((p) => {
        const tags = p.tags ?? [];
        const overlap = tags.filter((t) => postTags.has(t)).length;
        return { post: p, overlap };
      })
      .filter((item) => item.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap || b.post.date.localeCompare(a.post.date));

    return scored.slice(0, 3).map((item) => item.post);
  }, [post, posts]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background scroll-smooth">
        <Seo title="Blog" description="Blog post not found." noIndex />
        <main className="pt-20">
          <div className="container mx-auto px-6">
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot bg-destructive" />
                <div className="terminal-dot bg-accent" />
                <div className="terminal-dot bg-code-green" />
                <span className="ml-2 font-mono text-xs text-muted-foreground">blog/404.md</span>
              </div>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">Post not found</h1>
                <p className="text-muted-foreground mb-6">
                  The blog post you’re looking for doesn’t exist (or is hidden).
                </p>
                <Link
                  to="/blog"
                  className="font-mono text-sm px-4 py-2 border border-border rounded-lg bg-card hover:border-primary hover:text-primary transition-all inline-flex items-center gap-2"
                >
                  backToBlog()
                </Link>
              </div>
            </div>
          </div>
        </main>
        <FooterBridge />
        <Footer showSocialLinks />
        <ScrollToTop />
      </div>
    );
  }

  const imageSrc = getBlogImgSrc(post.image);
  const imageWebpSrc = getBlogWebpSrc(post.image);

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Seo title={post.title} description={post.summary ?? "Blog post"} imagePath="/favicon.svg" />
      <main className="pt-20">
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <Link
              to="/blog"
              className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← backToBlog()
            </Link>
          </div>

          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="terminal-window"
          >
            <div className="terminal-header">
              <div className="terminal-dot bg-destructive" />
              <div className="terminal-dot bg-accent" />
              <div className="terminal-dot bg-code-green" />
              <span className="ml-2 font-mono text-xs text-muted-foreground flex-1">
                {post.slug}.md
              </span>
              <span className="font-mono text-xs text-muted-foreground">{post.date}</span>
            </div>

            {imageSrc && (
              <div className="border-b border-border bg-muted/20">
                <picture>
                  {imageWebpSrc && <source srcSet={imageWebpSrc} type="image/webp" />}
                  <img
                    src={imageSrc}
                    alt={post.title}
                    className="w-full max-h-[420px] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
            )}

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
                {post.readTime && (
                  <span className="font-mono text-xs text-muted-foreground">~ {post.readTime} read</span>
                )}
              </div>

              {post.tags?.length ? (
                <div className="flex flex-wrap gap-2 mb-6">
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

              <div className="space-y-4">
                {post.body.map((paragraph, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {post.code && (
                <div className="mt-8 code-block overflow-x-auto">
                  <pre className="text-xs leading-relaxed">
                    <code>{post.code}</code>
                  </pre>
                </div>
              )}

              {relatedPosts.length > 0 && (
                <div className="mt-10">
                  <div className="terminal-header rounded-t-lg">
                    <div className="terminal-dot bg-destructive" />
                    <div className="terminal-dot bg-accent" />
                    <div className="terminal-dot bg-code-green" />
                    <span className="ml-2 font-mono text-xs text-muted-foreground">
                      relatedPosts()
                    </span>
                  </div>
                  <div className="border-x border-b border-border rounded-b-lg p-5 bg-card">
                    <div className="grid gap-4 md:grid-cols-3">
                      {relatedPosts.map((rel) => (
                        <Link
                          key={rel.slug}
                          to={`/blog/${rel.slug}`}
                          onMouseEnter={() => prefetchRoute(`/blog/${rel.slug}`)}
                          onFocus={() => prefetchRoute(`/blog/${rel.slug}`)}
                          className="rounded-lg border border-border bg-background/40 p-4 hover:border-primary/60 transition-colors"
                        >
                          <p className="font-mono text-sm text-muted-foreground">
                            {rel.date}
                          </p>
                          <h3 className="mt-2 font-mono text-base text-foreground">
                            {rel.title}
                          </h3>
                          {rel.tags?.length ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {rel.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="font-mono text-[10px] px-2 py-1 rounded bg-muted text-code-blue"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(prevPost || nextPost) && (
                <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                  <div>
                    {prevPost ? (
                      <Link
                        to={`/blog/${prevPost.slug}`}
                        onMouseEnter={() => prefetchRoute(`/blog/${prevPost.slug}`)}
                        onFocus={() => prefetchRoute(`/blog/${prevPost.slug}`)}
                        className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        ← prevPost({prevPost.title})
                      </Link>
                    ) : null}
                  </div>
                  <div className="text-left md:text-right">
                    {nextPost ? (
                      <Link
                        to={`/blog/${nextPost.slug}`}
                        onMouseEnter={() => prefetchRoute(`/blog/${nextPost.slug}`)}
                        onFocus={() => prefetchRoute(`/blog/${nextPost.slug}`)}
                        className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        nextPost({nextPost.title}) →
                      </Link>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </motion.article>
        </div>
      </main>
      <FooterBridge />
      <Footer showSocialLinks />
      <ScrollToTop />
    </div>
  );
};

export default BlogPostPage;
