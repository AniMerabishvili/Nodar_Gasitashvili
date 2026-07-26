const fs = require("fs");
const path = require("path");
const WordExtractor = require("word-extractor");

const ROOT = path.join(__dirname, "..");
const BOOKS_DIR = path.join(ROOT, "public", "books");
const DATA_DIR = path.join(ROOT, "src", "data");
const BOOKS_DATA_DIR = path.join(DATA_DIR, "books");

const DOC_EXT = new Set([".doc", ".docx"]);

/** Mkhedruli → Latin (ASCII-safe slugs for Next static export). */
const KA_TO_LATIN = {
  ა: "a",
  ბ: "b",
  გ: "g",
  დ: "d",
  ე: "e",
  ვ: "v",
  ზ: "z",
  თ: "t",
  ი: "i",
  კ: "k",
  ლ: "l",
  მ: "m",
  ნ: "n",
  ო: "o",
  პ: "p",
  ჟ: "zh",
  რ: "r",
  ს: "s",
  ტ: "t",
  უ: "u",
  ფ: "p",
  ქ: "k",
  ღ: "gh",
  ყ: "q",
  შ: "sh",
  ჩ: "ch",
  ც: "ts",
  ძ: "dz",
  წ: "ts",
  ჭ: "ch",
  ხ: "kh",
  ჯ: "j",
  ჰ: "h",
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function transliterateKa(text) {
  return [...text]
    .map((ch) => KA_TO_LATIN[ch] ?? ch)
    .join("");
}

function slugify(filename) {
  const base = path.parse(filename).name;
  const titlePart = base.replace(/^წიგნი\s*[-–—]\s*/i, "").trim() || base;
  const slug = transliterateKa(titlePart)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 80);
  return slug || "wigni";
}

function titleFromFilename(filename) {
  const base = path.parse(filename).name;
  return base
    .replace(/^წიგნი\s*[-–—]\s*/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function bodyToParagraphs(body) {
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) =>
      block
        .split("\n")
        .map((line) => line.replace(/\t/g, " ").replace(/[ \u00a0]+/g, " ").trim())
        .filter(Boolean)
        .join(" ")
        .trim()
    )
    .filter((p) => p.length > 0);
}

async function extractDoc(filePath) {
  const extractor = new WordExtractor();
  const doc = await extractor.extract(filePath);
  return doc.getBody() || "";
}

async function main() {
  ensureDir(BOOKS_DIR);
  ensureDir(BOOKS_DATA_DIR);

  const files = fs
    .readdirSync(BOOKS_DIR)
    .filter((name) => {
      const ext = path.extname(name).toLowerCase();
      return DOC_EXT.has(ext) && fs.statSync(path.join(BOOKS_DIR, name)).isFile();
    })
    .sort((a, b) => a.localeCompare(b, "ka"));

  const manifest = [];

  for (const filename of files) {
    const full = path.join(BOOKS_DIR, filename);
    const slug = slugify(filename);
    const title = titleFromFilename(filename);
    const body = await extractDoc(full);
    const paragraphs = bodyToParagraphs(body);

    const entry = {
      slug,
      title,
      filename,
      src: `/books/${encodeURIComponent(filename)}`,
      paragraphCount: paragraphs.length,
    };

    fs.writeFileSync(
      path.join(BOOKS_DATA_DIR, `${slug}.json`),
      JSON.stringify({ ...entry, paragraphs }, null, 2) + "\n",
      "utf8"
    );

    manifest.push(entry);
    console.log(`✓ ${slug} (${paragraphs.length} paragraphs)`);
  }

  fs.writeFileSync(
    path.join(DATA_DIR, "books.json"),
    JSON.stringify(manifest, null, 2) + "\n",
    "utf8"
  );
  console.log(`Done. ${manifest.length} book(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
