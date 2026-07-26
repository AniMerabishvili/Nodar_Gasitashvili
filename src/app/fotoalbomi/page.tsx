import type { Metadata } from "next";
import gallery from "@/data/gallery.json";
import EmptyState from "@/components/EmptyState";
import FadeIn from "@/components/FadeIn";
import PageHeader from "@/components/PageHeader";
import PhotoGallery, { type GalleryGroup } from "@/components/PhotoGallery";

export const metadata: Metadata = {
  title: "ფოტოალბომი",
};

export default function FotoalbomiPage() {
  const groups = gallery as GalleryGroup[];
  const totalImages = groups.reduce(
    (sum, g) =>
      sum + g.subgroups.reduce((s, sub) => s + sub.images.length, 0),
    0
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
      <FadeIn>
        <PageHeader
          title="ფოტოალბომი"
          description={
            totalImages > 0
              ? `${groups.length} ალბომი · ${totalImages} ფოტო`
              : "ფოტოგრაფიები"
          }
        />
      </FadeIn>

      <FadeIn delay={80}>
        {totalImages === 0 ? (
          <EmptyState message="ფოტოალბომი მალე დაემატება" />
        ) : (
          <PhotoGallery groups={groups} />
        )}
      </FadeIn>
    </div>
  );
}
