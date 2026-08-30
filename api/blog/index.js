// GET    /api/blog            -> { posts: [...] }
// POST   /api/blog            -> upsert one or many posts (Bearer token)
// DELETE /api/blog?slug=...   -> remove a post by slug (Bearer token)
//
// Env: BLOG_API_TOKEN, plus KV_REST_API_URL/KV_REST_API_TOKEN (or
// UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN) for storage.
// Optional: BLOG_UPSTREAM_URL, BLOG_ALLOWED_ORIGIN. See .env.example.
//
// GET source precedence: Warehouse (if WAREHOUSE_API_URL/KEY set) -> KV ->
// BLOG_UPSTREAM_URL -> empty. Writes still target KV only.

import { isWarehouseConfigured, getWarehouseBlogPosts } from "../_lib/warehouse.js";

const POSTS_KEY = "blog:posts";

const getKvConfig = () => {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
};

const kvCommand = async (cfg, command) => {
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `KV command failed with ${res.status}`);
  }
  return data.result;
};

const readPosts = async (cfg) => {
  const raw = await kvCommand(cfg, ["GET", POSTS_KEY]);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writePosts = async (cfg, posts) => {
  await kvCommand(cfg, ["SET", POSTS_KEY, JSON.stringify(posts)]);
};

const ALLOWED_FIELDS = [
  "slug",
  "title",
  "date",
  "readTime",
  "tags",
  "summary",
  "image",
  "content",
  "body",
  "code",
  "view",
];

const sanitizePost = (input) => {
  if (!input || typeof input !== "object") return null;
  const slug = String(input.slug || "").trim();
  const title = String(input.title || "").trim();
  if (!slug || !title) return null;

  const post = {};
  for (const field of ALLOWED_FIELDS) {
    if (input[field] !== undefined) post[field] = input[field];
  }
  post.slug = slug;
  post.title = title;
  post.date = String(input.date || new Date().toISOString().slice(0, 10));
  if (Array.isArray(input.tags)) {
    post.tags = input.tags.map((t) => String(t)).slice(0, 12);
  }
  return post;
};

const upsertPosts = (existing, incoming) => {
  const bySlug = new Map(existing.map((p) => [p.slug, p]));
  for (const post of incoming) {
    bySlug.set(post.slug, { ...bySlug.get(post.slug), ...post });
  }
  return Array.from(bySlug.values()).sort((a, b) =>
    String(b.date || "").localeCompare(String(a.date || "")),
  );
};

const parseBody = (req) => {
  const { body } = req;
  if (!body) return null;
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  return body;
};

const isAuthorized = (req) => {
  const expected = process.env.BLOG_API_TOKEN;
  if (!expected) return false;
  const header = req.headers.authorization || req.headers.Authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : header;
  return token === expected;
};

const setCors = (res) => {
  const origin = process.env.BLOG_ALLOWED_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const kv = getKvConfig();

  if (req.method === "GET") {
    try {
      // Warehouse is the primary source when configured. It's the published-
      // content system; KV/upstream remain as fallbacks for older setups.
      if (isWarehouseConfigured()) {
        try {
          const posts = await getWarehouseBlogPosts();
          return res.status(200).json({ posts, source: "warehouse" });
        } catch (warehouseError) {
          // Fall through to KV/upstream rather than failing the whole request.
          console.error("Warehouse fetch failed, falling back:", warehouseError);
        }
      }
      if (kv) {
        const posts = await readPosts(kv);
        return res.status(200).json({ posts, source: "kv" });
      }
      const upstream = process.env.BLOG_UPSTREAM_URL;
      if (upstream) {
        const upstreamRes = await fetch(upstream, { headers: { Accept: "application/json" } });
        const data = await upstreamRes.json().catch(() => ({}));
        const posts = Array.isArray(data) ? data : Array.isArray(data.posts) ? data.posts : [];
        return res.status(200).json({ posts, source: "upstream" });
      }
      return res.status(200).json({ posts: [], source: "none" });
    } catch (error) {
      return res.status(502).json({ error: error instanceof Error ? error.message : "Failed to load posts" });
    }
  }

  // Writes require auth.
  if (req.method === "POST" || req.method === "DELETE") {
    if (!process.env.BLOG_API_TOKEN) {
      return res.status(501).json({ error: "Publishing is not configured. Set BLOG_API_TOKEN." });
    }
    if (!isAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!kv) {
      return res.status(501).json({
        error: "No storage configured. Set KV_REST_API_URL/KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL/TOKEN).",
      });
    }
  }

  if (req.method === "POST") {
    try {
      const payload = parseBody(req);
      const rawList = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.posts)
          ? payload.posts
          : payload
            ? [payload]
            : [];

      const incoming = rawList.map(sanitizePost).filter(Boolean);
      if (incoming.length === 0) {
        return res.status(400).json({ error: "No valid posts. Each post needs a slug and title." });
      }

      const existing = await readPosts(kv);
      const merged = upsertPosts(existing, incoming);
      await writePosts(kv, merged);

      return res.status(200).json({ ok: true, count: incoming.length, total: merged.length });
    } catch (error) {
      return res.status(502).json({ error: error instanceof Error ? error.message : "Failed to save posts" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const slug = String(req.query.slug || "").trim();
      if (!slug) return res.status(400).json({ error: "Missing slug" });

      const existing = await readPosts(kv);
      const next = existing.filter((p) => p.slug !== slug);
      await writePosts(kv, next);

      return res.status(200).json({ ok: true, removed: existing.length - next.length, total: next.length });
    } catch (error) {
      return res.status(502).json({ error: error instanceof Error ? error.message : "Failed to delete post" });
    }
  }

  res.setHeader("Allow", "GET, POST, DELETE, OPTIONS");
  return res.status(405).json({ error: "Method not allowed" });
}
