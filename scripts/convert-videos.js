/**
 * Convert raw .mpg/.mpeg videos to web-friendly .mp4 via ffmpeg.
 *
 * Usage:
 *   npm run convert:videos
 *
 * Drop source files in raw-videos/ (not public/music/).
 * Outputs go to public/music/ with the same basename and a .mp4 extension.
 * Requires ffmpeg on PATH. Run locally before deploy — not in CI/Cloudflare Pages.
 */

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC_DIR = path.join(ROOT, "raw-videos");
const OUT_DIR = path.join(ROOT, "public", "music");
const VIDEO_EXT = new Set([".mpg", ".mpeg"]);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/** Resolve ffmpeg executable without shell (avoids breaking paths that contain spaces). */
function resolveFfmpeg() {
  if (process.platform === "win32") {
    const where = spawnSync("where.exe", ["ffmpeg"], { encoding: "utf8" });
    if (where.status === 0) {
      const first = where.stdout
        .split(/\r?\n/)
        .map((line) => line.trim())
        .find(Boolean);
      if (first) return first;
    }
  }

  const probe = spawnSync("ffmpeg", ["-version"], { encoding: "utf8" });
  if (probe.status === 0) return "ffmpeg";
  return null;
}

function listSourceVideos() {
  if (!fs.existsSync(SRC_DIR)) {
    ensureDir(SRC_DIR);
    return [];
  }

  return fs
    .readdirSync(SRC_DIR)
    .filter((name) => {
      const full = path.join(SRC_DIR, name);
      const ext = path.extname(name).toLowerCase();
      return fs.statSync(full).isFile() && VIDEO_EXT.has(ext);
    })
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function convertOne(ffmpegBin, filename) {
  const inputPath = path.join(SRC_DIR, filename);
  const base = path.parse(filename).name;
  const outputName = `${base}.mp4`;
  const outputPath = path.join(OUT_DIR, outputName);

  if (!fs.existsSync(inputPath)) {
    console.error(`✗ missing source: ${filename}`);
    return "failed";
  }

  if (fs.existsSync(outputPath)) {
    console.log(`⏭  skipped (exists): ${outputName}`);
    return "skipped";
  }

  console.log(`→ converting: ${filename} → ${outputName}`);

  const args = [
    "-y",
    "-i",
    inputPath,
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "23",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    outputPath,
  ];

  // Never use shell:true here — Windows cmd splits unquoted paths on spaces
  // (e.g. "3 falando de amor.mpg" became "3.").
  const result = spawnSync(ffmpegBin, args, {
    stdio: "inherit",
    windowsHide: true,
  });

  if (result.error) {
    console.error(`✗ failed: ${filename}`);
    console.error(`  ${result.error.message}`);
    return "failed";
  }

  if (result.status !== 0) {
    console.error(`✗ failed: ${filename}`);
    if (fs.existsSync(outputPath)) {
      try {
        fs.unlinkSync(outputPath);
      } catch {
        // ignore cleanup errors
      }
    }
    return "failed";
  }

  console.log(`✓ done: ${outputName}`);
  return "done";
}

function main() {
  console.log("Video conversion (raw-videos → public/music)\n");

  const ffmpegBin = resolveFfmpeg();
  if (!ffmpegBin) {
    console.error(
      "ffmpeg was not found on PATH.\n" +
        "Install ffmpeg locally, then re-run: npm run convert:videos"
    );
    process.exit(1);
  }

  ensureDir(SRC_DIR);
  ensureDir(OUT_DIR);

  const files = listSourceVideos();
  if (files.length === 0) {
    console.log(`No .mpg/.mpeg files found in ${path.relative(ROOT, SRC_DIR)}/`);
    console.log("Drop source videos there, then run this script again.");
    return;
  }

  let done = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const status = convertOne(ffmpegBin, file);
    if (status === "done") done += 1;
    else if (status === "skipped") skipped += 1;
    else failed += 1;
  }

  console.log("\nSummary");
  console.log(`  converted: ${done}`);
  console.log(`  skipped:   ${skipped}`);
  console.log(`  failed:    ${failed}`);

  if (failed > 0) process.exit(1);
}

main();
