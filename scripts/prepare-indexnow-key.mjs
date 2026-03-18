import fs from "node:fs/promises";
import path from "node:path";

const WORKSPACE = process.cwd();
const PUBLIC_DIR = path.join(WORKSPACE, "public");
const ENV_FILES = [".env", ".env.local", ".env.production", ".env.production.local"];

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

const readIndexNowKey = (fileEnv) => {
  const key = process.env.INDEXNOW_KEY || process.env.VITE_INDEXNOW_KEY || fileEnv.INDEXNOW_KEY || fileEnv.VITE_INDEXNOW_KEY;
  if (!key) return null;
  const trimmed = key.trim();
  if (!trimmed) return null;
  return trimmed;
};

const isLikelyValidKey = (value) => /^[a-zA-Z0-9-]{8,128}$/.test(value);

const main = async () => {
  const fileEnv = await loadLocalEnv();
  const key = readIndexNowKey(fileEnv);
  if (!key) {
    console.warn("[indexnow] INDEXNOW_KEY is not set. Skipping key file generation.");
    return;
  }

  if (!isLikelyValidKey(key)) {
    throw new Error("[indexnow] INDEXNOW_KEY format is invalid. Expected 8-128 chars: letters, numbers, hyphen.");
  }

  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  const keyFilePath = path.join(PUBLIC_DIR, `${key}.txt`);
  await fs.writeFile(keyFilePath, `${key}\n`, "utf8");

  console.log(`[indexnow] Generated key file: public/${key}.txt`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
