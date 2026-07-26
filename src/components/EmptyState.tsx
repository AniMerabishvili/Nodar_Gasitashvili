type EmptyStateProps = {
  message: string;
};

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/15 bg-cream-dark/40 px-6 py-20 text-center">
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-pale text-accent"
        aria-hidden="true"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      </div>
      <p className="max-w-sm text-base text-ink-muted">{message}</p>
    </div>
  );
}
