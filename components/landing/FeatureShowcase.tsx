"use client";
import React from "react";
import { IPhone } from "@/components/devices/iPhone";
import { Zap, Flame, Snowflake, Brain, Timer, Trophy, Star } from "lucide-react";

interface FeaturePoint {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface ShowcaseProps {
  label: string;
  headline: string;
  sub: string;
  points: FeaturePoint[];
  phoneContent: React.ReactNode;
  flip?: boolean;
  dark?: boolean;
}

function ShowcaseSection({ label, headline, sub, points, phoneContent, flip = false, dark = false }: ShowcaseProps) {
  const textColor = dark ? "#fff" : "#1d1d1f";
  const subColor = dark ? "rgba(235,235,245,0.55)" : "#6e6e73";
  const bg = dark ? "#000" : "#f5f5f7";
  const iconBg = dark ? "rgba(167,139,250,0.15)" : "rgba(124,58,237,0.08)";
  const iconColor = "#a78bfa";

  return (
    <section style={{ background: bg, padding: "80px 0", overflow: "hidden" }}>
      <div className="container-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className={flip ? "md:order-2" : "md:order-1"}>
            <div className="apple-label" style={{ color: "#a78bfa", marginBottom: 18 }}>{label}</div>
            <h2 className="apple-headline-md" style={{ color: textColor, marginBottom: 20, lineHeight: 1.10, fontSize: "clamp(26px, 3.5vw, 40px)" }}>{headline}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: subColor, marginBottom: 36, letterSpacing: "-0.009em" }}>{sub}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {points.map((p) => (
                <div key={p.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: iconColor }}>
                    {p.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: textColor, letterSpacing: "-0.012em", marginBottom: 2 }}>{p.title}</div>
                    <div style={{ fontSize: 14, color: subColor, lineHeight: 1.55 }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={`flex justify-center ${flip ? "md:order-1" : "md:order-2"}`}>
            <IPhone scale={0.78}>{phoneContent}</IPhone>
          </div>
        </div>
      </div>
    </section>
  );
}

function JustStartPhone() {
  return (
    <div style={{ background: "#111", height: "100%", paddingTop: 56 }}>
      <div style={{ padding: "0 18px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Just Start</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>What are you avoiding?</div>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.05)", borderRadius: 14, border: "1px solid rgba(167,139,250,0.3)", marginBottom: 16, fontSize: 15, color: "#fff", fontWeight: 500 }}>
          Reply to Dr. Williams email
          <span style={{ display: "block", width: 2, height: 18, background: "#a78bfa", marginTop: 2, borderRadius: 1 }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 10 }}>AI breaks it down</div>
          {["Open Gmail", "Find the email", "Write one sentence"].map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(167,139,250,0.20)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#a78bfa" }}>{i+1}</div>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.80)" }}>{step}</span>
            </div>
          ))}
        </div>
        <button style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", borderRadius: 14, border: "none", color: "#fff", fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span>⚡</span> Start now · 5 mins
        </button>
      </div>
    </div>
  );
}

function XPPhone() {
  return (
    <div style={{ background: "#0a0a0a", height: "100%", paddingTop: 56, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 20px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>⚡</div>
        <div style={{ fontSize: 48, fontWeight: 800, color: "#a78bfa", letterSpacing: "-0.03em", lineHeight: 1 }}>+120</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginTop: 6 }}>XP earned</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.40)", marginTop: 4 }}>For starting — not for finishing</div>
      </div>
      <div style={{ width: "100%", padding: "16px", background: "rgba(167,139,250,0.10)", border: "1px solid rgba(167,139,250,0.20)", borderRadius: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Level 4 · Properly Hooked</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa" }}>820 XP</span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99 }}>
          <div style={{ width: "82%", height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #7c3aed, #a78bfa)" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, width: "100%" }}>
        {[{ emoji: "🎯", label: "7 levels" }, { emoji: "🏆", label: "Badges" }, { emoji: "💜", label: "No guilt" }].map((i) => (
          <div key={i.label} style={{ flex: 1, padding: "12px 8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{i.emoji}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.50)", fontWeight: 500 }}>{i.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StreakPhone() {
  return (
    <div style={{ background: "#111", height: "100%", paddingTop: 56, padding: "56px 18px 18px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 40, fontWeight: 800, color: "#ff375f", letterSpacing: "-0.03em" }}>14</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.60)" }}>day streak 🔥</span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.40)" }}>Your longest run ever was 21 days</div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {["M","T","W","T","F","S","S","M","T","W","T","F","S","S"].map((day, i) => {
          const missed = i === 3;
          const today = i === 13;
          return (
            <div key={i} style={{ width: 32, height: 40, borderRadius: 10, background: missed ? "rgba(90,200,245,0.15)" : today ? "rgba(255,55,95,0.20)" : "rgba(255,55,95,0.12)", border: missed ? "1px solid rgba(90,200,245,0.30)" : today ? "1.5px solid rgba(255,55,95,0.60)" : "1px solid rgba(255,55,95,0.20)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: missed ? "#5ac8f5" : "#ff375f" }}>{missed ? "❄" : "🔥"}</span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{day}</span>
            </div>
          );
        })}
      </div>
      <div style={{ padding: "14px 16px", background: "rgba(90,200,245,0.10)", border: "1px solid rgba(90,200,245,0.20)", borderRadius: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 24 }}>❄️</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#5ac8f5" }}>Freeze used — day 4</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.40)", marginTop: 2 }}>Your streak survived. 1 freeze left this month.</div>
        </div>
      </div>
    </div>
  );
}

export function FeatureShowcase() {
  return (
    <div id="features">
      <ShowcaseSection
        label="Just Start"
        headline="Break the wall in 10 seconds."
        sub="Type the task you're dreading. Our AI breaks it into 3 micro-steps so small you can't say no. Then you do just 5 minutes — and usually don't stop."
        points={[
          { icon: <Brain size={18} />, title: "AI task breakdown", desc: "Instantly splits any task into the smallest possible first move." },
          { icon: <Timer size={18} />, title: "5-minute timer", desc: "The deal: do five minutes, then you're allowed to quit. You usually won't." },
          { icon: <Zap size={18} />, title: "Instant XP on start", desc: "The reward fires the moment you begin — not when you finish." },
        ]}
        phoneContent={<JustStartPhone />}
        dark={false}
        flip={false}
      />

      <ShowcaseSection
        label="XP & Levels"
        headline="Wins for showing up."
        sub="Seven levels from Mildly Curious to Clinically Obsessed. XP drops the moment you start — because for ADHD brains, starting is the hard part."
        points={[
          { icon: <Zap size={18} />, title: "XP for starting, not finishing", desc: "Real reward every time you cross the line, not just when you complete." },
          { icon: <Trophy size={18} />, title: "7 levels + badges", desc: "A progression system that celebrates the way ADHD actually works." },
          { icon: <Star size={18} />, title: "Daily quests", desc: "Small achievable goals every day — fresh dopamine, every morning." },
        ]}
        phoneContent={<XPPhone />}
        dark={true}
        flip={true}
      />

      <ShowcaseSection
        label="Streaks"
        headline="Streaks that survive the hard weeks."
        sub="ADHD isn't linear. Your streak has freeze insurance built in. Miss a day — a freeze kicks in automatically. No resets to zero, no shame."
        points={[
          { icon: <Flame size={18} />, title: "Forgiving streaks", desc: "Miss a day and a freeze activates automatically — no action needed." },
          { icon: <Snowflake size={18} />, title: "Freeze insurance", desc: "Free players get 1 freeze/month. Power-Up gets 5. Your streak survives." },
          { icon: <Brain size={18} />, title: "No guilt messaging", desc: "We never tell you 'you lost your streak.' The app absorbs the blame." },
        ]}
        phoneContent={<StreakPhone />}
        dark={false}
        flip={false}
      />
    </div>
  );
}
