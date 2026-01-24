import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WORKSPACE = process.cwd();
const ASSETS_DIR = path.join(WORKSPACE, "src", "assets");

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg"]);

const formatBytes = (bytes) => {
  const units = ["B", "KB", "MB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
};

const optimizeOne = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const stat = await fs.stat(filePath);
  const before = stat.size;

  const input = await fs.readFile(filePath);

  // Sharp: keep it conservative to avoid artifacts on logos.
  // Only replace if the new output is smaller.
  let pipeline = sharp(input, { failOn: "none" });

  if (ext === ".png") {
    // Lossless-ish compression settings
    pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  } else if (ext === ".jpg" || ext === ".jpeg") {
    // MozJPEG gives good results; keep quality reasonably high for logos.
    pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
  } else {
    return { changed: false, before, after: before };
  }

  const output = await pipeline.toBuffer();
  const after = output.length;

  if (after < before) {
    await fs.writeFile(filePath, output);
    return { changed: true, before, after };
  }

  return { changed: false, before, after: before };
};

const main = async () => {
  let entries;
  try {
    entries = await fs.readdir(ASSETS_DIR);
  } catch {
    console.error(`Assets folder not found: ${ASSETS_DIR}`);
    process.exit(1);
  }

  const files = entries
    .map((name) => path.join(ASSETS_DIR, name))
    .filter((p) => IMAGE_EXTS.has(path.extname(p).toLowerCase()));

  if (files.length === 0) {
    console.log("No PNG/JPG assets found to optimize.");
    return;
  }

  console.log(`Optimizing ${files.length} asset images in ${path.relative(WORKSPACE, ASSETS_DIR)}...`);

  let totalBefore = 0;
  let totalAfter = 0;
  let changedCount = 0;

  for (const file of files) {
    const rel = path.relative(WORKSPACE, file);
    const result = await optimizeOne(file);
    totalBefore += result.before;
    totalAfter += result.after;

    if (result.changed) {
      changedCount++;
      const saved = result.before - result.after;
      console.log(`- ${rel}: ${formatBytes(result.before)} → ${formatBytes(result.after)} (saved ${formatBytes(saved)})`);
    } else {
      console.log(`- ${rel}: kept (${formatBytes(result.before)})`);
    }
  }

  const savedTotal = totalBefore - totalAfter;
  console.log("\nSummary:");
  console.log(`- Changed: ${changedCount}/${files.length}`);
  console.log(`- Total: ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)} (saved ${formatBytes(savedTotal)})`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
