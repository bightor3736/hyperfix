import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { ThemeToggle } from "./ThemeToggle";
import { LogoMark } from "@/components/Logo";

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

// Footer keeps its own calm-slate palette regardless of theme — a soft deep
// slate (not harsh black) that grounds the page without high-stress contrast.
const footerVars = {
  "--ink": "#f4f0eb",
  "--ink-muted": "#a09690",
  "--ink-faint": "#6b6460",
  "--line": "#2e2724",
  "--invert-bg": "#f4f0eb",
  "--invert-ink": "#1a1615",
  "--energy": "#2dd4bf",
  "--accent": "#2dd4bf",
  background: "#1a1615",
  borderTop: "1px solid rgba(255,255,255,0.06)",
} as CSSProperties;

const socials = [
  { label: "TikTok", href: "https://www.tiktok.com/@hyperfix.app" },
  { label: "Instagram", href: "https://www.instagram.com/hyperfix.app" },
];

export function Footer() {
  return (
    <footer style={footerVars} className="relative overflow-hidden text-ink">
      <div className="mx-auto max-w-[1200px] px-6 pb-0 pt-20 sm:px-10">
        {/* Sign-up nudge strip */}
        <div className="mb-16 flex flex-col gap-5 rounded-[var(--radius-xl)] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--line)" }}>
          <div>
            <p className="font-display text-[22px] leading-tight text-ink sm:text-[26px]">
              Your first quest is waiting.
            </p>
            <p className="mt-1.5 text-[13px] text-ink-muted">
              Free to start · no credit card · 60 seconds
            </p>
          </div>
          <a
            href="/auth/signup"
            className="press-pop inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-7 text-[15px] font-semibold transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)", color: "#06302c" }}
          >
            Start playing <ArrowRight size={16} strokeWidth={2.5} />
          </a>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-y-12 sm:grid-cols-3 md:grid-cols-5 md:gap-x-10">
          <div className="col-span-2 sm:col-span-3 md:col-span-2">
            <Wordmark />
            <p className="mt-4 max-w-[260px] text-[13px] leading-relaxed text-ink-muted">
              ADHD accountability that actually works. Track your hyperfixations, earn XP, keep a streak that forgives you.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center rounded-full px-4 text-[12px] font-medium text-ink-muted transition-colors hover:text-ink"
                  style={{ border: "1px solid var(--line)" }}
                >
                  {s.label}
                </a>
              ))}
            </div>
            <div className="mt-5">
              <ThemeToggle />
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-ink-faint">© 2026 Hyperfix · Made for brains that run hot.</p>
          <p className="inline-flex items-center gap-1.5 text-[12px] text-ink-faint">
            <LogoMark size={13} color="var(--accent)" /> Built for the way ADHD actually works
          </p>
        </div>
      </div>

      {/* Oversized brand watermark — the lowest part of the page */}
      <div aria-hidden className="relative mt-10 select-none overflow-hidden">
        <p
          className="whitespace-nowrap text-center font-display font-medium leading-[0.8] tracking-tight"
          style={{
            fontSize: "clamp(80px,18vw,240px)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.06)",
            transform: "translateY(28%)",
          }}
        >
          hyperfix
        </p>
        {/* fade the watermark into the footer base */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 0%, #1a1615 88%)" }}
        />
      </div>
    </footer>
  );
}
