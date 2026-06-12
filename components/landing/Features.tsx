import { Zap, Flame, Snowflake, Brain, Timer, Star } from "lucide-react";

const features = [
  {
    icon: <Brain size={20} strokeWidth={2} />,
    title: "AI breaks it down",
    desc: "Type the task you're dreading. The AI turns it into 3 tiny steps so small you can't say no.",
  },
  {
    icon: <Zap size={20} strokeWidth={2} />,
    title: "XP for starting",
    desc: "The reward fires when you begin — not when you finish. Starting is the hard part. We celebrate that.",
  },
  {
    icon: <Timer size={20} strokeWidth={2} />,
    title: "5-minute timer",
    desc: "Do five minutes, then you're allowed to stop. You usually won't want to. That's the whole trick.",
  },
  {
    icon: <Flame size={20} strokeWidth={2} />,
    title: "Forgiving streaks",
    desc: "Miss a day and a freeze kicks in automatically. No reset to zero, no shame. ADHD has hard weeks.",
  },
  {
    icon: <Star size={20} strokeWidth={2} />,
    title: "Daily quests",
    desc: "Fresh goals every morning. Small, achievable, with XP attached. Something to show up for.",
  },
  {
    icon: <Snowflake size={20} strokeWidth={2} />,
    title: "Streak freezes",
    desc: "Built-in miss-day insurance. Skip a day and your streak survives. Free players get one a month.",
  },
];

const steps = [
  { n: "01", title: "Name it", body: "Type the thing you've been avoiding. Getting it out of your head is the first crack in the wall." },
  { n: "02", title: "Shrink it", body: "Pick the smallest possible first move. The AI helps. Do just 5 minutes — then you can stop." },
  { n: "03", title: "Earn XP", body: "The moment you start, XP drops. Every start is a real win. That's what brings you back tomorrow." },
  { n: "04", title: "Keep going", body: "Your streak has freeze insurance. Miss a day — it survives. No guilt, no reset to zero." },
];

export function Features() {
  return (
    <div id="features">
      {/* Feature grid */}
      <section style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "100px 0" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="eyebrow" style={{ marginBottom: 14, color: "rgba(255,255,255,0.35)" }}>Features</div>
            <h2 className="display-lg" style={{ marginBottom: 16 }}>Built for how ADHD actually works.</h2>
            <p className="body-lg" style={{ maxWidth: 460, margin: "0 auto", color: "rgba(255,255,255,0.55)" }}>
              Not another productivity system. A game that works with your brain, not against it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title}>
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#ffffff", flexShrink: 0, marginBottom: 16,
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", letterSpacing: "-0.012em", marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — numbered steps */}
      <section style={{ background: "#0a0a0a", padding: "100px 0" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="eyebrow" style={{ marginBottom: 14, color: "rgba(255,255,255,0.35)" }}>The loop</div>
            <h2 className="display-lg">Four steps, every day.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div
                key={s.n}
                style={{
                  padding: "28px 24px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.35)", marginBottom: 12, letterSpacing: "0.01em" }}>{s.n}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.015em", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
