# Nodar Gasitashvili - Biographical Dictionary Website

მინიმალისტური ბიოგრაფიული ვებგვერდი ნოდარ გასიტაშვილის შესახებ.

## Tech

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Static export (`output: "export"`) - deployable to Vercel, Netlify, or any static host

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding media files

Drop files into the folders below, then rebuild (or restart `npm run dev`). The manifest script runs automatically via `predev` / `prebuild`.

| Folder | Page | Supported formats |
|--------|------|-------------------|
| `public/images/` | `/` (profile portrait) | `NodarGasitashvili.jpg` / `.png` / `.webp` |
| `public/books/` | `/wigni/[slug]` (reader) + ნაწარმოებები | `.doc` / `.docx` (text extracted for on-site reading) |
| `public/documents/` | `/sigelebi` | `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.pdf` |
| `public/music/` | `/musika` | Audio: `.mp3`, `.wav`, `.ogg`, `.m4a`, `.flac` · Video: `.mp4`, `.webm`, `.mov`, `.avi` (prefer `.mp4`) |
| `raw-videos/` | (source only) | Original `.mpg` / `.mpeg` — convert locally before deploy |
| `public/gallery/` | `/fotoalbomi` | Nested folders = album groups (e.g. `1 აწყურის ციხე/`, `2 ისრაელი/1. იერუსალიმი/`). Images: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif` |

### Converting `.mpg` / `.mpeg` to web `.mp4`

Do **not** drop `.mpg` files straight into `public/music/` for production. Put originals in `raw-videos/`, then convert locally (requires [ffmpeg](https://ffmpeg.org/) on your PATH):

```bash
npm run convert:videos
```

This writes matching `.mp4` files into `public/music/` (same basename / numeric prefix, e.g. `01-song.mpg` → `01-song.mp4`). Existing `.mp4` outputs are skipped on re-run.

Run this on your machine **before pushing** — conversion is intentionally not part of the Cloudflare Pages (or other CI) build: it is slow and ffmpeg is typically unavailable there.

### Optional numbering

Prefix filenames with numbers for ordered display:

```
01-diploma.jpg
02-certificate.pdf
01-song-title.mp3
```

Titles are derived from filenames (extension removed, dashes/underscores → spaces).

### Manual manifest rebuild

```bash
npm run manifest
```

This writes:

- `src/data/documents.json`
- `src/data/music.json`
- `src/data/gallery.json`

## Build & deploy

```bash
npm run build
```

Static files are output to `out/`. Deploy that folder, or connect the repo to Vercel.

## Pages

- `/` - მთავარი (biography)
- `/sigelebi` - სიგელები/დიპლომები
- `/musika` - მუსიკა
- `/fotoalbomi` - ფოტოალბომი
