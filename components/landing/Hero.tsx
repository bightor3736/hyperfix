"use client";
import { ArrowRight, CheckCircle2 } from "lucide-react";

function AppPreview() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        border: "1px solid #E4E4E7",
        boxShadow: "0 24px 64px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)",
        overflow: "hidden",
        width: "100%",
        maxWidth: 420,
      }}
    >
      {/* App header */}
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #F4F4F5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#A1A1AA", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>Wednesday</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#18181B", letterSpacing: "-0.02em" }}>Good morning</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ padding: "5px 10px", background: "#EDE9FE", borderRadius: 9999, fontSize: 12, fontWeight: 600, color: "#5B21B6" }}>⚡ 820 XP</div>
            <div style={{ padding: "5px 10px", background: "#FEE2E2", borderRadius: 9999, fontSize: 12, fontWeight: 600, color: "#DC2626" }}>🔥 14d</div>
          </div>
        </div>
        {/* XP bar */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: "#A1A1AA" }}>Level 4 · Properly Hooked</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#5B21B6" }}>820 / 1000</span>
          </div>
          <div style={{ height: 4, background: "#F4F4F5", borderRadius: 99 }}>
            <div style={{ width: "82%", height: "100%", borderRadius: 99, background: "#7C3AED" }} />
          </div>
        </div>
      </div>

      {/* Just Start card */}
      <div style={{ margin: 16, padding: "16px 18px", background: "#FAFAF8", borderRadius: 14, border: "1px solid #E4E4E7" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#7C3AED", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>Just Start</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#18181B", marginBottom: 14, letterSpacing: "-0.01em" }}>Reply to Dr. Williams email</div>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#71717A", marginBottom: 12 }}>AI broke it down:</div>
        {["Open Gmail", "Find the email", "Write one sentence"].map((step, i) => (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderTop: i === 0 ? "none" : "1px solid #F4F4F5" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#7C3AED", flexShrink: 0 }}>{i + 1}</div>
            <span style={{ fontSize: 13, color: "#3F3F46" }}>{step}</span>
          </div>
        ))}
        <button style={{ width: "100%", marginTop: 14, padding: "12px", background: "#18181B", borderRadius: 10, border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: "-0.01em" }}>
          Start · 5 minutes ⚡
        </button>
      </div>

      {/* Today list */}
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#A1A1AA", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>Today</div>
        {[
          { name: "Tax return", done: true },
          { name: "Reply to Dr. Williams", done: false },
          { name: "Gym bag to car", done: false },
        ].map((t, i) => (
          <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderTop: i === 0 ? "none" : "1px solid #F4F4F5" }}>
            <CheckCircle2 size={16} style={{ color: t.done ? "#22C55E" : "#D4D4D8", flexShrink: 0 }} strokeWidth={2.5} />
            <span style={{ fontSize: 14, fontWeight: 500, color: t.done ? "#A1A1AA" : "#18181B", textDecoration: t.done ? "line-through" : "none" }}>{t.name}</span>
            {!t.done && <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: "#7C3AED" }}>+40 XP</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 56, overflow: "hidden" }}>
      <div className="wrap" style={{ paddingTop: 64, paddingBottom: 80 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div style={{ maxWidth: 520 }}>
            <div className="chip" style={{ marginBottom: 24 }}>
              Built for ADHD
            </div>

            <h1 className="display-xl" style={{ marginBottom: 22 }}>
              Start the task<br />you&apos;ve been<br />avoiding.
            </h1>

            <p className="body-lg" style={{ marginBottom: 36, maxWidth: 420 }}>
              Name it. Do 5 minutes. Earn XP for starting — not for finishing. Forgiving streaks that survive the hard weeks.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }}>
              <a href="/auth/signup" className="btn btn-dark" style={{ height: 50, fontSize: 16, paddingLeft: 28, paddingRight: 28 }}>
                Start free
                <ArrowRight size={16} strokeWidth={2.5} />
              </a>
              <a href="#features" className="btn btn-outline" style={{ height: 50, fontSize: 16 }}>
                See how it works
              </a>
            </div>

            {/* Proof chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                { icon: "✓", text: "Free to start" },
                { icon: "✓", text: "No credit card" },
                { icon: "✓", text: "2,400+ users" },
              ].map((p) => (
                <div key={p.text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 500, color: "#71717A" }}>
                  <span style={{ color: "#22C55E", fontWeight: 700 }}>{p.icon}</span>
                  {p.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: flat app preview */}
          <div className="flex justify-center lg:justify-end">
            <AppPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
