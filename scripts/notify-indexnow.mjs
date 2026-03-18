import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

const WORKSPACE = process.cwd();
const BLOGS_PATH = path.join(WORKSPACE, "src", "data", "blogs.json");
const PROJECTS_PATH = path.join(WORKSPACE, "src", "data", "projects.json");
const ENV_FILES = [".env", ".env.local", ".env.production", ".env.production.local"];

const STATIC_ROUTES = ["/", "/about", "/skills", "/certs", "/work", "/projects", "/blog", "/contact"];

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
    const url = new URL(noTrailing);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
};

const resolveSiteUrl = (fileEnv) => {
  const explicit = normalizeBaseUrl(
    process.env.VITE_SITE_URL ||
      process.env.SITE_URL ||
      process.env.PUBLIC_SITE_URL ||
      fileEnv.VITE_SITE_URL ||
      fileEnv.SITE_URL ||
      fileEnv.PUBLIC_SITE_URL,
  );
  if (explicit) return explicit;

  if (process.env.VERCEL_URL) {
    const vercel = normalizeBaseUrl(`https://${process.env.VERCEL_URL}`);
    if (vercel) return vercel;
  }

  const netlify = normalizeBaseUrl(process.env.URL || process.env.DEPLOY_PRIME_URL);
  if (netlify) return netlify;

  const cloudflare = normalizeBaseUrl(process.env.CF_PAGES_URL);
  if (cloudflare) return cloudflare;

  return null;
};

const readIndexNowKey = (fileEnv) => {
  const key = process.env.INDEXNOW_KEY || process.env.VITE_INDEXNOW_KEY || fileEnv.INDEXNOW_KEY || fileEnv.VITE_INDEXNOW_KEY;
  if (!key) return null;
  const trimmed = key.trim();
  if (!trimmed) return null;
  return trimmed;
};

const readJsonArray = async (filePath) => {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getBlogRoutes = async () => {
  const blogs = await readJsonArray(BLOGS_PATH);
  return blogs
    .filter((item) => item && typeof item.slug === "string" && item.slug.length > 0 && item.view !== false)
    .map((item) => `/blog/${item.slug}`);
};

const getProjectRoutes = async () => {
  const projects = await readJsonArray(PROJECTS_PATH);

  return projects
    .filter((item) => item && item.view !== false)
    .map((item) => {
      if (typeof item.path === "string" && item.path.startsWith("/")) return item.path;
      if (typeof item.urlPath === "string" && item.urlPath.startsWith("/")) return item.urlPath;
      if (typeof item.slug === "string" && item.slug.length > 0) return `/projects/${item.slug}`;
      return null;
    })
    .filter(Boolean);
};

const toAbsoluteUrl = (siteUrl, routePath) => {
  if (routePath === "/") return `${siteUrl}/`;
  return `${siteUrl}${routePath.startsWith("/") ? routePath : `/${routePath}`}`;
};

const getChangedFiles = () => {
  const explicit = process.env.INDEXNOW_CHANGED_FILES;
  if (explicit && explicit.trim().length > 0) {
    return explicit
      .split(/[\n,]+/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  try {
    const output = execSync("git diff --name-only HEAD~1 HEAD", {
      cwd: WORKSPACE,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });

    return output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
};

const isProjectChange = (filePath) => {
  return (
    filePath === "src/data/projects.json" ||
    filePath.startsWith("src/pages/projects/") ||
    filePath.startsWith("src/components/Projects")
  );
};

const isBlogChange = (filePath) => {
  return (
    filePath === "src/data/blogs.json" ||
    filePath.startsWith("src/pages/blog/") ||
    filePath.startsWith("src/components/Blog")
  );
};

const buildImpactedRoutes = async (changedFiles) => {
  const routes = new Set();

  const blogRoutes = await getBlogRoutes();
  const projectRoutes = await getProjectRoutes();
  const allRoutes = Array.from(new Set([...STATIC_ROUTES, ...blogRoutes, ...projectRoutes]));

  if (changedFiles.length === 0) {
    allRoutes.forEach((route) => routes.add(route));
    return Array.from(routes);
  }

  let broadChange = false;

  for (const filePath of changedFiles) {
    if (filePath.startsWith("src/pages/") || filePath === "src/components/Seo.tsx" || filePath === "index.html") {
      broadChange = true;
    }

    if (isProjectChange(filePath)) {
      routes.add("/projects");
      projectRoutes.forEach((route) => routes.add(route));
    }

    if (isBlogChange(filePath)) {
      routes.add("/blog");
      blogRoutes.forEach((route) => routes.add(route));
    }

    if (filePath === "public/robots.txt" || filePath === "public/sitemap.xml") {
      routes.add("/");
    }
  }

  if (broadChange || routes.size === 0) {
    allRoutes.forEach((route) => routes.add(route));
  }

  return Array.from(routes);
};

const shouldAutoNotify = (fileEnv) => {
  const value = (process.env.INDEXNOW_AUTO_NOTIFY || fileEnv.INDEXNOW_AUTO_NOTIFY || "").trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
};

const main = async () => {
  const fileEnv = await loadLocalEnv();

  if (!shouldAutoNotify(fileEnv)) {
    console.log("[indexnow] Skipping notification. Set INDEXNOW_AUTO_NOTIFY=true to enable.");
    return;
  }

  const siteUrl = resolveSiteUrl(fileEnv);
  if (!siteUrl) {
    console.warn("[indexnow] Site URL not resolved. Set VITE_SITE_URL (or SITE_URL). Skipping.");
    return;
  }

  const key = readIndexNowKey(fileEnv);
  if (!key) {
    console.warn("[indexnow] INDEXNOW_KEY is not set. Skipping notification.");
    return;
  }

  const changedFiles = getChangedFiles();
  const impactedRoutes = await buildImpactedRoutes(changedFiles);
  const urlList = impactedRoutes.map((route) => toAbsoluteUrl(siteUrl, route));

  if (urlList.length === 0) {
    console.log("[indexnow] No URLs to notify.");
    return;
  }

  const host = new URL(siteUrl).host;
  const keyLocation = `${siteUrl}/${key}.txt`;

  const payload = {
    host,
    key,
    keyLocation,
    urlList,
  };

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`[indexnow] Request failed (${response.status}): ${body}`);
  }

  console.log(`[indexnow] Notified ${urlList.length} URL(s).`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
