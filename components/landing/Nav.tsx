"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "./Wordmark";

const links = [
  { label: "How it works", href: "#features" },
  { label: "Pricing",      href: "#pricing" },
  { label: "FAQ",          href: "#faq" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "var(--bg-elevated)",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        transition: "border-color 0.2s ease",
      }}
    >
      <div
        className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-6 sm:px-8"
      >
        <Wordmark />

        {/* Nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-[15px] transition-colors hover:text-ink"
              style={{ color: "var(--ink-muted)", letterSpacing: "-0.009em" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA group — Steep: text link + one filled Ink pill */}
        <div className="flex items-center gap-4">
          <a
            href="/auth/login"
            className="hidden text-[15px] transition-opacity hover:opacity-70 sm:block"
            style={{ color: "var(--ink)", letterSpacing: "-0.009em" }}
          >
            Log in
          </a>
          <a
            href="/auth/signup"
            className="brutal-btn h-9 px-5 text-[15px]"
            style={{ background: "var(--ink)", color: "#ffffff" }}
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}
