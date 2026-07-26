"use client";

import { useEffect, useRef, useState } from "react";

type AudioPlayerProps = {
  src: string;
  title: string;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrent(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number(e.target.value);
    audio.currentTime = value;
    setCurrent(value);
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="flex h-full flex-col rounded-xl border border-ink/8 bg-white/60 p-4 shadow-sm transition-shadow hover:shadow-md md:p-5">
      <audio ref={audioRef} src={src} preload="metadata" />
      <p className="mb-3 min-w-0 text-sm font-medium leading-snug text-ink">
        {title}
      </p>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-cream transition-colors hover:bg-accent-soft"
          aria-label={playing ? "პაუზა" : "დაკვრა"}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={current}
            onChange={onSeek}
            className="audio-range h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink/10 accent-accent"
            style={{
              background: `linear-gradient(to right, #7A3B3B ${progress}%, rgba(28,28,28,0.1) ${progress}%)`,
            }}
            aria-label="პროგრესი"
          />
          <div className="flex justify-between text-xs text-ink-light tabular-nums">
            <span>{formatTime(current)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
