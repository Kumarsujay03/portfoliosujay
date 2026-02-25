import { useEffect, useState } from "react";
import { registerVisit } from "@/lib/siteMetrics";

const formatCount = (value: number | null) => {
  if (value === null) {
    return "--";
  }

  return value.toLocaleString("en-IN");
};

const SiteStats = () => {
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCounts = async () => {
      const visits = await registerVisit();

      if (!isMounted) {
        return;
      }

      setVisitCount(visits);
    };

    void loadCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <p className="font-mono text-xs text-muted-foreground/50">
      Visits: <span className="text-foreground/80">{formatCount(visitCount)}</span>
    </p>
  );
};

export default SiteStats;
