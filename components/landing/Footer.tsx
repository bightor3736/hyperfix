"use client";
import { AppIcon } from "@/components/Logo";
import { ArrowRight } from "lucide-react";

const COLS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#features" },
      { label: "See how it works", href: "#" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign up", href: "/auth/signup" },
      { label: "Log in", href: "/auth/login" },
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

export function Footer() {
  return (
    <footer style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      {/* CTA band */}
      <div style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(28px,4.5vw,52px)",
              fontWeight: 500,
              color: "#ffffff",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Your first quest is{" "}
            <span
              style={{
                fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              waiting.
            </span>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.40)", marginBottom: 36 }}>
            Free to start · no credit card · 60 seconds to set up
          </p>
          <a
            href="/auth/signup"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              height: 50, padding: "0 28px", borderRadius: 9999,
              background: "#ffffff", color: "#000000",
              fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}
          >
            Start playing <ArrowRight size={16} strokeWidth={2.5} />
          </a>
        </div>
      </div>

      {/* Link section */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "48px 32px 32px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 40, marginBottom: 40,
            }}
          >
            {/* Brand column */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <AppIcon size={22} />
                <span style={{ fontSize: 15, fontWeight: 600, color: "#ffffff", letterSpacing: "-0.02em" }}>
                  hyperfix
                </span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, maxWidth: 200 }}>
                Start the task you&apos;ve been avoiding. Built for the way ADHD actually works.
              </p>
            </div>
            {/* Link columns */}
            {COLS.map((col) => (
              <div key={col.title}>
                <h4
                  style={{
                    fontSize: 11, fontWeight: 600,
                    color: "rgba(255,255,255,0.30)",
                    letterSpacing: "0.07em", textTransform: "uppercase",
                    marginBottom: 14,
                  }}
                >
                  {col.title}
                </h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        style={{ fontSize: 14, color: "rgba(255,255,255,0.50)", textDecoration: "none", transition: "color 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.50)")}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Bottom row */}
          <div
            style={{
              paddingTop: 24,
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex", justifyContent: "space-between",
              flexWrap: "wrap", gap: 8,
            }}
          >
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
              © 2026 Hyperfix · Built for brains that run hot.
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
              Made for ADHD. No guilt. No shame.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
