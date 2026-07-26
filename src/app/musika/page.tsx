import type { Metadata } from "next";
import music from "@/data/music.json";
import AudioPlayer from "@/components/AudioPlayer";
import EmptyState from "@/components/EmptyState";
import FadeIn from "@/components/FadeIn";
import PageHeader from "@/components/PageHeader";
import VideoPlayer from "@/components/VideoPlayer";

export const metadata: Metadata = {
  title: "მუსიკა",
};

type MusicItem = {
  filename: string;
  src: string;
  title: string;
  type: "audio" | "video";
  format: string;
};

export default function MusikaPage() {
  const items = music as MusicItem[];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
      <FadeIn>
        <PageHeader
          title="მუსიკა"
          description="მუსიკალური ჩანაწერები"
        />
      </FadeIn>

      <FadeIn delay={80}>
        {items.length === 0 ? (
          <EmptyState message="მუსიკალური მასალა მალე დაემატება" />
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.filename} className="min-w-0">
                {item.type === "video" ? (
                  <VideoPlayer
                    src={item.src}
                    title={item.title}
                    format={item.format}
                  />
                ) : (
                  <AudioPlayer src={item.src} title={item.title} />
                )}
              </li>
            ))}
          </ul>
        )}
      </FadeIn>
    </div>
  );
}
