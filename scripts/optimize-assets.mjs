import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WORKSPACE = process.cwd();
const ASSETS_DIR = path.join(WORKSPACE, "src", "assets");
const PROJECT_IMG_DIR = path.join(ASSETS_DIR, "project_img");

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg"]);
const MAX_PROJECT_WIDTH = 1600;

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

  let pipeline = sharp(input, { failOn: "none" });

  if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  } else if (ext === ".jpg" || ext === ".jpeg") {
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

const ensureProjectWebp = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (!IMAGE_EXTS.has(ext)) return { generated: false };

  const outputPath = filePath.replace(/\.(png|jpe?g)$/i, ".webp");
  if (outputPath === filePath) return { generated: false };

  const input = await fs.readFile(filePath);
  let pipeline = sharp(input, { failOn: "none" });

  try {
    const metadata = await pipeline.metadata();
    if (metadata.width && metadata.width > MAX_PROJECT_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_PROJECT_WIDTH, withoutEnlargement: true });
    }
  } catch {
  }

  const webpBuffer = await pipeline.webp({ quality: 80, effort: 5 }).toBuffer();

  let shouldWrite = true;
  try {
    const existing = await fs.stat(outputPath);
    if (existing.size <= webpBuffer.length) {
      shouldWrite = false;
    }
  } catch {
  }

  if (!shouldWrite) return { generated: false };
  await fs.writeFile(outputPath, webpBuffer);
  return { generated: true, bytes: webpBuffer.length };
};

const walkFiles = async (dir) => {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...await walkFiles(full));
    } else {
      out.push(full);
    }
  }
  return out;
};

const main = async () => {
  let entries;
  try {
    entries = await walkFiles(ASSETS_DIR);
  } catch {
    console.error(`Assets folder not found: ${ASSETS_DIR}`);
    process.exit(1);
  }

  const files = entries.filter((p) => IMAGE_EXTS.has(path.extname(p).toLowerCase()));

  if (files.length === 0) {
    console.log("No PNG/JPG assets found to optimize.");
    return;
  }

  console.log(`Optimizing ${files.length} asset images in ${path.relative(WORKSPACE, ASSETS_DIR)}...`);

  let totalBefore = 0;
  let totalAfter = 0;
  let changedCount = 0;
  let webpCount = 0;

  for (const file of files) {
    const rel = path.relative(WORKSPACE, file);
    const result = await optimizeOne(file);
    totalBefore += result.before;
    totalAfter += result.after;

    if (file.startsWith(PROJECT_IMG_DIR + path.sep)) {
      const webp = await ensureProjectWebp(file);
      if (webp.generated) {
        webpCount++;
        const relWebp = path.relative(WORKSPACE, file.replace(/\.(png|jpe?g)$/i, ".webp"));
        console.log(`  + ${relWebp}: generated WebP`);
      }
    }

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
  console.log(`- WebP generated: ${webpCount}`);
  console.log(`- Total: ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)} (saved ${formatBytes(savedTotal)})`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
