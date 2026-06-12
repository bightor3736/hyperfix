"use client";
import { useState } from "react";
import { Check } from "lucide-react";

type Billing = "monthly" | "yearly";

const FREE = [
  "Unlimited tasks + Just Start flow",
  "AI task breakdown (5 / month)",
  "Focus timer + 5-minute starts",
  "XP, 7 levels, daily quests",
  "Forgiving streak + 1 freeze / month",
  "Shareable profile card",
];

const PRO = [
  "Unlimited AI task breakdowns",
  "5 streak freezes / month",
  "1.5× XP multiplier",
  "Premium profile themes",
  "Full stats + history",
  "Priority access to new features",
];

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("yearly");

  return (
    <section id="pricing" style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "100px 0" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="eyebrow" style={{ marginBottom: 14, color: "rgba(255,255,255,0.35)" }}>Pricing</div>
          <h2 className="display-lg" style={{ marginBottom: 16 }}>Free to play.</h2>
          <p className="body-lg" style={{ color: "rgba(255,255,255,0.55)", maxWidth: 380, margin: "0 auto 32px" }}>
            The full game is free forever. Power-Up adds extras for when you&apos;re properly hooked.
          </p>
          {/* Toggle */}
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.06)", borderRadius: 9999, padding: 4, gap: 2 }}>
            {(["monthly", "yearly"] as Billing[]).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBilling(b)}
                style={{
                  height: 32,
                  padding: "0 16px",
                  borderRadius: 9999,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  background: billing === b ? "rgba(255,255,255,0.12)" : "transparent",
                  color: billing === b ? "#ffffff" : "rgba(255,255,255,0.45)",
                  transition: "all 0.15s",
                }}
              >
                {b === "yearly" ? "Yearly — save 33%" : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Free */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Free Player</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 48, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.035em", lineHeight: 1 }}>$0</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 24 }}>Forever</div>
            <a href="/auth/signup" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 46, borderRadius: 9999, background: "#ffffff", color: "#000000", fontSize: 15, fontWeight: 600, textDecoration: "none", marginBottom: 8 }}>
              Start free
            </a>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center", marginBottom: 28 }}>No credit card required</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {FREE.map((f) => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Check size={14} strokeWidth={2.5} style={{ color: "rgba(255,255,255,0.7)", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Power-Up */}
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: 32, position: "relative" }}>
            <div style={{ position: "absolute", top: -12, right: 20, padding: "4px 12px", background: "rgba(255,255,255,0.9)", borderRadius: 9999, fontSize: 11, fontWeight: 700, color: "#000000", letterSpacing: "0.02em" }}>
              MOST POPULAR
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Power-Up</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 48, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.035em", lineHeight: 1 }}>{billing === "yearly" ? "$3.25" : "$5"}</span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>/ mo</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 24 }}>{billing === "yearly" ? "Billed $39 / year" : "Billed monthly"}</div>
            <a href="/auth/signup" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 46, borderRadius: 9999, background: "#ffffff", color: "#000000", fontSize: 15, fontWeight: 600, textDecoration: "none", marginBottom: 8 }}>
              Get Power-Up
            </a>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.30)", textAlign: "center", marginBottom: 28 }}>Cancel anytime · 30-day refund</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>Everything in Free, plus:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {PRO.map((f) => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Check size={14} strokeWidth={2.5} style={{ color: "#ffffff", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
