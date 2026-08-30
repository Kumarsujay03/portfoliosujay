import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type LenisLike = {
  scrollTo: (target: number, options?: { immediate?: boolean; force?: boolean }) => void;
  resize?: () => void;
};

const RouteScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Lenis drives window scroll from its own loop, so a bare window.scrollTo
    // gets overwritten on the next frame. Drive Lenis directly when present.
    const reset = () => {
      const lenis = (window as Window & { __lenis?: LenisLike }).__lenis;

      if (lenis?.scrollTo) {
        lenis.resize?.();
        lenis.scrollTo(0, { immediate: true, force: true });
        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    const frame = requestAnimationFrame(() => {
      reset();
      requestAnimationFrame(reset);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
};

export default RouteScrollToTop;
