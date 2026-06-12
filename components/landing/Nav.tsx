"use client";
import { useEffect, useState } from "react";

function ConcentricMark() {
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: 22, height: 22 }}>
      <div style={{ position: "absolute", width: 22, height: 22, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.55)" }} />
      <div style={{ width: 9, height: 9, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.55)" }} />
    </div>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(0,0,0,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
      }}
    >
      <div className="wrap flex h-[56px] items-center justify-between">
        <a href="/" className="flex items-center gap-2.5" style={{ textDecoration: "none" }}>
          <ConcentricMark />
          <span style={{ fontWeight: 700, fontSize: 16, color: "#ffffff", letterSpacing: "-0.025em" }}>
            hyperfix
          </span>
        </a>

        <nav className="hidden md:flex items-center">
          {[
            { label: "How it works", href: "#features" },
            { label: "Pricing", href: "#pricing" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.55)", padding: "0 14px", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/auth/login"
            className="hidden sm:block"
            style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
          >
            Log in
          </a>
          <a
            href="/auth/signup"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: 36, padding: "0 18px", borderRadius: 9999,
              background: "#ffffff", color: "#000000",
              fontSize: 14, fontWeight: 600, textDecoration: "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.88)")}
            onMouseLeave={e => (e.currentTarget.style.background = "#ffffff")}
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}
