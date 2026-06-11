"use client";
import { AppIcon } from "@/components/Logo";
import { ArrowRight } from "lucide-react";

const cols = [
  { title: "Product", links: [{ label: "How it works", href: "#features" }, { label: "Pricing", href: "#pricing" }, { label: "FAQ", href: "#faq" }] },
  { title: "Account", links: [{ label: "Sign up", href: "/auth/signup" }, { label: "Log in", href: "/auth/login" }] },
  { title: "Legal", links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/tos" }] },
];

const socials = [
  { label: "TikTok", href: "https://www.tiktok.com/@hyperfix.app" },
  { label: "Instagram", href: "https://www.instagram.com/hyperfix.app" },
];

export function Footer() {
  return (
    <footer>
      {/* Dark CTA band */}
      <div style={{ background: "#18181B", padding: "80px 0", textAlign: "center" }}>
        <div className="wrap">
          <h2 style={{ fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.10, marginBottom: 16 }}>
            Your first quest is waiting.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.50)", marginBottom: 36 }}>
            Free to start · no credit card · 60 seconds to set up
          </p>
          <a href="/auth/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 50, padding: "0 28px", borderRadius: 9999, background: "#fff", color: "#18181B", fontSize: 16, fontWeight: 600, textDecoration: "none" }}>
            Start playing <ArrowRight size={16} strokeWidth={2.5} />
          </a>
        </div>
      </div>

      {/* Link columns */}
      <div style={{ background: "#fff", borderTop: "1px solid #F4F4F5", padding: "56px 0 40px" }}>
        <div className="wrap">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10" style={{ marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <AppIcon size={26} />
                <span style={{ fontSize: 16, fontWeight: 600, color: "#18181B", letterSpacing: "-0.02em" }}>hyperfix</span>
              </div>
              <p style={{ fontSize: 13, color: "#A1A1AA", lineHeight: 1.6, maxWidth: 200 }}>
                Start the task you&apos;ve been avoiding. Built for the way ADHD actually works.
              </p>
              <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ padding: "5px 12px", background: "#F4F4F5", borderRadius: 9999, fontSize: 12, fontWeight: 600, color: "#71717A", textDecoration: "none" }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            {cols.map((col) => (
              <div key={col.title}>
                <h4 style={{ fontSize: 11, fontWeight: 600, color: "#A1A1AA", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 14 }}>
                  {col.title}
                </h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} style={{ fontSize: 14, color: "#52525B", textDecoration: "none" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#18181B")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#52525B")}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ paddingTop: 24, borderTop: "1px solid #F4F4F5", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontSize: 12, color: "#A1A1AA" }}>© 2026 Hyperfix · Built for brains that run hot.</p>
            <p style={{ fontSize: 12, color: "#A1A1AA" }}>Made for ADHD. No guilt. No shame.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
