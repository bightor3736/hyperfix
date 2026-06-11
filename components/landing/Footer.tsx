import { ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/Logo";
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

const socials = [
  { label: "TikTok", href: "https://www.tiktok.com/@hyperfix.app" },
  { label: "Instagram", href: "https://www.instagram.com/hyperfix.app" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: "var(--bg-soft)" }}>
      <div className="mx-auto max-w-[1200px] px-6 pb-12 pt-20 sm:px-10">
        {/* Steep footer CTA — Ink surface, white text, one pill CTA */}
        <div
          className="mb-16 flex flex-col gap-5 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12"
          style={{ background: "var(--ink)", borderRadius: 28 }}
        >
          <div>
            <p className="steep-display" style={{ fontSize: "clamp(24px,4vw,36px)", color: "#ffffff" }}>
              Your first quest is waiting.
            </p>
            <p className="mt-2 text-[14px]" style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "-0.009em" }}>
              Free to start · no credit card · 60 seconds
            </p>
          </div>
          <a
            href="/auth/signup"
            className="brutal-btn shrink-0 px-8 py-3.5 text-[15px]"
            style={{ background: "#ffffff", color: "var(--ink)" }}
          >
            Start playing <ArrowRight size={16} strokeWidth={2} />
          </a>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-y-12 sm:grid-cols-3 md:grid-cols-5 md:gap-x-10">
          <div className="col-span-2 sm:col-span-3 md:col-span-2">
            <span className="inline-flex items-center gap-2.5">
              <LogoMark size={28} />
              <span className="text-[28px] leading-none text-ink" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>hyperfix</span>
            </span>
            <p className="mt-4 max-w-[260px] text-[14px] font-medium leading-relaxed text-ink-muted">
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
                  className="inline-flex h-9 items-center rounded-full px-4 text-[12.5px] font-bold text-ink transition-transform hover:-translate-y-0.5"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}
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
              <h4 className="text-[12px] font-medium uppercase tracking-[0.08em]" style={{ color: "var(--ink-faint)" }}>
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[14px] transition-colors hover:text-ink" style={{ color: "var(--ink-muted)", letterSpacing: "-0.009em" }}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 pt-7 sm:flex-row sm:items-center sm:justify-between" style={{ borderTop: "1px solid var(--line-strong)" }}>
          <p className="text-[13px] font-semibold text-ink-faint">© 2026 Hyperfix · Made for brains that run hot.</p>
          <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-faint">
            <LogoMark size={14} /> Built for the way ADHD actually works
          </p>
        </div>
      </div>
    </footer>
  );
}
