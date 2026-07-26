import fs from "fs";
import path from "path";
import Image from "next/image";

const CANDIDATES = [
  "NodarGasitashvili.jpg",
  "NodarGasitashvili.jpeg",
  "NodarGasitashvili.png",
  "NodarGasitashvili.webp",
];

export function getProfileImageSrc(): string | null {
  const imagesDir = path.join(process.cwd(), "public", "images");
  for (const file of CANDIDATES) {
    if (fs.existsSync(path.join(imagesDir, file))) {
      return `/images/${file}`;
    }
  }
  return null;
}

type ProfilePortraitProps = {
  src: string | null;
  className?: string;
};

export default function ProfilePortrait({ src, className = "" }: ProfilePortraitProps) {
  return (
    <div
      className={`relative aspect-[3/4] w-[280px] max-w-[85vw] shrink-0 overflow-hidden rounded-[10px] border border-ink/10 bg-cream-dark shadow-sm sm:w-[220px] sm:max-w-none md:w-[240px] lg:w-[260px] ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt="ნოდარ გასიტაშვილი"
          fill
          sizes="(max-width: 639px) 280px, (max-width: 768px) 220px, (max-width: 1024px) 240px, 260px"
          className="object-cover object-top"
          priority
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center bg-[#EBE7E1]"
          aria-hidden="true"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A89F94"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>
      )}
    </div>
  );
}
