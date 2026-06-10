"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitial(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("hyperfix-theme");
  if (stored === "light" || stored === "dark") return stored;
  return "light"; // soft-cool light is the default (ADHD-friendly, low stress)
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitial());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("hyperfix-theme", theme);
  }, [theme, mounted]);

  return (
    <div
      className="inline-flex h-10 items-center p-0.5 font-mono text-[11px] font-bold uppercase tracking-wider"
      role="radiogroup"
      aria-label="Theme"
      style={{ border: "1.5px solid var(--line-strong)", borderRadius: 16, background: "var(--bg-elevated)" }}
    >
      <button
        type="button"
        role="radio"
        aria-checked={theme === "light"}
        onClick={() => setTheme("light")}
        className="h-8 px-3 transition-colors"
        style={
          theme === "light"
            ? { background: "var(--ink)", color: "var(--bg-elevated)", borderRadius: 20 }
            : { color: "var(--ink-muted)" }
        }
      >
        Light
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={theme === "dark"}
        onClick={() => setTheme("dark")}
        className="h-8 px-3 transition-colors"
        style={
          theme === "dark"
            ? { background: "var(--ink)", color: "var(--bg-elevated)", borderRadius: 20 }
            : { color: "var(--ink-muted)" }
        }
      >
        Dark
      </button>
    </div>
  );
}
