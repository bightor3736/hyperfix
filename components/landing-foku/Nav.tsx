"use client";

import { useEffect, useState } from "react";

export function NavFoku() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 px-6 sm:px-10 py-4 flex items-center justify-between transition-all duration-300"
      style={{
        background: scrolled ? "rgba(238, 244, 255, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(91, 141, 239, 0.15)" : "1px solid transparent",
      }}
    >
      {/* Logo */}
      <a href="/" className="font-semibold text-xl tracking-tight" style={{ color: "#1A1A2E" }}>
        hyperfix
      </a>

      {/* Right nav */}
      <nav className="flex items-center gap-4 sm:gap-6">
        <a
          href="/auth/login"
          className="font-medium text-sm transition-opacity hover:opacity-70"
          style={{ color: "#1A1A2E" }}
        >
          Log in
        </a>
        <a
          href="/auth/signup"
          className="font-medium text-sm px-5 py-2.5 transition-all hover:opacity-90 hover:-translate-y-0.5"
          style={{
            background: "#1A1A2E",
            color: "#ffffff",
            borderRadius: 999,
          }}
        >
          Get started
        </a>
      </nav>
    </header>
  );
}
