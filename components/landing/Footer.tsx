import type { CSSProperties } from "react";
import { Wordmark } from "./Wordmark";
import { ThemeToggle } from "./ThemeToggle";

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Play",
    links: [
      { label: "Sign up", href: "/auth/signup" },
      { label: "Log in", href: "/auth/login" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/tos" },
    ],
  },
];

// Footer keeps its own always-dark (pure black) palette regardless of theme.
const footerVars = {
  "--ink": "#ffffff",
  "--ink-muted": "#a3a3a3",
  "--ink-faint": "#6b6b6b",
  "--line": "#262626",
  "--invert-bg": "#ffffff",
  "--invert-ink": "#0a0a0a",
  "--energy": "#ffffff",
  "--accent": "#ffffff",
  background: "#0a0a0a",
} as CSSProperties;

export function Footer() {
  return (
    <footer style={footerVars} className="text-ink">
      <div className="mx-auto max-w-[1200px] px-6 pb-12 pt-20 sm:px-10">
        <div className="grid grid-cols-2 gap-y-12 sm:grid-cols-3 md:grid-cols-5 md:gap-x-10">
          <div className="col-span-2 sm:col-span-3 md:col-span-2">
            <Wordmark />
            <p className="mt-4 max-w-[260px] text-[13px] leading-relaxed text-ink-muted">
              Your daily dopamine, on tap. The anti-doomscroll game for ADHD brains.
            </p>
            <div className="mt-6">
              <ThemeToggle />
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-medium text-ink">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-ink-muted hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-ink-faint">© 2026 Hyperfix</p>
          <div className="flex items-center gap-5 text-[12px] text-ink-faint">
            <a href="https://www.tiktok.com/@hyperfix.app" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              TikTok
            </a>
            <a href="https://www.instagram.com/hyperfix.app" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
