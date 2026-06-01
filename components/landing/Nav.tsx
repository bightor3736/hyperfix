"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "./Wordmark";

const links = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-3">
        <div
          className={`flex h-16 items-center justify-between rounded-full px-4 sm:px-5 transition-all ${scrolled ? "glass" : ""}`}
          style={{
            border: `1px solid ${scrolled ? "rgba(97,74,68,0.14)" : "transparent"}`,
            boxShadow: scrolled ? "0 4px 24px -8px rgba(26,22,21,0.10)" : "none",
            background: scrolled ? "rgba(249,248,247,0.85)" : "transparent",
          }}
        >
          <Wordmark />
          <nav className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="/auth/login"
              className="hidden h-10 items-center rounded-full px-4 text-[14px] font-medium text-ink transition-colors hover:text-ink-muted sm:inline-flex"
            >
              Log in
            </a>
            <a
              href="/auth/signup"
              className="press-pop inline-flex h-10 items-center rounded-full px-5 text-[14px] font-semibold transition-all hover:opacity-90"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              Get started
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
