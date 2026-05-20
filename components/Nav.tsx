"use client";

import { useEffect, useState } from "react";
import { LogoLockup } from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header
      className="sticky top-0 z-40 px-6 sm:px-10 py-5 flex items-center justify-between transition-all duration-300"
      style={
        scrolled
          ? {
              background: "rgba(7,7,8,0.78)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }
          : { background: "transparent", borderBottom: "1px solid transparent" }
      }
    >
      <a href="/" className="flex items-center gap-3 transition-transform hover:scale-[1.02]">
        <LogoLockup size="sm" />
      </a>

      <nav className="flex items-center gap-7 sm:gap-9">
        <a
          href="/blog"
          className="hidden sm:inline font-sans text-sm transition-opacity hover:opacity-80"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          Blog
        </a>
        <a
          href="/explore"
          className="hidden sm:inline font-sans text-sm transition-opacity hover:opacity-80"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          Explore
        </a>
        <a
          href="/search"
          aria-label="Search"
          className="transition-opacity hover:opacity-80"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </a>
        <a
          href={isLoggedIn ? "/dashboard" : "/auth/signup"}
          className="font-sans text-sm font-semibold px-5 py-2.5 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
          style={{
            background: "#FFFFFF",
            color: "#0A0A0A",
            borderRadius: 999,
            boxShadow: "0 4px 16px rgba(94,234,212,0.18)",
          }}
        >
          {isLoggedIn ? "Dashboard" : "Get started"}
        </a>
      </nav>
    </header>
  );
}
