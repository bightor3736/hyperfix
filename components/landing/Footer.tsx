"use client";
import { AppIcon } from "@/components/Logo";
import { ArrowRight } from "lucide-react";

const cols = [
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
      { label: "Dashboard", href: "/dashboard" },
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
    <footer style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      {/* CTA band */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "80px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.08, marginBottom: 20 }}>
            Your first quest is waiting.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.50)", letterSpacing: "-0.009em", marginBottom: 36 }}>
            Free to start · no credit card · 60 seconds
          </p>
          <a
            href="/auth/signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              height: 52,
              padding: "0 32px",
              borderRadius: 9999,
              background: "#fff",
              color: "#000",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.009em",
              textDecoration: "none",
            }}
          >
            Start playing <ArrowRight size={17} strokeWidth={2} />
          </a>
        </div>
      </div>

      {/* Links */}
      <div className="container" style={{ padding: "64px 24px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <AppIcon size={30} />
              <span style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>hyperfix</span>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.40)", lineHeight: 1.65, maxWidth: 240 }}>
              Start the task you&apos;ve been avoiding. Built for the way ADHD actually works.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: "6px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9999, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.60)", textDecoration: "none" }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 16 }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", textDecoration: "none", letterSpacing: "-0.009em", transition: "color 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 64, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>© 2026 Hyperfix · Built for brains that run hot.</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Made for ADHD. No guilt. No shame. Just starts.</p>
        </div>
      </div>
    </footer>
  );
}
