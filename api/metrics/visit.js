const COUNTER_BASE_URL = "https://api.counterapi.dev/v2";
const VISIT_COUNTER_NAME = "total-visit";

const getCounterValue = (payload) => {
  const up = payload?.data?.up_count || 0;
  const down = payload?.data?.down_count || 0;
  return up - down;
};

const buildHeaders = () => {
  const token = process.env.COUNTERAPI_TOKEN;

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const requestCounter = async (workspace, action) => {
  const actionPart = action === "get" ? "" : `/${action}`;
  const url = `${COUNTER_BASE_URL}/${workspace}/${VISIT_COUNTER_NAME}${actionPart}`;
  const response = await fetch(url, {
    method: "GET",
    headers: buildHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || `Counter API failed with ${response.status}`);
  }

  return getCounterValue(data);
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const workspace = process.env.COUNTERAPI_WORKSPACE;

  if (!workspace) {
    return res.status(500).json({ error: "Missing COUNTERAPI_WORKSPACE" });
  }

  const requestedOp = req.query.op;
  const op = requestedOp === "get" ? "get" : "up";

  try {
    const value = await requestCounter(workspace, op);
    return res.status(200).json({ value });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : "Counter proxy failed" });
  }
}
