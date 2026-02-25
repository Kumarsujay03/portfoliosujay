const VISIT_SESSION_KEY = "portfolio-visit-registered";
const FALLBACK_VISITS_KEY = "portfolio-fallback-visits";

type MetricsResponse = {
  value?: number;
};

const requestCount = async (url: string, keepalive = false) => {
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    keepalive,
  });

  const data = (await response.json()) as MetricsResponse;

  if (!response.ok) {
    throw new Error(`Metrics request failed with ${response.status}`);
  }

  if (typeof data.value !== "number") {
    throw new Error("Invalid metrics response");
  }

  return data.value;
};

const fallbackVisitIncrement = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const current = Number(localStorage.getItem(FALLBACK_VISITS_KEY) || "0");
  const next = current + 1;
  localStorage.setItem(FALLBACK_VISITS_KEY, String(next));
  return next;
};

const fallbackVisitGet = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return Number(localStorage.getItem(FALLBACK_VISITS_KEY) || "0");
};

export const registerVisit = async () => {
  if (typeof window === "undefined") {
    return null;
  }

  const alreadyRegistered = sessionStorage.getItem(VISIT_SESSION_KEY) === "1";

  if (alreadyRegistered) {
    try {
      return await requestCount("/api/metrics/visit?op=get");
    } catch {
      return fallbackVisitGet();
    }
  }

  try {
    const value = await requestCount("/api/metrics/visit?op=up");
    sessionStorage.setItem(VISIT_SESSION_KEY, "1");
    return value;
  } catch {
    const value = fallbackVisitIncrement();
    sessionStorage.setItem(VISIT_SESSION_KEY, "1");
    return value;
  }
};
