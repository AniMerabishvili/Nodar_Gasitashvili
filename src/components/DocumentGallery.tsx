"use client";

import { useMemo, useState } from "react";
import Lightbox from "./Lightbox";

export type DocumentItem = {
  filename: string;
  src: string;
  title: string;
  type: "image" | "pdf";
};

type DocumentGalleryProps = {
  items: DocumentItem[];
};

export default function DocumentGallery({ items }: DocumentGalleryProps) {
  const images = useMemo(
    () =>
      items
        .filter((i) => i.type === "image")
        .map((i) => ({ src: i.src, title: "" })),
    [items]
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          if (item.type === "image") {
            const imgIndex = images.findIndex((img) => img.src === item.src);
            return (
              <button
                key={item.filename}
                type="button"
                onClick={() => setLightboxIndex(imgIndex)}
                className="group overflow-hidden rounded-xl border border-ink/8 bg-white/60 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="aspect-[4/3] overflow-hidden bg-cream-dark">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
              </button>
            );
          }

          return (
            <div
              key={item.filename}
              className="flex flex-col justify-between rounded-xl border border-ink/8 bg-white/60 p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-pale text-accent"
                  aria-hidden="true"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 13h8M8 17h6" />
                  </svg>
                </div>
                <p className="text-xs uppercase tracking-wide text-ink-light">PDF</p>
              </div>
              <a
                href={item.src}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm text-cream transition-colors hover:bg-accent-soft"
              >
                ნახვა
              </a>
            </div>
          );
        })}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
