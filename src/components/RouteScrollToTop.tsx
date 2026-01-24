import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ensure each route starts at the top.
    // Use rAF so it runs after React commits the new screen.
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [pathname]);

  return null;
};

export default RouteScrollToTop;
