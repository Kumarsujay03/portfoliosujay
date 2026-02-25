import { useEffect, useState } from "react";
import { registerActiveSession, registerVisit, unregisterActiveSession } from "@/lib/siteMetrics";

const formatCount = (value: number | null) => {
  if (value === null) {
    return "--";
  }

  return value.toLocaleString("en-IN");
};

const SiteStats = () => {
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [activeCount, setActiveCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCounts = async () => {
      const [visits, active] = await Promise.all([registerVisit(), registerActiveSession()]);

      if (!isMounted) {
        return;
      }

      setVisitCount(visits);
      setActiveCount(active);
    };

    const handlePageHide = () => {
      void unregisterActiveSession();
    };

    void loadCounts();

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      isMounted = false;
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  return (
    <p className="font-mono text-xs text-muted-foreground/50">
      Visits: <span className="text-foreground/80">{formatCount(visitCount)}</span>
      <span className="mx-2 text-muted-foreground/30">|</span>
      Active now: <span className="text-foreground/80">{formatCount(activeCount)}</span>
    </p>
  );
};

export default SiteStats;
