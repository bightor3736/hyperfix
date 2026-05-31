"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "./Wordmark";

const links = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Manifesto", href: "/manifesto" },
];

export function Nav() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const onScroll = () => setRevealed(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-bg">
      <div className="mx-auto flex h-24 max-w-[1200px] items-center justify-between px-6 sm:px-10">
        <div className="flex items-center gap-12">
          <Wordmark />
          <nav
            className={`nav-fade hidden items-center gap-8 md:flex ${
              revealed
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-1 opacity-0"
            }`}
            aria-hidden={!revealed}
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[15px] text-ink-muted hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div
          className={`nav-fade flex items-center gap-2 ${
            revealed
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0"
          }`}
          aria-hidden={!revealed}
        >
          <a
            href="/auth/login"
            className="hidden h-11 items-center rounded-full px-4 text-[15px] text-ink hover:text-ink-muted sm:inline-flex"
          >
            Log in
          </a>
          <a
            href="/auth/signup"
            className="inline-flex h-11 items-center rounded-full bg-invert-bg px-5 text-[15px] text-invert-ink hover:opacity-90"
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}
