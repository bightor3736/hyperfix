"use client";
import { motion } from "framer-motion";
import { Wand2, Trophy, HeartHandshake, Sparkles } from "lucide-react";
import { DashboardDemo } from "./demo/DashboardDemo";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const FEATURES = [
  { icon: Wand2, title: "AI breakdown", body: "Any task becomes three absurdly small steps. From “do my taxes” to “open the folder.”" },
  { icon: Trophy, title: "XP & levels", body: "Score the second you start. Climb levels, take on gentle daily quests, feel the momentum." },
  { icon: HeartHandshake, title: "Forgiving streaks", body: "Freezes kick in automatically on the days you miss. No reset to zero, no shame spiral." },
  { icon: Sparkles, title: "Just Start flow", body: "Name it, pick five minutes, go. The painkiller for task paralysis — designed around starting." },
];

export function Features() {
  return (
    <section id="features" style={{ padding: "104px 24px", background: "var(--bg-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <motion.p {...fadeUp(0)} className="eyebrow" style={{ marginBottom: 14 }}>
          What you get
        </motion.p>
        <motion.h2
          {...fadeUp(0.05)}
          style={{
            fontSize: "clamp(28px, 4.2vw, 46px)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
            maxWidth: 680,
            lineHeight: 1.08,
          }}
        >
          A task app that works{" "}
          <span style={{ fontFamily: "var(--font-serif-display, serif)", fontStyle: "italic", fontWeight: 400 }}>
            with
          </span>{" "}
          your brain.
        </motion.h2>

        {/* live dashboard demo */}
        <motion.div {...fadeUp(0.1)} style={{ marginTop: 48 }}>
          <DashboardDemo />
        </motion.div>

        {/* feature cards */}
        <div
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} {...fadeUp(0.06 * i)} style={{ padding: 4 }}>
              <span
                style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: "var(--bg-white)", border: "1px solid var(--line)",
                  color: "var(--accent)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <f.icon size={20} strokeWidth={2} />
              </span>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 6, letterSpacing: "-0.01em" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-3)" }}>{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
