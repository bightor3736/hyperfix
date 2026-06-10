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
        {/* Sign-up nudge block — big friendly lilac card */}
        <div
          className="mb-16 flex flex-col gap-5 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10"
          style={{ background: "var(--accent)", borderRadius: 32, boxShadow: "var(--shadow-lg)" }}
        >
          <div>
            <p className="text-[26px] font-bold leading-tight sm:text-[32px]" style={{ color: "#fff", letterSpacing: "-0.02em" }}>
              Your first quest is waiting.
            </p>
            <p className="mt-1.5 text-[14px] font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>
              Free to start · no credit card · 60 seconds
            </p>
          </div>
          <a
            href="/auth/signup"
            className="brutal-btn shrink-0 rounded-full px-8 py-4 text-[15px]"
            style={{ background: "#fff", color: "var(--accent)" }}
          >
            Start playing <ArrowRight size={16} strokeWidth={2.5} />
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
              <h4 className="text-[12px] font-bold uppercase tracking-widest text-ink-faint">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[14px] font-semibold text-ink-muted transition-colors hover:text-accent">
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
