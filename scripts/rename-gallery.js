/**
 * Rename gallery folders/files to short ASCII names and save
 * Georgian display titles in public/gallery/meta.json.
 *
 * Usage: node scripts/rename-gallery.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const GALLERY = path.join(ROOT, "public", "gallery");
const META_PATH = path.join(GALLERY, "meta.json");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const VIDEO_EXT = new Set([".mp4", ".mpg", ".mpeg", ".mov", ".avi", ".webm"]);
const MEDIA_EXT = new Set([...IMAGE_EXT, ...VIDEO_EXT]);

function titleFromFilename(filename) {
  const base = path.parse(filename).name;
  return base
    .replace(/^(\d+)[-_.\s]+/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function folderTitle(name) {
  return (
    name
      .replace(/^(\d+)[.\s_-]+/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() || name
  );
}

function sortKey(filename) {
  const match = filename.match(/^(\d+)/);
  if (match) {
    return [0, parseInt(match[1], 10), filename.toLowerCase()];
  }
  return [1, 0, filename.toLowerCase()];
}

function compareNames(a, b) {
  const ka = sortKey(a);
  const kb = sortKey(b);
  for (let i = 0; i < ka.length; i++) {
    if (ka[i] < kb[i]) return -1;
    if (ka[i] > kb[i]) return 1;
  }
  return 0;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function tmpName(prefix) {
  return `__ren_${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Two-phase rename inside a directory to avoid collisions.
 * plans: [{ oldName, newName, title?, isDir }]
 */
function applyRenames(parentDir, plans) {
  const phase1 = [];
  for (const plan of plans) {
    if (plan.oldName === plan.newName) {
      phase1.push({ ...plan, tmp: null });
      continue;
    }
    const tmp = tmpName(plan.isDir ? "d" : "f");
    fs.renameSync(path.join(parentDir, plan.oldName), path.join(parentDir, tmp));
    phase1.push({ ...plan, tmp });
  }
  const results = [];
  for (const plan of phase1) {
    if (!plan.tmp) {
      results.push(plan);
      continue;
    }
    fs.renameSync(
      path.join(parentDir, plan.tmp),
      path.join(parentDir, plan.newName)
    );
    results.push({ ...plan, tmp: null });
  }
  return results;
}

function processDir(absDir, relDir, meta, depth) {
  const entries = fs
    .readdirSync(absDir, { withFileTypes: true })
    .filter((e) => !e.name.startsWith(".") && e.name !== "meta.json");

  const dirs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("__ren_"))
    .sort((a, b) => compareNames(a.name, b.name));
  const files = entries
    .filter(
      (e) =>
        e.isFile() && MEDIA_EXT.has(path.extname(e.name).toLowerCase())
    )
    .sort((a, b) => compareNames(a.name, b.name));

  // Recurse into subdirectories first (while names are still original)
  for (const dir of dirs) {
    const childRel = relDir ? `${relDir}/${dir.name}` : dir.name;
    processDir(path.join(absDir, dir.name), childRel, meta, depth + 1);
  }

  // Plan file renames
  const filePlans = files.map((file, idx) => {
    const ext = path.extname(file.name).toLowerCase();
    return {
      oldName: file.name,
      newName: `${pad(idx + 1)}${ext}`,
      title: titleFromFilename(file.name) || pad(idx + 1),
      isDir: false,
    };
  });

  // Plan directory renames
  const dirPlans = dirs.map((dir, idx) => {
    const orderMatch = dir.name.match(/^(\d+)/);
    return {
      oldName: dir.name,
      newName: pad(idx + 1),
      title: folderTitle(dir.name),
      order: orderMatch ? parseInt(orderMatch[1], 10) : idx + 1,
      isDir: true,
    };
  });

  // Apply file renames
  for (const plan of applyRenames(absDir, filePlans)) {
    const rel = (relDir ? `${relDir}/${plan.newName}` : plan.newName).replace(
      /\\/g,
      "/"
    );
    meta.images[rel] = { title: plan.title };
  }

  // Apply directory renames and rewrite meta keys from old → new segment
  for (const plan of applyRenames(absDir, dirPlans)) {
    const oldRel = (relDir ? `${relDir}/${plan.oldName}` : plan.oldName).replace(
      /\\/g,
      "/"
    );
    const newRel = (relDir ? `${relDir}/${plan.newName}` : plan.newName).replace(
      /\\/g,
      "/"
    );

    if (oldRel !== newRel) {
      for (const key of Object.keys(meta.images)) {
        if (key === oldRel || key.startsWith(oldRel + "/")) {
          meta.images[newRel + key.slice(oldRel.length)] = meta.images[key];
          delete meta.images[key];
        }
      }
      for (const key of Object.keys(meta.groups)) {
        if (key === oldRel || key.startsWith(oldRel + "/")) {
          meta.groups[newRel + key.slice(oldRel.length)] = meta.groups[key];
          delete meta.groups[key];
        }
      }
    }

    meta.groups[newRel] = {
      title: plan.title,
      ...(depth === 0 ? { order: plan.order } : {}),
    };
  }
}

if (!fs.existsSync(GALLERY)) {
  console.error("Gallery folder not found:", GALLERY);
  process.exit(1);
}

const meta = { groups: {}, images: {} };
console.log("Renaming gallery folders and files to short ASCII names...");
processDir(GALLERY, "", meta, 0);
fs.writeFileSync(META_PATH, JSON.stringify(meta, null, 2) + "\n", "utf8");
console.log(`✓ Wrote ${path.relative(ROOT, META_PATH)}`);
console.log(
  `  groups: ${Object.keys(meta.groups).length}, images: ${Object.keys(meta.images).length}`
);

// Verify max name length
let maxName = 0;
function check(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    maxName = Math.max(maxName, e.name.length);
    if (e.isDirectory()) check(path.join(dir, e.name));
  }
}
check(GALLERY);
console.log(`  max name length now: ${maxName}`);
console.log("Done. Next: node scripts/generate-manifests.js");
