import type { Metadata } from "next";
import documents from "@/data/documents.json";
import DocumentGallery, { type DocumentItem } from "@/components/DocumentGallery";
import EmptyState from "@/components/EmptyState";
import FadeIn from "@/components/FadeIn";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "სიგელები/დიპლომები",
};

export default function SigelebiPage() {
  const items = documents as DocumentItem[];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
      <FadeIn>
        <PageHeader
          title="სიგელები/დიპლომები"
          description="დოკუმენტები და სერტიფიკატები"
        />
      </FadeIn>

      <FadeIn delay={80}>
        {items.length === 0 ? (
          <EmptyState message="მასალა მალე დაემატება" />
        ) : (
          <DocumentGallery items={items} />
        )}
      </FadeIn>
    </div>
  );
}
