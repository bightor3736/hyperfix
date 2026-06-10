"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "./Wordmark";

const links = [
  { label: "How it works", href: "#features" },
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
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-[1200px] px-4 pt-3 sm:px-6">
        <div
          className="flex h-16 items-center justify-between px-4 sm:px-5"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--line)",
            borderRadius: 999,
            boxShadow: scrolled ? "var(--shadow)" : "0 0 0 0 rgba(0,0,0,0)",
            transition: "box-shadow 0.15s ease",
          }}
        >
          <Wordmark />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-[14px] font-semibold text-ink transition-colors hover:bg-[var(--bg-soft)]"
                style={{ borderRadius: 20 }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="/auth/login"
              className="hidden h-10 items-center px-3 text-[14px] font-semibold text-ink hover:underline sm:inline-flex"
            >
              Log in
            </a>
            <a
              href="/auth/signup"
              className="brutal-btn h-10 rounded-full px-5 text-[14px]"
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
