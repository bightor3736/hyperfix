"use client";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/Logo";

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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        background: scrolled ? "rgba(250,250,248,0.92)" : "rgba(250,250,248,0.0)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid #E4E4E7" : "1px solid transparent",
      }}
    >
      <div className="wrap flex h-[56px] items-center justify-between">
        <a href="/"><Wordmark dark={false} size={16} /></a>

        <nav className="hidden md:flex items-center">
          {[
            { label: "How it works", href: "#features" },
            { label: "Pricing", href: "#pricing" },
          ].map((l) => (
            <a key={l.href} href={l.href} style={{ fontSize: 14, fontWeight: 500, color: "#52525B", padding: "0 14px", letterSpacing: "-0.005em", textDecoration: "none", transition: "color 0.1s" }}
               onMouseEnter={e => (e.currentTarget.style.color = "#18181B")}
               onMouseLeave={e => (e.currentTarget.style.color = "#52525B")}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="/auth/login" className="hidden sm:block" style={{ fontSize: 14, fontWeight: 500, color: "#52525B", textDecoration: "none" }}>
            Log in
          </a>
          <a href="/auth/signup" className="btn btn-dark" style={{ height: 36, fontSize: 14, padding: "0 18px" }}>
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}
