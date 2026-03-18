import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WORKSPACE = process.cwd();
const PUBLIC_DIR = path.join(WORKSPACE, "public");
const SOURCE_SVG = path.join(PUBLIC_DIR, "og-image.svg");
const TARGET_PNG = path.join(PUBLIC_DIR, "og-image.png");

const main = async () => {
  try {
    await fs.access(SOURCE_SVG);
  } catch {
    console.warn("[og-image] Skipping PNG generation because public/og-image.svg was not found.");
    return;
  }

  await sharp(SOURCE_SVG)
    .resize(1200, 630, { fit: "cover" })
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(TARGET_PNG);

  console.log("[og-image] Generated public/og-image.png (1200x630)");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
