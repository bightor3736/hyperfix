"use client";
import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4";

const FEATURES = [
  {
    title: "Just Start Flow",
    description:
      "Name the task, pick 5 minutes, hit go. The AI suggests micro-steps so tiny your brain can't say no.",
  },
  {
    title: "XP & Levels",
    description:
      "XP drops the moment you start — not when you finish. Seven levels, daily quests, real momentum.",
  },
  {
    title: "AI Breakdown",
    description:
      "Any task becomes three absurdly small steps. From 'do my taxes' to 'open the folder'.",
  },
  {
    title: "Forgiving Streaks",
    description:
      "Streak freezes activate automatically on missed days. No reset to zero, no shame spiral.",
  },
];

export function Solution() {
  return (
    <section
      id="features"
      style={{
        padding: "128px 24px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <motion.p
          {...fadeUp(0)}
          style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "3px",
            textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
            marginBottom: 16,
          }}
        >
          SOLUTION
        </motion.p>

        <motion.h2
          {...fadeUp(0.1)}
          style={{
            fontSize: "clamp(28px, 5vw, 60px)",
            fontWeight: 500,
            letterSpacing: "-1.5px",
            color: "#ffffff",
            marginBottom: 64,
            lineHeight: 1.1,
          }}
        >
          The platform for{" "}
          <span
            style={{
              fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            tasks that get done
          </span>
        </motion.h2>

        {/* Wide video */}
        <motion.div {...fadeUp(0.2)} style={{ marginBottom: 64 }}>
          <video
            style={{
              width: "100%", borderRadius: 16,
              aspectRatio: "3/1", objectFit: "cover",
            }}
            src={VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
          />
        </motion.div>

        {/* Feature grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 32,
          }}
        >
          {FEATURES.map(({ title, description }, i) => (
            <motion.div key={title} {...fadeUp(0.1 * i)}>
              <p style={{ fontWeight: 600, fontSize: 15, color: "#ffffff", marginBottom: 8 }}>
                {title}
              </p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
