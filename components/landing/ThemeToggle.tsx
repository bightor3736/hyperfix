"use client";

import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("hyperfix-theme") as Theme | null;
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const t = stored ?? sys;
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  function toggle(t: Theme) {
    setTheme(t);
    localStorage.setItem("hyperfix-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  }

  return (
    <div
      className="inline-flex h-9 items-center rounded-full border p-1 text-[13px]"
      style={{ borderColor: "var(--line)" }}
      role="radiogroup"
      aria-label="Theme"
    >
      {(["light", "dark"] as Theme[]).map((t) => (
        <button
          key={t}
          type="button"
          role="radio"
          aria-checked={theme === t}
          onClick={() => toggle(t)}
          className="h-7 rounded-full px-4 capitalize transition-colors"
          style={
            theme === t
              ? { background: "var(--invert-bg)", color: "var(--invert-ink)" }
              : { color: "var(--ink-muted)" }
          }
        >
          {t}
        </button>
      ))}
    </div>
  );
}
