"use client";
import { AppIcon } from "@/components/Logo";

const COLS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how" },
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Leaderboard", href: "/leaderboard" },
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
    <footer style={{ background: "var(--bg)", borderTop: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "56px 24px 36px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 40,
            marginBottom: 44,
          }}
        >
          {/* brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
              <AppIcon size={26} />
              <span style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.03em" }}>hyperfix</span>
            </div>
            <p style={{ fontSize: 14, color: "var(--ink-muted)", lineHeight: 1.6, maxWidth: 220 }}>
              Start small, that counts. The ADHD app that rewards beginning.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-faint)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      style={{ fontSize: 14, color: "var(--ink-muted)", textDecoration: "none", transition: "color 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-muted)")}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            paddingTop: 24,
            borderTop: "1px solid var(--line)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <p style={{ fontSize: 13, color: "var(--ink-faint)" }}>© 2026 Hyperfix · Made for brains that run hot.</p>
          <p style={{ fontSize: 13, color: "var(--ink-faint)" }}>No guilt. No shame. Just start.</p>
        </div>
      </div>
    </footer>
  );
}
