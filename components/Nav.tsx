"use client";

import { useEffect, useState } from "react";
import { LogoLockup } from "@/components/Logo";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 px-6 sm:px-10 py-4 flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-[rgba(244,244,244,0.07)] shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <a href="/" className="flex items-center gap-3">
        <LogoLockup />
      </a>
      <nav className="flex items-center gap-4">
        <a
          href="/blog"
          className="font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] hover:text-[rgba(244,244,244,0.8)] transition-colors"
        >
          Blog
        </a>
        <a
          href="/explore"
          className="font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] hover:text-[rgba(244,244,244,0.8)] transition-colors"
        >
          Explore
        </a>
        <a
          href="/search"
          aria-label="Search"
          className="transition-colors"
          style={{ color: "rgba(244,244,244,0.4)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </a>
        <a
          href="/auth/signup"
          className="font-mono text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-full bg-accent text-[#0A0A0A] font-bold hover:bg-accent/90 transition-colors"
        >
          Get started →
        </a>
      </nav>
    </header>
  );
}
