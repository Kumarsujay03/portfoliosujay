import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Footer from "@/components/Footer";
import FooterBridge from "@/components/FooterBridge";
import PageBackground from "@/components/PageBackground";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";
import { useBlogPost } from "@/lib/blog";
import { renderMarkdown, renderPlainText } from "@/lib/markdown";
import { getBlogImgSrc, getBlogWebpSrc } from "@/lib/blogImages";
import { prefetchRoute } from "@/lib/routePrefetch";

const BlogPostPage = () => {
  const { slug } = useParams();
  const { post, prevPost, nextPost, relatedPosts, isLoading } = useBlogPost(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background scroll-smooth relative overflow-hidden">
        <PageBackground variant="blogPost" />
        <Seo title="Writing" description="Blog post not found." noIndex />
        <main className="pt-24 cv-auto">
          <div className="container-page">
            <h1 className="text-2xl font-medium text-foreground">
              {isLoading ? "Loading…" : "Post not found"}
            </h1>
            {!isLoading && (
              <>
                <p className="mt-2 text-muted-foreground">
                  This post doesn't exist or is no longer published.
                </p>
                <Link
                  to="/blog"
                  className="hover-lift-sm mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-mono text-sm text-foreground hover:border-foreground/40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  back to writing
                </Link>
              </>
            )}
          </div>
        </main>
        <FooterBridge />
        <Footer showSocialLinks />
        <ScrollToTop />
      </div>
    );
  }

  const img = getBlogImgSrc(post.image);
  const webp = getBlogWebpSrc(post.image);
  const hasMarkdown = Boolean(post.content && post.content.trim().length > 0);
  // Warehouse posts carry body as a single plain-text string; legacy bundled
  // posts use string[] paragraphs. Detect the Warehouse case.
  const plainBody = typeof post.body === "string" ? post.body : null;
  const legacyParagraphs = Array.isArray(post.body) ? post.body : [];

  const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "");
  const postUrl = siteUrl ? `${siteUrl}/blog/${post.slug}` : undefined;
  const ogImagePath = post.image && /^https?:\/\//i.test(post.image) ? post.image : "/og-image.png";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary ?? undefined,
    datePublished: post.publishedAt ?? post.date ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? post.date ?? undefined,
    author: { "@type": "Person", name: "Sujay Kumar", url: siteUrl },
    publisher: { "@type": "Person", name: "Sujay Kumar", url: siteUrl },
    keywords: (post.tags ?? []).join(", ") || undefined,
    image: img ?? undefined,
    mainEntityOfPage: postUrl ? { "@type": "WebPage", "@id": postUrl } : undefined,
  };

  return (
    <div className="min-h-screen bg-background scroll-smooth relative overflow-hidden">
      <PageBackground variant="blogPost" />
      <Seo
        title={post.title}
        description={post.summary ?? "Blog post"}
        imagePath={ogImagePath}
        type="article"
        jsonLd={jsonLd}
      />
      <main className="pt-24 cv-auto">
        <article className="container-page">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            back to writing
          </Link>

          {/* Reading measure stays narrow, but stays flush-left with the page grid. */}
          <div className="max-w-3xl">
          <header className="mt-8">
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
              <time>{post.date}</time>
              {post.readTime && (
                <>
                  <span className="opacity-40">·</span>
                  <span>{post.readTime} read</span>
                </>
              )}
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              {post.title}
            </h1>
            {post.tags?.length ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="font-mono text-xs text-muted-foreground/60">
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </header>

          {img && (
            <div className="mt-8 overflow-hidden rounded-xl">
              <picture>
                {webp && <source srcSet={webp} type="image/webp" />}
                <img
                  src={img}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  className="max-h-[420px] w-full object-cover"
                />
              </picture>
            </div>
          )}

          {post.hook && !hasMarkdown && (
            <p className="mt-8 text-lg leading-relaxed text-foreground">
              {post.hook.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 text-[15px]"
          >
            {hasMarkdown ? (
              renderMarkdown(post.content as string)
            ) : plainBody !== null ? (
              // Warehouse body: plain text, line breaks preserved, no Markdown.
              renderPlainText(plainBody)
            ) : (
              <div className="space-y-4">
                {legacyParagraphs.map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
                {post.code && (
                  <pre className="my-5 overflow-x-auto rounded-xl border border-border bg-muted/50 p-4">
                    <code className="font-mono text-[0.85rem] leading-relaxed text-foreground">
                      {post.code}
                    </code>
                  </pre>
                )}
              </div>
            )}
          </motion.div>
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <span className="mono-label">related</span>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.slug}
                    to={`/blog/${rel.slug}`}
                    onMouseEnter={() => prefetchRoute(`/blog/${rel.slug}`)}
                    onFocus={() => prefetchRoute(`/blog/${rel.slug}`)}
                    className="hover-lift group surface p-4 hover:border-foreground/25"
                  >
                    <p className="font-mono text-xs text-muted-foreground/70">{rel.date}</p>
                    <h3 className="mt-2 text-sm font-medium text-foreground">{rel.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(prevPost || nextPost) && (
            <nav className="mt-14 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {prevPost && (
                  <Link
                    to={`/blog/${prevPost.slug}`}
                    onMouseEnter={() => prefetchRoute(`/blog/${prevPost.slug}`)}
                    className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {prevPost.title}
                  </Link>
                )}
              </div>
              <div className="sm:text-right">
                {nextPost && (
                  <Link
                    to={`/blog/${nextPost.slug}`}
                    onMouseEnter={() => prefetchRoute(`/blog/${nextPost.slug}`)}
                    className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {nextPost.title}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </nav>
          )}
        </article>
      </main>
      <FooterBridge />
      <Footer showSocialLinks />
      <ScrollToTop />
    </div>
  );
};

export default BlogPostPage;
