"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitial(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("hyperfix-theme");
  if (stored === "light" || stored === "dark") return stored;
  return "dark"; // dark is the default brand look (Linear × Tiimo)
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
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
      className="inline-flex h-9 items-center rounded-full border border-line p-0.5 text-[12px] font-medium"
      role="radiogroup"
      aria-label="Theme"
    >
      <button
        type="button"
        role="radio"
        aria-checked={theme === "light"}
        onClick={() => setTheme("light")}
        className={`h-8 rounded-full px-3 ${
          theme === "light"
            ? "bg-invert-bg text-invert-ink"
            : "text-ink-muted hover:text-ink"
        }`}
      >
        Light
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={theme === "dark"}
        onClick={() => setTheme("dark")}
        className={`h-8 rounded-full px-3 ${
          theme === "dark"
            ? "bg-invert-bg text-invert-ink"
            : "text-ink-muted hover:text-ink"
        }`}
      >
        Dark
      </button>
    </div>
  );
}
