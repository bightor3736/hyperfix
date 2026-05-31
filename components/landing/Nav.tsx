"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wordmark } from "./Wordmark";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "var(--bg)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 sm:px-10">
        <Wordmark />

        {/* Desktop nav links — appear after scroll */}
        <nav
          className="hidden md:flex items-center gap-8 nav-fade"
          style={{ opacity: scrolled ? 1 : 0, transform: scrolled ? "translateY(0)" : "translateY(-4px)", pointerEvents: scrolled ? "auto" : "none" }}
          aria-hidden={!scrolled}
        >
          <a href="#features" className="text-[14px] transition-opacity hover:opacity-70" style={{ color: "var(--ink-muted)" }}>Features</a>
          <a href="#pricing"  className="text-[14px] transition-opacity hover:opacity-70" style={{ color: "var(--ink-muted)" }}>Pricing</a>
          <a href="#faq"      className="text-[14px] transition-opacity hover:opacity-70" style={{ color: "var(--ink-muted)" }}>FAQ</a>
        </nav>

        {/* Right side — always visible */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex text-[14px] transition-opacity hover:opacity-70"
            style={{ color: "var(--ink-muted)" }}
          >
            Log in
          </Link>
          <Link
            href="/join"
            className="inline-flex h-9 items-center rounded-full px-5 text-[14px] font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
