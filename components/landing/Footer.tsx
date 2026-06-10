import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { LogoMark, LogoWordmark } from "@/components/Logo";
import { ThemeToggle } from "./ThemeToggle";

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#features" },
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

// Footer runs the inverted brutalist palette — near-black ground, off-white
// ink, off-white offset shadows so the hard edges still read.
const footerVars = {
  "--ink": "#FAF6F0",
  "--ink-muted": "#B8B2A4",
  "--ink-faint": "#7C776C",
  "--line": "#FAF6F0",
  "--bg-elevated": "#161616",
  background: "#2B2440",
} as CSSProperties;

const socials = [
  { label: "TikTok", href: "https://www.tiktok.com/@hyperfix.app" },
  { label: "Instagram", href: "https://www.instagram.com/hyperfix.app" },
];

export function Footer() {
  return (
    <footer style={footerVars} className="relative overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 pb-0 pt-20 sm:px-10">
        {/* Sign-up nudge block */}
        <div
          className="mb-16 flex flex-col gap-5 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9"
          style={{ background: "var(--accent)", border: "3.5px solid #FAF6F0", borderRadius: 16, boxShadow: "8px 8px 0 0 #FAF6F0" }}
        >
          <div>
            <p className="text-[26px] font-bold leading-tight sm:text-[32px]" style={{ color: "#fff", letterSpacing: "-0.03em" }}>
              Your first quest is waiting.
            </p>
            <p className="mt-1.5 font-mono text-[12px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.85)" }}>
              Free to start · no credit card · 60 seconds
            </p>
          </div>
          <a
            href="/auth/signup"
            className="brutal-btn shrink-0 px-7 py-3.5 text-[15px]"
            style={{ background: "#FAF6F0", color: "#2B2440", borderColor: "#2B2440", boxShadow: "4px 4px 0 0 #2B2440" }}
          >
            Start playing <ArrowRight size={16} strokeWidth={3} />
          </a>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-y-12 sm:grid-cols-3 md:grid-cols-5 md:gap-x-10">
          <div className="col-span-2 sm:col-span-3 md:col-span-2">
            <span className="inline-flex items-center gap-2.5">
              <LogoMark size={28} color="var(--accent)" ink="#FAF6F0" />
              <span className="text-[28px] leading-none" style={{ fontWeight: 700, letterSpacing: "-0.04em", color: "#FAF6F0" }}>hyperfix</span>
            </span>
            <p className="mt-4 max-w-[260px] text-[14px] font-medium leading-relaxed" style={{ color: "var(--ink-muted)" }}>
              Start the task you&apos;ve been avoiding. Do 5 minutes, earn XP for
              starting, keep a streak that forgives you.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center px-4 font-mono text-[11px] font-bold uppercase tracking-wider transition-transform hover:-translate-y-0.5"
                  style={{ border: "2px solid #FAF6F0", borderRadius: 999, color: "var(--ink)" }}
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
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[14px] font-medium transition-colors hover:underline" style={{ color: "var(--ink-muted)" }}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 pt-7 sm:flex-row sm:items-center sm:justify-between" style={{ borderTop: "2.5px solid #FAF6F0" }}>
          <p className="font-mono text-[12px] uppercase tracking-wider" style={{ color: "var(--ink-faint)" }}>© 2026 Hyperfix · Made for brains that run hot.</p>
          <p className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider" style={{ color: "var(--ink-faint)" }}>
            <LogoMark size={14} color="var(--accent)" ink="#FAF6F0" /> Built for the way ADHD actually works
          </p>
        </div>
      </div>

      {/* Oversized outlined wordmark watermark */}
      <div aria-hidden className="relative mt-10 select-none overflow-hidden">
        <p
          className="whitespace-nowrap text-center leading-[0.8]"
          style={{
            fontSize: "clamp(80px,18vw,240px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "transparent",
            WebkitTextStroke: "2px rgba(251,246,234,0.14)",
            transform: "translateY(26%)",
          }}
        >
          hyperfix
        </p>
      </div>
    </footer>
  );
}
