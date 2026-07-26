import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeIn from "@/components/FadeIn";

const SLUG = "kartvelobistvis-dabadebuli";

type BookContent = {
  slug: string;
  title: string;
  filename: string;
  src: string;
  paragraphCount: number;
  paragraphs: string[];
};

function loadBook(): BookContent | null {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "books",
    `${SLUG}.json`
  );
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as BookContent;
}

export function generateMetadata(): Metadata {
  const book = loadBook();
  if (!book) return { title: "წიგნი" };
  return {
    title: book.title,
    description: `${book.title} - ნოდარ გასიტაშვილი`,
  };
}

export default function BookReaderPage() {
  const book = loadBook();
  if (!book) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
      <FadeIn>
        <nav className="mb-8 text-sm text-ink-light">
          <Link href="/" className="transition-colors hover:text-accent">
            მთავარი
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-ink-muted">ნაწარმოებები</span>
        </nav>

        <header className="mb-10 border-b border-ink/10 pb-8">
          <p className="mb-2 text-xs uppercase tracking-wide text-ink-light">
            წიგნი
          </p>
          <h1 className="font-display text-3xl font-medium leading-tight text-ink md:text-4xl">
            {book.title}
          </h1>
          <p className="mt-3 text-sm text-ink-muted">ნოდარ გასიტაშვილი</p>
          <a
            href={book.src}
            download
            className="mt-5 inline-flex items-center rounded-md border border-ink/15 px-3 py-1.5 text-sm text-ink-muted transition-colors hover:border-accent/40 hover:text-accent"
          >
            ჩამოტვირთვა (.doc)
          </a>
        </header>
      </FadeIn>

      <FadeIn delay={60}>
        <article className="space-y-5 text-base leading-[1.9] text-ink-muted md:text-[1.05rem]">
          {book.paragraphs.map((paragraph, index) => {
            const isShort = paragraph.length < 60;
            const looksLikeHeading =
              isShort && !/[.!?…]$/.test(paragraph) && paragraph.length > 1;

            if (looksLikeHeading && index > 0) {
              return (
                <h2
                  key={index}
                  className="pt-4 font-display text-xl font-medium text-ink md:text-2xl"
                >
                  {paragraph}
                </h2>
              );
            }

            return <p key={index}>{paragraph}</p>;
          })}
        </article>
      </FadeIn>

      <div className="mt-14 border-t border-ink/10 pt-8">
        <Link
          href="/"
          className="text-sm text-accent transition-colors hover:text-accent-soft"
        >
          ← უკან მთავარზე
        </Link>
      </div>
    </div>
  );
}
