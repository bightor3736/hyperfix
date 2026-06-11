"use client";
import { useState } from "react";
import { Check } from "lucide-react";

type Billing = "monthly" | "yearly";

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("yearly");

  const FREE_FEATURES = [
    "Unlimited tasks + Just Start flow",
    "AI task breakdown (5/month)",
    "Focus timer + 5-minute starts",
    "XP, 7 levels + daily quests",
    "Forgiving streak + 1 freeze/month",
    "Shareable profile card",
  ];

  const PRO_FEATURES = [
    "Unlimited AI task breakdowns",
    "5 streak freezes a month",
    "1.5× XP multiplier",
    "Premium profile themes",
    "Full stats, history & insights",
    "Priority access to new features",
  ];

  return (
    <section id="pricing" style={{ background: "#f5f5f7", padding: "120px 0" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="apple-label" style={{ color: "#7c3aed", marginBottom: 16 }}>Pricing</div>
          <h2 className="apple-headline-lg" style={{ color: "#1d1d1f", marginBottom: 20 }}>
            Free to play.<br />
            <span style={{ color: "#7c3aed" }}>More when you need it.</span>
          </h2>
          <p style={{ fontSize: 17, color: "#6e6e73", letterSpacing: "-0.009em", maxWidth: 420, margin: "0 auto 40px" }}>
            The full game is free. Power-Up adds the extras for when you&apos;re properly hooked.
          </p>

          {/* Toggle */}
          <div
            style={{
              display: "inline-flex",
              background: "rgba(0,0,0,0.06)",
              borderRadius: 9999,
              padding: 4,
              gap: 2,
            }}
            role="radiogroup"
          >
            {(["monthly", "yearly"] as Billing[]).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBilling(b)}
                style={{
                  height: 34,
                  padding: "0 18px",
                  borderRadius: 9999,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  background: billing === b ? "#fff" : "transparent",
                  color: billing === b ? "#1d1d1f" : "#6e6e73",
                  boxShadow: billing === b ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {b === "yearly" ? "Yearly · save 33%" : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ maxWidth: 840, margin: "0 auto" }}>
          {/* Free */}
          <div style={{ background: "#fff", borderRadius: 24, padding: 36, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#6e6e73", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 8 }}>Free Player</div>
            <div style={{ fontSize: 52, fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.035em", lineHeight: 1, marginBottom: 4 }}>$0</div>
            <div style={{ fontSize: 13, color: "#aeaeb2", marginBottom: 28 }}>forever</div>
            <a href="/auth/signup" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 48, borderRadius: 9999, background: "#1d1d1f", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none", marginBottom: 10 }}>
              Start free
            </a>
            <div style={{ fontSize: 12, color: "#aeaeb2", textAlign: "center", marginBottom: 28 }}>No credit card required</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {FREE_FEATURES.map((f) => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Check size={11} strokeWidth={3} color="#30d158" />
                  </div>
                  <span style={{ fontSize: 14, color: "#3a3a3c", lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Power-Up */}
          <div style={{ background: "#1d1d1f", borderRadius: 24, padding: 36, position: "relative", boxShadow: "0 8px 40px rgba(0,0,0,0.24), 0 2px 8px rgba(0,0,0,0.12)" }}>
            <div style={{ position: "absolute", top: -13, right: 24, padding: "5px 14px", background: "linear-gradient(135deg, #a78bfa, #7c3aed)", borderRadius: 9999, fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.02em" }}>
              ⚡ MOST POPULAR
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.50)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 8 }}>Power-Up</div>
            <div style={{ fontSize: 52, fontWeight: 800, color: "#fff", letterSpacing: "-0.035em", lineHeight: 1, marginBottom: 4 }}>
              {billing === "yearly" ? "$3.25" : "$5"}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.40)", marginBottom: 28 }}>
              per month{billing === "yearly" ? " · billed $39/year" : ""}
            </div>
            <a href="/auth/signup" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 48, borderRadius: 9999, background: "linear-gradient(135deg, #a78bfa, #7c3aed)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none", marginBottom: 10 }}>
              ⚡ Power up
            </a>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center", marginBottom: 28 }}>Cancel anytime · 30-day refund</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.40)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>Everything in Free, plus:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {PRO_FEATURES.map((f) => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(167,139,250,0.20)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Check size={11} strokeWidth={3} color="#a78bfa" />
                  </div>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
