const prefetched = new Set<string>();

type PrefetchFn = () => Promise<unknown>;

const routeMap: Record<string, PrefetchFn> = {
  "/": () => import("../pages/Index"),
  "/about": () => import("../pages/about/Index"),
  "/skills": () => import("../pages/skills/Index"),
  "/certs": () => import("../pages/certs/Index"),
  "/work": () => import("../pages/work/Index"),
  "/projects": () => import("../pages/projects/Index"),
  "/blog": () => import("../pages/BlogPage"),
  "/contact": () => import("../pages/contact/Index"),
};

const normalize = (path?: string) => {
  if (!path) return null;
  const clean = path.split("?")[0].split("#")[0];
  if (clean.startsWith("/blog/")) return "/blog/:slug";
  return clean;
};

export const prefetchRoute = (path?: string) => {
  const key = normalize(path);
  if (!key) return;
  if (prefetched.has(key)) return;
  prefetched.add(key);

  if (key === "/blog/:slug") {
    void import("../pages/blog/Post");
    return;
  }

  const fn = routeMap[key];
  if (fn) void fn();
};
