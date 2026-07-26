"use client";

import { useRef, useState } from "react";

type VideoPlayerProps = {
  src: string;
  title: string;
  format?: string;
};

/** Formats with weak/unreliable browser support — always offer download. */
const LEGACY_FORMATS = new Set(["mpg", "mpeg", "avi"]);

export default function VideoPlayer({ src, title, format }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const legacy = format ? LEGACY_FORMATS.has(format.toLowerCase()) : false;

  // Prefer .mp4 (H.264) for reliable playback; .mpg/.mpeg often fail in Chrome/Safari.

  return (
    <div className="flex h-full flex-col rounded-xl border border-ink/8 bg-white/60 p-4 shadow-sm transition-shadow hover:shadow-md md:p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <p className="min-w-0 text-sm font-medium leading-snug text-ink">
          {title}
        </p>
        {legacy && (
          <a
            href={src}
            download
            className="shrink-0 text-sm text-accent underline-offset-2 hover:underline"
          >
            ჩამოტვირთვა
          </a>
        )}
      </div>

      {failed ? (
        <div className="rounded-lg border border-dashed border-ink/15 bg-cream-dark/50 px-4 py-6 text-center">
          <p className="text-sm leading-relaxed text-ink-muted">
            ეს ფაილი შესაძლოა ბრაუზერში არ გაეშვას
          </p>
          <a
            href={src}
            download
            className="mt-4 inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm text-cream transition-colors hover:bg-accent-soft"
          >
            ჩამოტვირთვა
          </a>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-ink/90">
          <video
            ref={videoRef}
            className="aspect-video w-full"
            src={src}
            controls
            preload="metadata"
            playsInline
            onError={() => setFailed(true)}
          >
            თქვენი ბრაუზერი ვიდეოს მხარდაჭერას არ უზრუნველყოფს.
          </video>
        </div>
      )}
    </div>
  );
}
