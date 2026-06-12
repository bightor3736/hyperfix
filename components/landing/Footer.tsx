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
    <footer style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      {/* CTA band */}
      <div style={{ padding: "80px 0", textAlign: "center" }}>
        <div className="wrap">
          <h2 style={{ fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.025em", lineHeight: 1.10, marginBottom: 16 }}>
            Your first quest is{" "}
            <span style={{ fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)", fontStyle: "italic", fontWeight: 400 }}>waiting.</span>
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.50)", marginBottom: 36 }}>
            Free to start · no credit card · 60 seconds to set up
          </p>
          <a href="/auth/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 50, padding: "0 28px", borderRadius: 9999, background: "#ffffff", color: "#000000", fontSize: 16, fontWeight: 600, textDecoration: "none" }}>
            Start playing <ArrowRight size={16} strokeWidth={2.5} />
          </a>
        </div>
      </div>

      {/* Link columns */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "56px 0 40px" }}>
        <div className="wrap">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10" style={{ marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <AppIcon size={26} />
                <span style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", letterSpacing: "-0.02em" }}>hyperfix</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.40)", lineHeight: 1.6, maxWidth: 200 }}>
                Start the task you&apos;ve been avoiding. Built for the way ADHD actually works.
              </p>
              <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ padding: "5px 12px", background: "rgba(255,255,255,0.06)", borderRadius: 9999, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            {cols.map((col) => (
              <div key={col.title}>
                <h4 style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.40)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 14 }}>
                  {col.title}
                </h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.30)" }}>© 2026 Hyperfix · Built for brains that run hot.</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.30)" }}>Made for ADHD. No guilt. No shame.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
