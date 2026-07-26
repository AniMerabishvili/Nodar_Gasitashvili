"use client";

import { useMemo, useState } from "react";
import Lightbox from "./Lightbox";

export type GalleryImage = {
  filename: string;
  relativePath?: string;
  src: string;
  title: string;
  type: string;
};

export type GallerySubgroup = {
  title: string | null;
  images: GalleryImage[];
};

export type GalleryGroup = {
  id: string;
  title: string;
  order: number;
  subgroups: GallerySubgroup[];
};

/** @deprecated use GalleryImage */
export type GalleryItem = GalleryImage;

type PhotoGalleryProps = {
  groups: GalleryGroup[];
};

export default function PhotoGallery({ groups }: PhotoGalleryProps) {
  const flatImages = useMemo(
    () =>
      groups.flatMap((group) =>
        group.subgroups.flatMap((sub) =>
          sub.images.map((img) => ({
            src: img.src,
            title: sub.title
              ? `${group.title} - ${sub.title}: ${img.title}`
              : `${group.title}: ${img.title}`,
          }))
        )
      ),
    [groups]
  );

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  let runningIndex = 0;

  return (
    <>
      <div className="space-y-14">
        {groups.map((group) => (
          <section key={group.id} aria-labelledby={`gallery-${group.id}`}>
            <header className="mb-6">
              <h2
                id={`gallery-${group.id}`}
                className="font-display text-2xl font-medium text-ink md:text-3xl"
              >
                {group.title}
              </h2>
              <div className="mt-3 h-px w-14 bg-accent/40" aria-hidden="true" />
            </header>

            <div className="space-y-10">
              {group.subgroups.map((sub, subIdx) => {
                const sectionStart = runningIndex;
                const nodes = (
                  <div key={`${group.id}-${subIdx}`}>
                    {sub.title && (
                      <h3 className="mb-4 text-base font-medium text-ink-muted md:text-lg">
                        {sub.title}
                      </h3>
                    )}
                    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                      {sub.images.map((item, i) => {
                        const globalIndex = sectionStart + i;
                        return (
                          <button
                            key={item.relativePath || `${item.src}-${i}`}
                            type="button"
                            onClick={() => setLightboxIndex(globalIndex)}
                            className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-ink/8 bg-white/60 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.src}
                              alt={item.title}
                              className="w-full object-cover"
                              loading="lazy"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
                runningIndex += sub.images.length;
                return nodes;
              })}
            </div>
          </section>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={flatImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
