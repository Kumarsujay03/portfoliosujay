import fs from "node:fs/promises";
import path from "node:path";

const WORKSPACE = process.cwd();
const PUBLIC_DIR = path.join(WORKSPACE, "public");

const getSiteUrl = () => {
  const raw = process.env.VITE_SITE_URL || process.env.SITE_URL;
  if (!raw) return null;
  return raw.replace(/\/$/, "");
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

const isoDate = () => new Date().toISOString().slice(0, 10);

const main = async () => {
  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  const siteUrl = getSiteUrl();
  const lastMod = isoDate();

  const urlEntries = routes
    .map((routePath) => {
      const loc = siteUrl ? `${siteUrl}${routePath}` : routePath;
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
  if (!robots.includes("Sitemap:")) {
    robots = robots.trimEnd() + "\n\n" + sitemapLine + "\n";
    await fs.writeFile(robotsPath, robots, "utf8");
  }

  console.log("Generated public/sitemap.xml" + (siteUrl ? ` for ${siteUrl}` : ""));
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
