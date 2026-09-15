/**
 * Server-side SEO helpers shared by the prerender and sitemap functions.
 * SERVER-SIDE ONLY (under api/_lib, never bundled to the browser).
 */

/** Escape text for safe insertion into HTML element content. */
export const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** Escape text for safe insertion into a double-quoted HTML attribute. */
export const escapeAttr = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * Escape a value for embedding inside a <script type="application/ld+json">
 * block. JSON.stringify handles quoting; we only neutralize the sequences that
 * could break out of the script element.
 */
export const jsonLdSafe = (obj) =>
  JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

/** Resolve the public site origin from env (no trailing slash). */
export const resolveSiteUrl = (env = process.env) => {
  const candidates = [
    env.VITE_SITE_URL,
    env.SITE_URL,
    env.PUBLIC_SITE_URL,
    env.VERCEL_URL ? `https://${env.VERCEL_URL}` : null,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
      if (url.protocol === "http:" || url.protocol === "https:") return url.origin;
    } catch {
      /* try next candidate */
    }
  }
  return null;
};

/** Absolute URL for a site-relative path, or the path itself if no origin. */
export const absoluteUrl = (path, env = process.env) => {
  const origin = resolveSiteUrl(env);
  const clean = path.startsWith("/") ? path : `/${path}`;
  return origin ? `${origin}${clean}` : clean;
};

const BASE_TITLE = "Sujay Kumar";

/** Our generated preview card, whose exact dimensions we know. */
const DEFAULT_OG_IMAGE = "/og-image.png";
const DEFAULT_OG_WIDTH = "1200";
const DEFAULT_OG_HEIGHT = "630";

const IMAGE_MIME = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

/** Infer the image MIME type from a URL's extension, or null if unknown. */
const imageMimeType = (url) => {
  const match = /\.([a-z0-9]+)(?:[?#]|$)/i.exec(String(url ?? ""));
  if (!match) return null;
  return IMAGE_MIME[match[1].toLowerCase()] ?? null;
};

/**
 * Build the <head> tag string for a blog post (or the blog index) and the
 * JSON-LD block. Returned as a single HTML string ready to inject.
 *
 * `meta` fields:
 *   title, description, canonicalPath, image (absolute or relative),
 *   type ("article" | "website"), post (optional, for Article JSON-LD)
 */
export const buildHeadTags = (meta, env = process.env) => {
  const origin = resolveSiteUrl(env);
  const fullTitle =
    meta.type === "article" && meta.title
      ? `${meta.title} | ${BASE_TITLE}`
      : meta.title || `${BASE_TITLE} - Machine Learning Researcher`;

  // Meta descriptions must be single-line; collapse newlines/whitespace.
  const description = (meta.description || `${BASE_TITLE} — machine learning researcher and engineer.`)
    .replace(/\s+/g, " ")
    .trim();
  const canonical = meta.canonicalPath ? absoluteUrl(meta.canonicalPath, env) : origin || "";
  const rawImage = meta.image || DEFAULT_OG_IMAGE;
  const image = /^https?:\/\//i.test(rawImage) ? rawImage : absoluteUrl(rawImage, env);
  const ogType = meta.type === "article" ? "article" : "website";

  // Declaring the type and pixel size lets crawlers build a large preview card
  // without fetching the file first. Only claim dimensions for our own generated
  // card: post images come from Warehouse at arbitrary sizes, and advertising
  // the wrong dimensions makes some crawlers skip the large card entirely.
  const imageMime = imageMimeType(rawImage);
  const imageIsDefault = /(^|\/)og-image\.png$/i.test(rawImage);

  const tags = [
    `<title>${escapeHtml(fullTitle)}</title>`,
    `<meta name="description" content="${escapeAttr(description)}" />`,
    `<meta name="robots" content="index,follow" />`,
    canonical ? `<link rel="canonical" href="${escapeAttr(canonical)}" />` : "",
    `<meta property="og:title" content="${escapeAttr(fullTitle)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    `<meta property="og:site_name" content="${escapeAttr(BASE_TITLE)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    canonical ? `<meta property="og:url" content="${escapeAttr(canonical)}" />` : "",
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:image" content="${escapeAttr(image)}" />`,
    `<meta property="og:image:secure_url" content="${escapeAttr(image)}" />`,
    imageMime ? `<meta property="og:image:type" content="${imageMime}" />` : "",
    imageIsDefault ? `<meta property="og:image:width" content="${DEFAULT_OG_WIDTH}" />` : "",
    imageIsDefault ? `<meta property="og:image:height" content="${DEFAULT_OG_HEIGHT}" />` : "",
    `<meta property="og:image:alt" content="${escapeAttr(meta.title || BASE_TITLE)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(fullTitle)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(image)}" />`,
  ];

  // Article-specific OpenGraph + JSON-LD structured data.
  if (meta.type === "article" && meta.post) {
    const post = meta.post;
    if (post.publishedAt) {
      tags.push(`<meta property="article:published_time" content="${escapeAttr(post.publishedAt)}" />`);
    }
    if (post.updatedAt) {
      tags.push(`<meta property="article:modified_time" content="${escapeAttr(post.updatedAt)}" />`);
    }
    for (const tag of post.tags ?? []) {
      tags.push(`<meta property="article:tag" content="${escapeAttr(tag)}" />`);
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description,
      author: { "@type": "Person", name: BASE_TITLE, url: origin || undefined },
      publisher: {
        "@type": "Person",
        name: BASE_TITLE,
        url: origin || undefined,
      },
      datePublished: post.publishedAt || post.date || undefined,
      dateModified: post.updatedAt || post.publishedAt || post.date || undefined,
      mainEntityOfPage: canonical ? { "@type": "WebPage", "@id": canonical } : undefined,
      image: image || undefined,
      keywords: (post.tags ?? []).join(", ") || undefined,
    };
    tags.push(
      `<script type="application/ld+json">${jsonLdSafe(jsonLd)}</script>`,
    );
  }

  return tags.filter(Boolean).join("\n    ");
};
