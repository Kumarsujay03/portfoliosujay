import fs from "node:fs/promises";
import path from "node:path";

const WORKSPACE = process.cwd();
const PUBLIC_DIR = path.join(WORKSPACE, "public");
const BLOGS_PATH = path.join(WORKSPACE, "src", "data", "blogs.json");
const ENV_FILES = [".env", ".env.local", ".env.production", ".env.production.local"];

const parseDotEnv = (raw) => {
  const entries = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!key) continue;
    entries[key] = value;
  }

  return entries;
};

const loadLocalEnv = async () => {
  const merged = {};

  for (const fileName of ENV_FILES) {
    try {
      const raw = await fs.readFile(path.join(WORKSPACE, fileName), "utf8");
      Object.assign(merged, parseDotEnv(raw));
    } catch {
      // Ignore missing env files.
    }
  }

  return merged;
};

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

const resolveSiteUrl = (fileEnv) => {
  // Preferred explicit config (works locally + in CI)
  const explicit = normalizeBaseUrl(
    process.env.VITE_SITE_URL ||
      process.env.SITE_URL ||
      process.env.PUBLIC_SITE_URL ||
      fileEnv.VITE_SITE_URL ||
      fileEnv.SITE_URL ||
      fileEnv.PUBLIC_SITE_URL,
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

  const fileEnv = await loadLocalEnv();
  const siteUrl = resolveSiteUrl(fileEnv);
  const lastMod = isoDate();

  // When Warehouse is configured, /sitemap.xml is served dynamically by the
  // serverless function (api/sitemap.xml.js) so new posts appear without a
  // rebuild. A static public/sitemap.xml would shadow that route (filesystem
  // takes precedence over rewrites on Vercel), so we remove it and let the
  // function own the URL. Robots.txt is still maintained below either way.
  const warehouseConfigured = Boolean(
    (process.env.WAREHOUSE_API_URL || fileEnv.WAREHOUSE_API_URL) &&
      (process.env.WAREHOUSE_API_KEY || fileEnv.WAREHOUSE_API_KEY),
  );

  const sitemapPath = path.join(PUBLIC_DIR, "sitemap.xml");

  if (warehouseConfigured) {
    try {
      await fs.rm(sitemapPath, { force: true });
    } catch {
      /* nothing to remove */
    }
    console.log("Warehouse configured — /sitemap.xml served dynamically; skipped static sitemap.");
  } else {
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

    await fs.writeFile(sitemapPath, sitemap, "utf8");
  }

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

  if (!warehouseConfigured) {
    if (!siteUrl) {
      console.warn(
        "Generated public/sitemap.xml with relative URLs. Set VITE_SITE_URL (or SITE_URL) to generate absolute URLs for Google Search Console.",
      );
    } else {
      console.log(`Generated public/sitemap.xml for ${siteUrl}`);
    }
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
