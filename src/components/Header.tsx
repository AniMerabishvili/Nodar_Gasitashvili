"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "მთავარი" },
  { href: "/sigelebi", label: "სიგელები/დიპლომები" },
  { href: "/musika", label: "მუსიკა" },
  { href: "/fotoalbomi", label: "ფოტოალბომი" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/8 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          href="/"
          className="font-display text-sm font-medium tracking-wide text-ink transition-colors hover:text-accent md:text-base"
        >
          ნოდარ გასიტაშვილი
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="მთავარი ნავიგაცია">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-accent-pale text-accent"
                    : "text-ink-muted hover:bg-cream-dark hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink transition-colors hover:bg-cream-dark md:hidden"
          aria-label={open ? "მენიუს დახურვა" : "მენიუს გახსნა"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">მენიუ</span>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div
          className="border-t border-ink/8 bg-cream md:hidden"
          role="dialog"
          aria-label="მობილური ნავიგაცია"
        >
          <nav className="mx-auto flex max-w-5xl flex-col px-5 py-3" aria-label="მობილური ნავიგაცია">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-3 text-base transition-colors ${
                    active
                      ? "bg-accent-pale text-accent"
                      : "text-ink-muted hover:bg-cream-dark hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
