"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type LightboxProps = {
  images: { src: string; title: string }[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export default function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: LightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const hasMultiple = images.length > 1;
  const current = images[index];

  const goPrev = useCallback(() => {
    if (!hasMultiple) return;
    onNavigate(index === 0 ? images.length - 1 : index - 1);
  }, [hasMultiple, images.length, index, onNavigate]);

  const goNext = useCallback(() => {
    if (!hasMultiple) return;
    onNavigate(index === images.length - 1 ? 0 : index + 1);
  }, [hasMultiple, images.length, index, onNavigate]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, goPrev, goNext]);

  if (!current || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="დახურვა"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-6"
            aria-label="წინა ფოტო"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-6"
            aria-label="შემდეგი ფოტო"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      <div
        className="relative flex max-h-[85vh] max-w-[90vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(delta) < 50) return;
          if (delta > 0) goPrev();
          else goNext();
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current.src}
          src={current.src}
          alt={current.title}
          className="max-h-[80vh] max-w-full rounded-sm object-contain shadow-2xl"
        />
        <p className="mt-4 text-center text-sm text-white/70">
          {current.title}
          {hasMultiple && (
            <span className="ml-2 text-white/40">
              {index + 1} / {images.length}
            </span>
          )}
        </p>
      </div>
    </div>,
    document.body
  );
}
