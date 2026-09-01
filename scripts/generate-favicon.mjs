import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WORKSPACE = process.cwd();
const PUBLIC_DIR = path.join(WORKSPACE, "public");
const SOURCE_SVG = path.join(PUBLIC_DIR, "favicon.svg");

const TARGETS = [
  { file: "favicon-96x96.png", size: 96 },
  { file: "apple-touch-icon.png", size: 180 },
];

const main = async () => {
  try {
    await fs.access(SOURCE_SVG);
  } catch {
    console.warn("[favicon] Skipping generation because public/favicon.svg was not found.");
    return;
  }

  for (const { file, size } of TARGETS) {
    await sharp(SOURCE_SVG)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toFile(path.join(PUBLIC_DIR, file));
    console.log(`[favicon] Generated public/${file} (${size}x${size})`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
