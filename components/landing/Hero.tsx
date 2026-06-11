"use client";
import { ArrowRight, Zap } from "lucide-react";
import { IPhone } from "@/components/devices/iPhone";

function HeroPhone() {
  return (
    <IPhone scale={0.85}>
      {/* App UI inside the phone */}
      <div style={{ background: "#111", height: "100%", padding: "56px 0 0" }}>
        {/* Header */}
        <div style={{ padding: "0 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Daily Quest</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Good morning 👋</div>
        </div>

        {/* XP bar */}
        <div style={{ padding: "14px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>Level 4 · Properly Hooked</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa" }}>820 / 1000 XP</span>
          </div>
          <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 99 }}>
            <div style={{ width: "82%", height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #7c3aed, #a78bfa)" }} />
          </div>
        </div>

        {/* Task card */}
        <div style={{ margin: "8px 14px 12px", padding: "16px", background: "rgba(167,139,250,0.12)", borderRadius: 18, border: "1px solid rgba(167,139,250,0.2)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#a78bfa", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>Just Start</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10, letterSpacing: "-0.018em", lineHeight: 1.3 }}>Reply to Dr. Williams email</div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, padding: "10px 14px", background: "rgba(255,255,255,0.06)", borderRadius: 12, fontSize: 12, color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}>Open Gmail</div>
            <div style={{ flex: 1, padding: "10px 14px", background: "#7c3aed", borderRadius: 12, fontSize: 12, fontWeight: 700, color: "#fff", textAlign: "center" }}>Start ⚡</div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", margin: "0 14px", gap: 8 }}>
          {[
            { icon: "🔥", label: "Streak", value: "14d" },
            { icon: "⚡", label: "XP today", value: "+120" },
            { icon: "✓", label: "Tasks", value: "3 done" },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, padding: "12px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quest items */}
        <div style={{ margin: "12px 14px 0" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 10 }}>Today</div>
          {[
            { name: "Tax return", xp: 50, done: true },
            { name: "Gym bag → car", xp: 30, done: false },
            { name: "Call dentist", xp: 40, done: false },
          ].map((t) => (
            <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: t.done ? "#30d158" : "rgba(255,255,255,0.1)", border: t.done ? "none" : "1.5px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {t.done && <span style={{ fontSize: 10, color: "#fff" }}>✓</span>}
              </div>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: t.done ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.85)", textDecoration: t.done ? "line-through" : "none" }}>{t.name}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa" }}>+{t.xp}</span>
            </div>
          ))}
        </div>
      </div>
    </IPhone>
  );
}

export function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#000",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        paddingTop: 52,
      }}
    >
      {/* Purple glow */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 600,
          background: "radial-gradient(ellipse at center, rgba(124,58,237,0.28) 0%, rgba(124,58,237,0.08) 45%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Grid lines (subtle) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      <div className="container-lg" style={{ padding: "80px 24px", position: "relative", zIndex: 1 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div style={{ maxWidth: 560 }}>
            <div className="feature-pill" style={{ marginBottom: 24 }}>
              <Zap size={11} strokeWidth={2.5} />
              Built for ADHD brains
            </div>

            <h1 className="apple-headline-xl" style={{ marginBottom: 24, fontSize: "clamp(38px, 7vw, 96px)" }}>
              Start the task<br />
              <span className="gradient-text">you&apos;ve been avoiding.</span>
            </h1>

            <p style={{ fontSize: "clamp(16px, 2.5vw, 19px)", lineHeight: 1.6, color: "rgba(235,235,245,0.60)", letterSpacing: "-0.009em", marginBottom: 40, maxWidth: 440 }}>
              Name it, do 5 minutes, earn XP for starting — not for being perfect. Forgiving streaks that survive bad weeks. Free to start.
            </p>

            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 40 }}>
              <a href="/auth/signup" className="btn-white" style={{ height: 52, fontSize: 17, paddingLeft: 28, paddingRight: 28 }}>
                Start free
                <ArrowRight size={17} strokeWidth={2} />
              </a>
              <a href="#features" className="btn-ghost-dark" style={{ height: 52, fontSize: 17, paddingLeft: 24, paddingRight: 24 }}>
                See how it works
              </a>
            </div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex" }}>
                {["#ff6b6b", "#4ecdc4", "#a78bfa", "#ffd93d", "#6bcf7f"].map((c, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: "2px solid #000", marginLeft: i > 0 ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>
                    {["😮", "🧠", "⚡", "🔥", "✨"][i]}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 14, color: "rgba(235,235,245,0.50)", letterSpacing: "-0.009em" }}>
                <strong style={{ color: "#fff" }}>2,400+</strong> ADHD brains already playing
              </span>
            </div>
          </div>

          {/* Right: Phone */}
          <div className="flex justify-center" style={{ position: "relative" }}>
            {/* Floating badges */}
            <div
              style={{
                position: "absolute",
                top: 40,
                right: -20,
                zIndex: 10,
                padding: "10px 14px",
                background: "rgba(30,215,96,0.15)",
                border: "1px solid rgba(48,209,88,0.30)",
                borderRadius: 14,
                backdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 18 }}>🔥</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#30d158" }}>14-day streak</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Survived a rough week</div>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                bottom: 80,
                left: -30,
                zIndex: 10,
                padding: "10px 14px",
                background: "rgba(167,139,250,0.15)",
                border: "1px solid rgba(167,139,250,0.30)",
                borderRadius: 14,
                backdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 18 }}>⚡</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa" }}>+120 XP earned</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Just for starting</div>
              </div>
            </div>

            <HeroPhone />
          </div>
        </div>
      </div>
    </section>
  );
}
