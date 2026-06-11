"use client";
import { MacBook } from "@/components/devices/MacBook";

function DashboardPreview() {
  return (
    <div style={{ display: "flex", height: "100%", background: "#0d0d0f", fontFamily: "var(--font-sys)" }}>
      {/* Sidebar */}
      <div style={{ width: 200, background: "#111113", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "16px 0", flexShrink: 0 }}>
        <div style={{ padding: "8px 16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#a78bfa,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>⚡</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>hyperfix</span>
          </div>
        </div>
        {[
          { icon: "🏠", label: "Home", active: true },
          { icon: "⚡", label: "Fixations" },
          { icon: "🎯", label: "Quests" },
          { icon: "🔥", label: "Streak" },
          { icon: "📊", label: "Stats" },
          { icon: "⚙️", label: "Settings" },
        ].map((item) => (
          <div key={item.label} style={{ padding: "7px 12px", margin: "1px 8px", borderRadius: 8, background: item.active ? "rgba(167,139,250,0.15)" : "transparent", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <span style={{ fontSize: 13 }}>{item.icon}</span>
            <span style={{ fontSize: 13, fontWeight: item.active ? 600 : 400, color: item.active ? "#a78bfa" : "rgba(255,255,255,0.55)" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>Wednesday, June 11</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Good morning 👋</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ padding: "6px 14px", background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: 9999, fontSize: 12, fontWeight: 700, color: "#a78bfa" }}>⚡ 820 XP</div>
            <div style={{ padding: "6px 14px", background: "rgba(255,55,95,0.15)", border: "1px solid rgba(255,55,95,0.25)", borderRadius: 9999, fontSize: 12, fontWeight: 700, color: "#ff375f" }}>🔥 14d</div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Tasks started", value: "8", emoji: "⚡", color: "#a78bfa" },
            { label: "Focus time", value: "52m", emoji: "⏱", color: "#5ac8f5" },
            { label: "Streak", value: "14 days", emoji: "🔥", color: "#ff375f" },
          ].map((s) => (
            <div key={s.label} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{s.emoji}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Active fixations */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.40)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 10 }}>Active fixations</div>
          {[
            { name: "Tax return 2025", intensity: 3, status: "active", days: 14 },
            { name: "Reply to Dr. Williams", intensity: 2, status: "active", days: 2 },
            { name: "Clean the kitchen", intensity: 1, status: "queued", days: 5 },
          ].map((f) => (
            <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: f.status === "active" ? "#30d158" : "#aeaeb2", flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>{f.name}</span>
              <div style={{ display: "flex", gap: 2 }}>
                {[1,2,3].map((n) => <div key={n} style={{ width: 6, height: 6, borderRadius: 2, background: n <= f.intensity ? "#a78bfa" : "rgba(255,255,255,0.10)" }} />)}
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.30)" }}>{f.days}d</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MacSection() {
  return (
    <section style={{ background: "#060608", padding: "120px 0", overflow: "hidden" }}>
      <div className="container" style={{ marginBottom: 64, textAlign: "center" }}>
        <div className="apple-label" style={{ marginBottom: 16 }}>Dashboard</div>
        <h2 className="apple-headline-lg" style={{ color: "#fff", marginBottom: 20 }}>
          Your whole brain,<br />
          <span className="gradient-text">on one screen.</span>
        </h2>
        <p className="apple-body" style={{ maxWidth: 480, margin: "0 auto", color: "rgba(235,235,245,0.55)" }}>
          See your streak, XP, active fixations and daily quests in a clean dashboard that&apos;s actually calming to look at.
        </p>
      </div>
      <div style={{ overflowX: "auto", padding: "0 24px", display: "flex", justifyContent: "center" }}>
        <MacBook scale={0.85}>
          <DashboardPreview />
        </MacBook>
      </div>
    </section>
  );
}
