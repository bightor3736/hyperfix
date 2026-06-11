"use client";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/Logo";

const links = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(0,0,0,0.72)" : "transparent",
        backdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
      }}
    >
      <div className="container-lg flex h-[52px] items-center justify-between">
        <a href="/">
          <Wordmark dark={true} />
        </a>

        <nav className="hidden items-center gap-0 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontFamily: 'var(--font-sys)',
                fontSize: 14,
                fontWeight: 400,
                color: "rgba(255,255,255,0.72)",
                padding: "0 16px",
                letterSpacing: "-0.003em",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.72)")}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/auth/login"
            className="hidden sm:block"
            style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.72)", letterSpacing: "-0.003em" }}
          >
            Log in
          </a>
          <a
            href="/auth/signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 32,
              padding: "0 16px",
              borderRadius: 9999,
              background: "rgba(255,255,255,0.92)",
              color: "#000",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "-0.009em",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}
