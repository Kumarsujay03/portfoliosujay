/**
 * Dynamic sitemap. SERVER-SIDE ONLY.
 *
 * Served at /sitemap.xml (see vercel.json rewrite). Lists the static routes
 * plus every published Warehouse post, so new posts are discoverable without a
 * rebuild. Post <lastmod> comes from updated_at/publish_date.
 *
 * If Warehouse isn't configured (or the fetch fails), it still returns the
 * static routes so the sitemap is never empty.
 */

import { isWarehouseConfigured, getWarehouseBlogPosts } from "./_lib/warehouse.js";
import { absoluteUrl, escapeHtml, resolveSiteUrl } from "./_lib/seo.js";

const STATIC_ROUTES = ["/", "/about", "/skills", "/certs", "/work", "/projects", "/blog", "/contact"];

const todayIso = () => new Date().toISOString().slice(0, 10);

const urlEntry = (loc, lastmod) =>
  ["  <url>", `    <loc>${escapeHtml(loc)}</loc>`, `    <lastmod>${escapeHtml(lastmod)}</lastmod>`, "  </url>"].join(
    "\n",
  );

export default async function handler(_req, res) {
  const today = todayIso();
  const entries = STATIC_ROUTES.map((route) => urlEntry(absoluteUrl(route), today));

  if (isWarehouseConfigured()) {
    try {
      const posts = await getWarehouseBlogPosts();
      for (const post of posts) {
        const lastmod = (post.updatedAt || post.publishedAt || "").slice(0, 10) || post.date || today;
        entries.push(urlEntry(absoluteUrl(`/blog/${post.slug}`), lastmod));
      }
    } catch (error) {
      console.error("Sitemap: Warehouse fetch failed, serving static routes only:", error);
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries.join("\n"),
    "</urlset>",
    "",
  ].join("\n");

  // Warn (in logs) if we couldn't resolve an absolute origin.
  if (!resolveSiteUrl()) {
    console.warn("Sitemap: no site origin resolved; emitting relative URLs. Set VITE_SITE_URL/SITE_URL.");
  }

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).send(xml);
}
