import type { CSSProperties } from "react";
import { Wordmark } from "./Wordmark";
import { ThemeToggle } from "./ThemeToggle";

const columns = [
  {
    title: "Product",
    links: [
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
      { label: "Hyperfixations", href: "/dashboard/fixations" },
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

// Footer keeps its own deep palette regardless of theme — Linear's near-black
// with a faint top hairline, so it grounds the page.
const footerVars = {
  "--ink": "#f7f8f8",
  "--ink-muted": "#9b9faa",
  "--ink-faint": "#63666e",
  "--line": "#1c1d22",
  "--invert-bg": "#f7f8f8",
  "--invert-ink": "#0c0c0f",
  "--energy": "#9d86ff",
  "--accent": "#9d86ff",
  background: "#08080a",
  borderTop: "1px solid rgba(255,255,255,0.06)",
} as CSSProperties;

export function Footer() {
  return (
    <footer style={footerVars} className="text-ink">
      <div className="mx-auto max-w-[1200px] px-6 pb-12 pt-20 sm:px-10">
        <div className="grid grid-cols-2 gap-y-12 sm:grid-cols-3 md:grid-cols-5 md:gap-x-10">
          <div className="col-span-2 sm:col-span-3 md:col-span-2">
            <Wordmark />
            <p className="mt-4 max-w-[260px] text-[13px] leading-relaxed text-ink-muted">
              ADHD accountability that actually works. Track your hyperfixations, earn real XP, beat the wall.
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
