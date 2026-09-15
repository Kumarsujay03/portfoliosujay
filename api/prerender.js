/**
 * Crawler prerender for blog routes. SERVER-SIDE ONLY.
 *
 * Vercel rewrites bot/crawler requests for /writing and /writing/:slug to this
 * function (see vercel.json). It returns the built index.html with real,
 * post-specific <head> tags, JSON-LD, and a server-rendered copy of the post
 * text injected into <div id="root">. Human visitors are NOT rewritten here —
 * they get the static index.html and the normal client SPA.
 *
 * Why inject visible body text: social scrapers and non-JS crawlers read raw
 * HTML. Putting the real title, meta, and body in the response is what makes
 * shared links show correct previews and lets the content be indexed reliably.
 *
 * The React app still hydrates/renders over #root for any crawler that does run
 * JS, so there is no visual difference for real users.
 */

import fs from "node:fs";
import path from "node:path";
import {
  isWarehouseConfigured,
  getWarehouseBlogPosts,
} from "./_lib/warehouse.js";
import {
  buildHeadTags,
  escapeHtml,
  absoluteUrl,
} from "./_lib/seo.js";

let cachedTemplate = null;

/**
 * Load the built index.html shell once per cold start.
 *
 * Primary source: api/_lib/index-template.js, generated after `vite build` by
 * scripts/emit-prerender-template.mjs. It's a static import target so Vercel's
 * bundler reliably ships it with the function (a dynamic fs read of dist/ would
 * be dropped by static analysis).
 *
 * Fallback: read from the filesystem (covers `vercel dev` before a build, or
 * unusual output layouts).
 */
const readTemplate = async () => {
  if (cachedTemplate) return cachedTemplate;

  try {
    const mod = await import("./_lib/index-template.js");
    if (mod?.INDEX_TEMPLATE) {
      cachedTemplate = mod.INDEX_TEMPLATE;
      return cachedTemplate;
    }
  } catch {
    /* not generated yet — fall back to fs */
  }

  const candidates = [
    path.join(process.cwd(), "dist", "index.html"),
    path.join(process.cwd(), "index.html"),
    path.join(process.cwd(), "public", "index.html"),
  ];
  for (const file of candidates) {
    try {
      cachedTemplate = fs.readFileSync(file, "utf8");
      return cachedTemplate;
    } catch {
      /* try next */
    }
  }
  return null;
};

/**
 * Remove the default SEO tags from the template <head> so our post-specific
 * ones win. We strip title, description, canonical, and og/twitter meta.
 */
const stripDefaultHead = (html) =>
  html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/i, "")
    .replace(/<meta\s+name="robots"[^>]*>/i, "")
    .replace(/<link\s+rel="canonical"[^>]*>/i, "")
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, "");

/** Render the post body (plain text with \n) as escaped, paragraph HTML. */
const renderBodyHtml = (text) => {
  const normalized = String(text ?? "").replace(/\r\n/g, "\n");
  // Blank line separates paragraphs; single \n is a line break within one.
  const paragraphs = normalized.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return paragraphs
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br />")}</p>`)
    .join("\n      ");
};

/** Build the visible server-rendered article markup for crawlers. */
const renderArticleHtml = (post) => {
  const heading = `<h1>${escapeHtml(post.title)}</h1>`;
  const meta = [
    post.date ? `<time datetime="${escapeHtml(post.publishedAt || post.date)}">${escapeHtml(post.date)}</time>` : "",
    post.readTime ? `<span>${escapeHtml(post.readTime)} read</span>` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const hook = post.hook ? `<p><strong>${escapeHtml(post.hook).replace(/\n/g, "<br />")}</strong></p>` : "";
  const tags = (post.tags ?? []).length
    ? `<p>${post.tags.map((t) => `#${escapeHtml(t)}`).join(" ")}</p>`
    : "";
  const image = post.image
    ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" width="1200" height="630" />`
    : "";

  return [
    `<article>`,
    `  ${heading}`,
    meta ? `  <p>${meta}</p>` : "",
    image,
    hook,
    `  ${renderBodyHtml(post.body)}`,
    tags,
    `</article>`,
  ]
    .filter(Boolean)
    .join("\n      ");
};

/** Build the blog index markup (list of post links) for crawlers. */
const renderIndexHtml = (posts) => {
  const items = posts
    .map((post) => {
      const href = absoluteUrl(`/writing/${post.slug}`);
      const summary = post.summary ? `<p>${escapeHtml(post.summary)}</p>` : "";
      return [
        `  <article>`,
        `    <h2><a href="${escapeHtml(href)}">${escapeHtml(post.title)}</a></h2>`,
        post.date ? `    <time>${escapeHtml(post.date)}</time>` : "",
        summary,
        `  </article>`,
      ]
        .filter(Boolean)
        .join("\n      ");
    })
    .join("\n      ");

  return [
    `<section>`,
    `  <h1>Writing</h1>`,
    `  <p>Notes on ML, research, and building.</p>`,
    items,
    `</section>`,
  ].join("\n      ");
};

/** Inject head tags and body markup into the template. */
const compose = (template, headTags, bodyHtml) => {
  let html = stripDefaultHead(template);
  html = html.replace(/<\/head>/i, `    ${headTags}\n  </head>`);
  // Seed #root so raw-HTML crawlers see content; React re-renders over it.
  html = html.replace(
    /<div id="root">\s*<\/div>/i,
    `<div id="root"><main data-prerendered="true">\n      ${bodyHtml}\n    </main></div>`,
  );
  return html;
};

const slugFromReq = (req) => {
  // Vercel passes the matched path; support ?slug= and path parsing.
  if (req.query && typeof req.query.slug === "string" && req.query.slug) {
    return req.query.slug;
  }
  const url = req.url || "";
  const match = /\/(?:writing|blog)\/([^/?#]+)/.exec(url);
  return match ? decodeURIComponent(match[1]) : null;
};

export default async function handler(req, res) {
  const template = await readTemplate();
  if (!template) {
    // Can't prerender without the built shell; let the request fail soft.
    return res.status(500).send("Prerender template unavailable");
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  // Let CDNs cache prerendered HTML briefly; posts update on next fetch.
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=600");

  // No Warehouse config -> return the plain shell so the SPA still works.
  if (!isWarehouseConfigured()) {
    return res.status(200).send(template);
  }

  let posts = [];
  try {
    posts = await getWarehouseBlogPosts();
  } catch (error) {
    console.error("Prerender: Warehouse fetch failed:", error);
    return res.status(200).send(template); // graceful: serve SPA shell
  }

  const slug = slugFromReq(req);

  // Single post
  if (slug) {
    const post = posts.find((p) => p.slug === slug);
    if (!post) {
      const headTags = buildHeadTags({
        title: "Writing",
        description: "Post not found.",
        canonicalPath: "/writing",
        type: "website",
      });
      const html = compose(template, headTags, `<section><h1>Post not found</h1></section>`);
      return res.status(404).send(html);
    }

    const headTags = buildHeadTags({
      title: post.title,
      description: post.summary || post.title,
      canonicalPath: `/writing/${post.slug}`,
      image: post.image || "/og-image.png",
      type: "article",
      post,
    });
    const html = compose(template, headTags, renderArticleHtml(post));
    return res.status(200).send(html);
  }

  // Blog index
  const headTags = buildHeadTags({
    title: "Writing",
    description: "Notes on ML, research, and building — papers, ideas, and lessons from turning research into working systems.",
    canonicalPath: "/writing",
    type: "website",
  });
  const html = compose(template, headTags, renderIndexHtml(posts));
  return res.status(200).send(html);
}
