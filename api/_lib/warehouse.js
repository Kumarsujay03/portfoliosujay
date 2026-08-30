/**
 * Warehouse public API client + mapper. SERVER-SIDE ONLY.
 *
 * Files under api/_lib are not routed by Vercel (no default export handler), so
 * this module never ships to the browser. The API key is read from the
 * environment here and used only in the Authorization header — it must never be
 * exposed through a VITE_ variable.
 *
 * Env (set in Vercel project settings and in .env for local dev):
 *   WAREHOUSE_API_URL   e.g. https://your-warehouse-app.vercel.app
 *   WAREHOUSE_API_KEY   same value as API_ACCESS_KEY in Warehouse
 *
 * Consumers: api/blog/index.js, api/prerender.js, api/sitemap.xml.js
 *
 * IMPORTANT: Warehouse `body` and `hook` are PLAIN TEXT with significant "\n"
 * line breaks — NOT Markdown and NOT HTML. Nothing here interprets formatting
 * syntax; line breaks are preserved verbatim.
 */

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGES = 200;
const REQUEST_TIMEOUT_MS = 10_000;

/** True when both Warehouse env vars are present. */
export const isWarehouseConfigured = (env = process.env) =>
  Boolean(env.WAREHOUSE_API_URL && env.WAREHOUSE_API_KEY);

const getConfig = (env = process.env) => {
  const baseUrl = env.WAREHOUSE_API_URL;
  const apiKey = env.WAREHOUSE_API_KEY;

  if (!baseUrl) throw new Error("WAREHOUSE_API_URL is not set.");
  if (!apiKey) throw new Error("WAREHOUSE_API_KEY is not set.");

  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(baseUrl);
  if (!baseUrl.startsWith("https://") && !isLocal) {
    throw new Error(
      "WAREHOUSE_API_URL must use https:// (refusing to send the API key over plain http).",
    );
  }

  return { baseUrl: baseUrl.replace(/\/$/, ""), apiKey };
};

const request = async (path, env) => {
  const { baseUrl, apiKey } = getConfig(env);

  const res = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      if (body && typeof body.error === "string") detail = ` — ${body.error}`;
    } catch {
      /* response had no JSON body */
    }
    const err = new Error(`Warehouse API ${res.status}${detail}`);
    err.status = res.status;
    throw err;
  }

  return res.json();
};

/** One page of published posts, in Warehouse's own shape. */
export const fetchWarehousePage = async (options = {}, env = process.env) => {
  const params = new URLSearchParams();
  if (options.limit != null) params.set("limit", String(options.limit));
  if (options.offset != null) params.set("offset", String(options.offset));
  if (options.category) params.set("category", options.category);

  const qs = params.toString();
  const json = await request(`/api/public/posts${qs ? `?${qs}` : ""}`, env);

  return {
    data: Array.isArray(json?.data) ? json.data : [],
    pagination: json?.pagination ?? { total: 0, limit: 0, offset: 0, hasMore: false },
  };
};

/** Every published post, paging until Warehouse says there is no more. */
export const fetchAllWarehousePosts = async (env = process.env, pageSize = DEFAULT_PAGE_SIZE) => {
  const all = [];
  let offset = 0;

  for (let page = 0; page < MAX_PAGES; page++) {
    const { data, pagination } = await fetchWarehousePage({ limit: pageSize, offset }, env);
    all.push(...data);
    if (data.length === 0 || !pagination.hasMore) break;
    offset += data.length;
  }

  return all;
};

/** Fetch a single published post by Warehouse id. Returns null on 404. */
export const fetchWarehousePost = async (id, env = process.env) => {
  try {
    const json = await request(`/api/public/posts/${encodeURIComponent(id)}`, env);
    return json?.data ?? null;
  } catch (error) {
    if (error && error.status === 404) return null;
    throw error;
  }
};

// ---- Mapping: Warehouse post -> the shape the writing page renders ----------

const slugify = (value) =>
  String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** Collapse plain text to a single-line excerpt (line breaks -> spaces). */
const toExcerptText = (text) =>
  String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();

const excerpt = (text, maxLength = 180) => {
  const plain = toExcerptText(text);
  if (plain.length <= maxLength) return plain;
  const clipped = plain.slice(0, maxLength);
  const lastSpace = clipped.lastIndexOf(" ");
  const base = lastSpace > 60 ? clipped.slice(0, lastSpace) : clipped;
  return `${base.replace(/[,;:.\s]+$/, "")}…`;
};

const readTimeFor = (text) => {
  const words = toExcerptText(text).split(/\s+/).filter(Boolean).length;
  if (words === 0) return undefined;
  return `${Math.max(1, Math.round(words / 200))} min`;
};

const toDateOnly = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value).slice(0, 10);
  return parsed.toISOString().slice(0, 10);
};

/** Full ISO timestamp (for JSON-LD datePublished / sitemap lastmod). */
export const toIsoTimestamp = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const IMAGE_FORMAT = /^(png|jpe?g|webp|gif|avif|svg(\+xml)?)$|^image\//i;

const isImageMedia = (m) =>
  Boolean(
    m?.url &&
      (IMAGE_FORMAT.test(String(m.format ?? "")) ||
        /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(String(m.url))),
  );

/** Every image URL in Warehouse media, in order (deduplicated). */
const pickImages = (media) => {
  if (!Array.isArray(media)) return [];
  const seen = new Set();
  const urls = [];
  for (const m of media) {
    if (!isImageMedia(m)) continue;
    const url = String(m.url);
    if (seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
  }
  return urls;
};

/** The lead image URL, used for OG/preview cards. */
const pickImage = (media) => pickImages(media)[0] ?? "";

/**
 * Map one Warehouse post to the site's blog post shape. `takenSlugs` is mutated
 * so duplicate titles still get a unique, stable URL.
 *
 * The mapped object keeps `body` as-is (plain text with "\n"). The client and
 * prerenderer render it with white-space: pre-wrap — no Markdown parsing.
 */
export const mapWarehousePost = (post, takenSlugs = new Set()) => {
  if (!post || typeof post !== "object") return null;

  const id = String(post.id ?? "").trim();
  const title = String(post.title ?? "").trim();
  if (!id || !title) return null;

  const base = slugify(title) || `post-${id.slice(0, 8)}`;
  let slug = base;
  if (takenSlugs.has(slug)) slug = `${base}-${id.slice(0, 6)}`;
  takenSlugs.add(slug);

  const body = typeof post.body === "string" ? post.body : "";
  const hook = typeof post.hook === "string" ? post.hook.trim() : "";

  const tags = Array.isArray(post.tags)
    ? post.tags
        .map((tag) => String(tag?.name ?? "").trim())
        .filter(Boolean)
        .slice(0, 12)
    : [];

  const publishedIso = toIsoTimestamp(post.publish_date) ?? toIsoTimestamp(post.created_at);
  const updatedIso = toIsoTimestamp(post.updated_at) ?? publishedIso;

  return {
    id,
    slug,
    title,
    date: toDateOnly(post.publish_date) ?? toDateOnly(post.created_at) ?? "",
    readTime: readTimeFor(`${hook}\n${body}`),
    tags,
    category: post.category ? String(post.category).trim() : undefined,
    // `hook` is a short plain-text lead-in; it becomes the summary/description.
    summary: hook || excerpt(body) || undefined,
    // `hook` and `body` are both plain text; keep them separate so the renderer
    // can show the lead above the body.
    hook: hook || undefined,
    body,
    image: pickImage(post.media),
    images: pickImages(post.media),
    publishedAt: publishedIso ?? undefined,
    updatedAt: updatedIso ?? undefined,
  };
};

/** Map a list of Warehouse posts, newest first. */
export const mapWarehousePosts = (posts) => {
  const taken = new Set();
  return (Array.isArray(posts) ? posts : [])
    .map((post) => mapWarehousePost(post, taken))
    .filter(Boolean)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
};

/** Fetch + map every published post. This is what the API routes use. */
export const getWarehouseBlogPosts = async (env = process.env) =>
  mapWarehousePosts(await fetchAllWarehousePosts(env));
