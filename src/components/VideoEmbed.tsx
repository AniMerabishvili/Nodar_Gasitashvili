type VideoEmbedProps = {
  videoId: string;
  title: string;
};

export default function VideoEmbed({ videoId, title }: VideoEmbedProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-ink/8 bg-ink/5 shadow-sm">
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
