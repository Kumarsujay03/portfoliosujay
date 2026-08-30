import { useQuery } from "@tanstack/react-query";
import bundledPosts from "@/data/blogs.json";

export type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  date: string;
  readTime?: string;
  tags?: string[];
  category?: string;
  summary?: string;
  image?: string;
  /** All post images in order (Warehouse). `image` is the lead/OG image. */
  images?: string[];
  /** Warehouse lead-in (plain text, line breaks significant). */
  hook?: string;
  /**
   * Body content. Two shapes are supported:
   * - string: Warehouse plain text (rendered with pre-wrap, NOT Markdown).
   * - string[]: legacy bundled paragraphs.
   */
  body?: string | string[];
  /** Legacy bundled Markdown content. */
  content?: string;
  code?: string;
  /** ISO timestamps from Warehouse for JSON-LD / metadata. */
  publishedAt?: string;
  updatedAt?: string;
  view?: boolean;
};

const API_URL = (import.meta.env.VITE_BLOG_API_URL as string | undefined) || "/api/blog";

const toPostArray = (raw: unknown): BlogPost[] => {
  if (Array.isArray(raw)) return raw as BlogPost[];
  if (raw && typeof raw === "object" && Array.isArray((raw as { posts?: unknown }).posts)) {
    return (raw as { posts: BlogPost[] }).posts;
  }
  return [];
};

export const normalizePosts = (posts: BlogPost[]): BlogPost[] =>
  posts
    .filter((p) => p && p.slug && p.view !== false)
    .slice()
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

const getBundledPosts = (): BlogPost[] => normalizePosts(bundledPosts as unknown as BlogPost[]);

// Fetches posts from the API (Warehouse/KV/upstream). Only when the API is
// unavailable or returns nothing do we fall back to the posts bundled in
// src/data/blogs.json. When the API has posts, the bundled ones are never used.
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const res = await fetch(API_URL, { headers: { Accept: "application/json" } });
    if (!res.ok) return getBundledPosts();
    const data = await res.json();
    const posts = normalizePosts(toPostArray(data));
    return posts.length > 0 ? posts : getBundledPosts();
  } catch {
    return getBundledPosts();
  }
};

export const useBlogPosts = () =>
  useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPosts,
    staleTime: 5 * 60 * 1000,
    // Show bundled posts as a placeholder while the API loads, but never treat
    // them as real cached data — the fetched result always replaces them.
    placeholderData: getBundledPosts,
  });

export const useBlogPost = (slug: string | undefined) => {
  const query = useBlogPosts();
  const posts = query.data ?? [];
  const index = slug ? posts.findIndex((p) => p.slug === slug) : -1;
  const post = index >= 0 ? posts[index] : null;

  return {
    ...query,
    post,
    prevPost: index >= 0 ? posts[index + 1] ?? null : null,
    nextPost: index >= 1 ? posts[index - 1] ?? null : null,
    relatedPosts: getRelated(post, posts),
  };
};

const getRelated = (post: BlogPost | null, posts: BlogPost[]): BlogPost[] => {
  if (!post) return [];
  const tags = new Set(post.tags ?? []);
  if (tags.size === 0) return posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, overlap: (p.tags ?? []).filter((t) => tags.has(t)).length }))
    .filter((x) => x.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || b.p.date.localeCompare(a.p.date))
    .slice(0, 3)
    .map((x) => x.p);
};
