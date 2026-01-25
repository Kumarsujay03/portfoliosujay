import fs from "node:fs/promises";
import path from "node:path";

const WORKSPACE = process.cwd();
const PUBLIC_DIR = path.join(WORKSPACE, "public");
const BLOGS_PATH = path.join(WORKSPACE, "src", "data", "blogs.json");

const normalizeBaseUrl = (raw) => {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const noTrailing = trimmed.replace(/\/+$/, "");

  try {
    const asUrl = new URL(noTrailing);
    if (asUrl.protocol !== "http:" && asUrl.protocol !== "https:") return null;
    return asUrl.origin;
  } catch {
    return null;
  }
};

const resolveSiteUrl = () => {
  // Preferred explicit config (works locally + in CI)
  const explicit = normalizeBaseUrl(
    process.env.VITE_SITE_URL || process.env.SITE_URL || process.env.PUBLIC_SITE_URL,
  );
  if (explicit) return explicit;

  // Vercel provides a hostname without protocol (e.g. "my-app.vercel.app")
  if (process.env.VERCEL_URL) {
    const vercel = normalizeBaseUrl(`https://${process.env.VERCEL_URL}`);
    if (vercel) return vercel;
  }

  // Netlify provides full URLs
  const netlify = normalizeBaseUrl(process.env.URL || process.env.DEPLOY_PRIME_URL);
  if (netlify) return netlify;

  // Cloudflare Pages provides a full URL in newer setups
  const cf = normalizeBaseUrl(process.env.CF_PAGES_URL);
  if (cf) return cf;

  return null;
};

const joinUrl = (base, routePath) => {
  const cleanBase = base.replace(/\/+$/, "");
  const cleanPath = routePath.startsWith("/") ? routePath : `/${routePath}`;
  return `${cleanBase}${cleanPath}`;
};

const routes = [
  "/",
  "/about",
  "/skills",
  "/certs",
  "/work",
  "/projects",
  "/blog",
  "/contact",
];

const readBlogRoutes = async () => {
  try {
    const raw = await fs.readFile(BLOGS_PATH, "utf8");
    const blogs = JSON.parse(raw);
    if (!Array.isArray(blogs)) return [];

    return blogs
      .filter((b) => b && typeof b.slug === "string" && b.slug.length > 0 && b.view !== false)
      .map((b) => `/blog/${b.slug}`);
  } catch {
    return [];
  }
};

const isoDate = () => new Date().toISOString().slice(0, 10);

const main = async () => {
  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  const siteUrl = resolveSiteUrl();
  const lastMod = isoDate();

  const blogRoutes = await readBlogRoutes();
  const allRoutes = Array.from(new Set([...routes, ...blogRoutes]));

  const urlEntries = allRoutes
    .map((routePath) => {
      const loc = siteUrl ? joinUrl(siteUrl, routePath) : routePath;
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastMod}</lastmod>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    "</urlset>",
    "",
  ].join("\n");

  await fs.writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), sitemap, "utf8");

  // Keep existing robots.txt rules but append sitemap if missing.
  const robotsPath = path.join(PUBLIC_DIR, "robots.txt");
  let robots = "";
  try {
    robots = await fs.readFile(robotsPath, "utf8");
  } catch {
    robots = "User-agent: *\nAllow: /\n";
  }

  const sitemapLine = `Sitemap: ${siteUrl ? `${siteUrl}/sitemap.xml` : "/sitemap.xml"}`;
  const hasSitemap = robots.includes("Sitemap:");
  if (hasSitemap) {
    // Replace all existing sitemap lines to avoid stale domains.
    const updated = robots
      .split(/\r?\n/)
      .map((line) => (line.trimStart().startsWith("Sitemap:") ? sitemapLine : line))
      .join("\n")
      .trimEnd()
      .concat("\n");
    if (updated !== robots) {
      robots = updated;
      await fs.writeFile(robotsPath, robots, "utf8");
    }
  } else {
    robots = robots.trimEnd() + "\n\n" + sitemapLine + "\n";
    await fs.writeFile(robotsPath, robots, "utf8");
  }

  if (!siteUrl) {
    console.warn(
      "Generated public/sitemap.xml with relative URLs. Set VITE_SITE_URL (or SITE_URL) to generate absolute URLs for Google Search Console.",
    );
  } else {
    console.log(`Generated public/sitemap.xml for ${siteUrl}`);
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
