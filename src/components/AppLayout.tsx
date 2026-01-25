import Header from "@/components/Header";
import RouteScrollToTop from "@/components/RouteScrollToTop";
import { Outlet } from "react-router-dom";
import { Suspense, useEffect } from "react";
import CustomCursor from "@/components/CustomCursor";
import { prefetchRoute } from "@/lib/routePrefetch";

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-6">
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-dot bg-destructive" />
        <div className="terminal-dot bg-accent" />
        <div className="terminal-dot bg-code-green" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">loading.ts</span>
      </div>
      <div className="p-6">
        <p className="font-mono text-sm text-muted-foreground">loading()</p>
      </div>
    </div>
  </div>
);

const AppLayout = () => {
  useEffect(() => {
    const routesToPrefetch = [
      "/about",
      "/skills",
      "/work",
      "/projects",
      "/certs",
      "/contact",
      "/blog",
    ];

    const runPrefetch = () => {
      routesToPrefetch.forEach((path) => prefetchRoute(path));
    };

    const win = globalThis as typeof globalThis & {
      requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(runPrefetch, { timeout: 1200 });
      return () => win.cancelIdleCallback?.(id);
    }

    const timeout = setTimeout(runPrefetch, 800);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <CustomCursor />
      <RouteScrollToTop />
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default AppLayout;
