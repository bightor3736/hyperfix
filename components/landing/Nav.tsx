"use client";
import { useEffect, useState } from "react";
import { AppIcon } from "@/components/Logo";

const LINKS = [
  { label: "How it works", href: "/#how" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
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
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.25s ease",
        background: scrolled ? "rgba(251,247,241,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      <nav
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <AppIcon size={28} />
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)" }}>
            hyperfix
          </span>
        </a>

        <div className="hidden md:flex" style={{ alignItems: "center", gap: 30 }}>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-muted)", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-muted)")}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a
            href="/auth/login"
            className="hidden sm:inline-flex"
            style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", textDecoration: "none", padding: "8px 6px" }}
          >
            Log in
          </a>
          <a
            href="/auth/signup"
            style={{
              display: "inline-flex", alignItems: "center",
              height: 40, padding: "0 18px", borderRadius: 9999,
              background: "var(--accent)", color: "#fff",
              fontSize: 14, fontWeight: 600, textDecoration: "none",
              boxShadow: "0 6px 18px rgba(255,90,54,0.30)",
            }}
          >
            Start free
          </a>
        </div>
      </nav>
    </header>
  );
}
