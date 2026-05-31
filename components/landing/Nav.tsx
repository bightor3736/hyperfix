"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wordmark } from "./Wordmark";

export function Nav() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const onScroll = () => setRevealed(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50" style={{ background: "var(--bg)", borderBottom: "1px solid var(--line)" }}>
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 sm:px-10">
        <Wordmark />

        <nav
          className={`hidden md:flex items-center gap-8 nav-fade ${revealed ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"}`}
          aria-hidden={!revealed}
        >
          {["Features", "Pricing", "Manifesto"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-[14px] nav-fade"
              style={{ color: "var(--ink-muted)" }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className={`flex items-center gap-3 nav-fade ${revealed ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"}`} aria-hidden={!revealed}>
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex text-[14px]"
            style={{ color: "var(--ink-muted)" }}
          >
            Log in
          </Link>
        </div>

        <Link
          href="/join"
          className="inline-flex h-9 items-center rounded-full px-5 text-[14px] font-medium"
          style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
        >
          Get started
        </Link>
      </div>
    </header>
  );
}
