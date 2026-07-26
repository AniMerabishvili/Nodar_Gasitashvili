const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "src", "data");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const PDF_EXT = new Set([".pdf"]);
const AUDIO_EXT = new Set([".mp3", ".wav", ".m4a", ".ogg", ".flac"]);
const VIDEO_EXT = new Set([".mp4", ".mpg", ".mpeg", ".mov", ".avi", ".webm"]);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function titleFromFilename(filename) {
  const base = path.parse(filename).name;
  return base
    .replace(/^(\d+)[-_.\s]+/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+და\s+/g, " & ")
    .replace(/\s+and\s+/gi, " & ")
    .replace(/\s+/g, " ")
    .trim();
}

function sortKey(filename) {
  const match = filename.match(/^(\d+)/);
  if (match) {
    return [0, parseInt(match[1], 10), filename.toLowerCase()];
  }
  return [1, 0, filename.toLowerCase()];
}

function compareFiles(a, b) {
  const ka = sortKey(a);
  const kb = sortKey(b);
  for (let i = 0; i < ka.length; i++) {
    if (ka[i] < kb[i]) return -1;
    if (ka[i] > kb[i]) return 1;
  }
  return 0;
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((name) => {
      const full = path.join(dir, name);
      return fs.statSync(full).isFile() && !name.startsWith(".");
    })
    .sort(compareFiles);
}

function writeManifest(name, entries) {
  ensureDir(DATA_DIR);
  const outPath = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(outPath, JSON.stringify(entries, null, 2) + "\n", "utf8");
  console.log(`✓ ${name}.json (${entries.length} items)`);
}

/** Encode only unsafe URL characters; preserve readable Unicode where possible. */
function publicSrc(folder, filename) {
  const encoded = filename
    .split(/[/\\]/)
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `/${folder}/${encoded}`;
}

function generateDocuments() {
  const dir = path.join(ROOT, "public", "documents");
  const files = listFiles(dir);
  const entries = files
    .map((filename) => {
      const ext = path.extname(filename).toLowerCase();
      let type = null;
      if (IMAGE_EXT.has(ext)) type = "image";
      else if (PDF_EXT.has(ext)) type = "pdf";
      if (!type) return null;
      return {
        filename,
        src: publicSrc("documents", filename),
        title: titleFromFilename(filename),
        type,
      };
    })
    .filter(Boolean);
  writeManifest("documents", entries);
}

function generateMusic() {
  const dir = path.join(ROOT, "public", "music");
  const files = listFiles(dir);
  // Note: .mpg/.mpeg often need transcoding to .mp4 (H.264) for reliable in-browser playback.
  const entries = files
    .map((filename) => {
      const ext = path.extname(filename).toLowerCase();
      let type = null;
      if (AUDIO_EXT.has(ext)) type = "audio";
      else if (VIDEO_EXT.has(ext)) type = "video";
      if (!type) return null;
      return {
        filename,
        src: publicSrc("music", filename),
        title: titleFromFilename(filename),
        type,
        format: ext.slice(1),
      };
    })
    .filter(Boolean);
  writeManifest("music", entries);
}

function generateGallery() {
  const dir = path.join(ROOT, "public", "gallery");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    writeManifest("gallery", []);
    return;
  }

  const metaPath = path.join(dir, "meta.json");
  const meta = fs.existsSync(metaPath)
    ? JSON.parse(fs.readFileSync(metaPath, "utf8"))
    : { groups: {}, images: {} };

  function isImageFile(name) {
    return IMAGE_EXT.has(path.extname(name).toLowerCase());
  }

  function folderTitle(name, rel) {
    const fromMeta = meta.groups?.[rel]?.title;
    if (fromMeta) return fromMeta;
    return (
      name
        .replace(/^(\d+)[.\s_-]+/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim() || name
    );
  }

  function imageTitle(filename, rel) {
    const fromMeta = meta.images?.[rel]?.title;
    if (fromMeta) return fromMeta;
    return titleFromFilename(filename);
  }

  function collectImages(absDir, relDir) {
    const entries = fs.readdirSync(absDir, { withFileTypes: true });
    const images = [];

    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "meta.json") continue;
      const abs = path.join(absDir, entry.name);
      const rel = (relDir ? `${relDir}/${entry.name}` : entry.name).replace(
        /\\/g,
        "/"
      );

      if (entry.isDirectory()) {
        images.push(...collectImages(abs, rel));
      } else if (entry.isFile() && isImageFile(entry.name)) {
        images.push({
          filename: entry.name,
          relativePath: rel,
          src: publicSrc("gallery", rel),
          title: imageTitle(entry.name, rel),
          type: "image",
        });
      }
    }

    return images.sort((a, b) => compareFiles(a.filename, b.filename));
  }

  const topLevel = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(
      (e) =>
        e.isDirectory() &&
        !e.name.startsWith(".") &&
        e.name !== "meta.json"
    )
    .sort((a, b) => compareFiles(a.name, b.name));

  const groups = [];

  for (const top of topLevel) {
    const topAbs = path.join(dir, top.name);
    const topRel = top.name;
    const children = fs.readdirSync(topAbs, { withFileTypes: true });
    const subdirs = children
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .sort((a, b) => compareFiles(a.name, b.name));
    const directImages = children
      .filter((e) => e.isFile() && isImageFile(e.name))
      .sort((a, b) => compareFiles(a.name, b.name))
      .map((e) => {
        const rel = `${topRel}/${e.name}`.replace(/\\/g, "/");
        return {
          filename: e.name,
          relativePath: rel,
          src: publicSrc("gallery", rel),
          title: imageTitle(e.name, rel),
          type: "image",
        };
      });

    const subgroups = [];

    if (directImages.length > 0) {
      subgroups.push({
        title: null,
        images: directImages,
      });
    }

    for (const sub of subdirs) {
      const subRel = `${topRel}/${sub.name}`.replace(/\\/g, "/");
      const images = collectImages(path.join(topAbs, sub.name), subRel);
      if (images.length === 0) continue;
      subgroups.push({
        title: folderTitle(sub.name, subRel),
        images,
      });
    }

    if (subgroups.length === 0) continue;

    const groupMeta = meta.groups?.[topRel];
    groups.push({
      id: top.name.replace(/\s+/g, "-").toLowerCase(),
      title: folderTitle(top.name, topRel),
      order: groupMeta?.order ?? (() => {
        const m = top.name.match(/^(\d+)/);
        return m ? parseInt(m[1], 10) : 999;
      })(),
      subgroups,
    });
  }

  writeManifest("gallery", groups);
}

console.log("Generating media manifests...");
generateDocuments();
generateMusic();
generateGallery();
console.log("Done.");
