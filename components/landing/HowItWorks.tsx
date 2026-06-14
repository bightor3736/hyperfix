"use client";
import { motion } from "framer-motion";
import { PenLine, Timer, Zap } from "lucide-react";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const STEPS = [
  {
    icon: PenLine,
    n: "01",
    title: "Name the thing",
    body: "Type whatever you've been avoiding. The AI shrinks it to a first move so small your brain can't say no.",
  },
  {
    icon: Timer,
    n: "02",
    title: "Do five minutes",
    body: "Start a tiny timer. The deal: do five minutes, then you're allowed to stop. (You usually won't want to.)",
  },
  {
    icon: Zap,
    n: "03",
    title: "Earn XP for starting",
    body: "The moment you begin, you score. Levels, gentle quests, and streaks that survive your hard weeks.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" style={{ padding: "104px 24px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <motion.p {...fadeUp(0)} className="eyebrow" style={{ marginBottom: 14 }}>
          How it works
        </motion.p>
        <motion.h2
          {...fadeUp(0.05)}
          style={{
            fontSize: "clamp(28px, 4.2vw, 46px)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
            maxWidth: 640,
            lineHeight: 1.08,
          }}
        >
          The whole point is to{" "}
          <span style={{ fontFamily: "var(--font-serif-display, serif)", fontStyle: "italic", fontWeight: 400 }}>
            begin.
          </span>
        </motion.h2>

        <div
          style={{
            marginTop: 56,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              {...fadeUp(0.1 * i)}
              style={{
                background: "var(--bg-white)",
                border: "1px solid var(--line)",
                borderRadius: 20,
                padding: 28,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                <span
                  style={{
                    width: 46, height: 46, borderRadius: 13,
                    background: "var(--accent-soft)", color: "var(--accent)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <s.icon size={21} strokeWidth={2} />
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-faint)", letterSpacing: "0.04em" }}>
                  {s.n}
                </span>
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 600, color: "var(--ink)", marginBottom: 8, letterSpacing: "-0.02em" }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-3)" }}>{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
