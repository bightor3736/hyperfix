"use client";

import { useEffect, useState } from "react";
import { LogoLockup } from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";
import { Search } from "react-iconly";

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
              borderBottom: "1px solid var(--line)",
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
          style={{ color: "var(--ink-muted)" }}
        >
          Blog
        </a>
        <a
          href="/explore"
          className="hidden sm:inline font-sans text-sm transition-opacity hover:opacity-80"
          style={{ color: "var(--ink-muted)" }}
        >
          Explore
        </a>
        <a
          href="/search"
          aria-label="Search"
          className="transition-opacity hover:opacity-80"
          style={{ color: "var(--ink-muted)" }}
        >
          <Search set="light" size={20} primaryColor="currentColor" />
        </a>
        <a
          href={isLoggedIn ? "/dashboard" : "/auth/signup"}
          className="font-sans text-sm font-semibold px-5 py-2.5 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
          style={{
            background: "var(--ink)",
            color: "var(--bg)",
            borderRadius: 999,
            boxShadow: "0 4px 16px var(--accent-soft)",
          }}
        >
          {isLoggedIn ? "Dashboard" : "Get started"}
        </a>
      </nav>
    </header>
  );
}
