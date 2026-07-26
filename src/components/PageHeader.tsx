type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-10 md:mb-14">
      <h1 className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
      <div className="mt-6 h-px w-16 bg-accent/40" aria-hidden="true" />
    </header>
  );
}
