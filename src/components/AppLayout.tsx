import Header from "@/components/Header";
import RouteScrollToTop from "@/components/RouteScrollToTop";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";

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
  return (
    <>
      <RouteScrollToTop />
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default AppLayout;
