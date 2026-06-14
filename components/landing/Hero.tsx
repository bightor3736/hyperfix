"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AmbientBackdrop } from "./demo/AmbientBackdrop";
import { JustStartDemo } from "./demo/JustStartDemo";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export function Hero() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.location.href = `/auth/signup?email=${encodeURIComponent(email)}`;
  }

  return (
    <section style={{ position: "relative", overflow: "hidden", paddingTop: 132, paddingBottom: 80 }}>
      <AmbientBackdrop style={{ zIndex: 0 }} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr)",
          gap: 56,
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* copy */}
        <div style={{ maxWidth: 560 }}>
          <motion.span
            {...fadeUp(0)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 12px", borderRadius: 9999,
              background: "var(--accent-soft)", color: "var(--accent-text)",
              fontSize: 12, fontWeight: 600, letterSpacing: "0.02em",
              marginBottom: 22,
            }}
          >
            ⚡ Built for ADHD brains
          </motion.span>

          <motion.h1
            {...fadeUp(0.06)}
            style={{
              fontSize: "clamp(40px, 6.5vw, 68px)",
              fontWeight: 600,
              letterSpacing: "-0.035em",
              lineHeight: 1.03,
              color: "var(--ink)",
            }}
          >
            Start small.{" "}
            <span style={{ color: "var(--accent)" }}>That counts.</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.12)}
            style={{
              marginTop: 22,
              fontSize: 19,
              lineHeight: 1.55,
              color: "var(--ink-3)",
              maxWidth: 480,
            }}
          >
            Hyperfix rewards you for <em style={{ fontFamily: "var(--font-serif-display, serif)", fontStyle: "italic" }}>starting</em> — not finishing.
            Name the thing, do five minutes, earn XP. No guilt, no streak resets, no leaderboards.
          </motion.p>

          {/* email form */}
          <motion.form
            {...fadeUp(0.18)}
            onSubmit={handleSubmit}
            style={{ marginTop: 30, display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 460 }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
              style={{
                flex: "1 1 200px", minWidth: 0,
                height: 52, padding: "0 18px", borderRadius: 14,
                background: "var(--bg-white)", border: "1px solid var(--line-strong)",
                fontSize: 15, color: "var(--ink)", outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                height: 52, padding: "0 24px", borderRadius: 14,
                background: "var(--accent)", color: "#fff", border: "none",
                fontSize: 15, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                display: "inline-flex", alignItems: "center", gap: 8,
                boxShadow: "0 8px 22px rgba(255,90,54,0.32)",
              }}
            >
              Start free <ArrowRight size={17} strokeWidth={2.5} />
            </button>
          </motion.form>

          <motion.p {...fadeUp(0.24)} style={{ marginTop: 14, fontSize: 13, color: "var(--ink-faint)" }}>
            Free forever · no credit card · 60 seconds to your first win
          </motion.p>
        </div>

        {/* product demo */}
        <motion.div
          initial={{ opacity: 0, y: 24, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <JustStartDemo />
        </motion.div>
      </div>
    </section>
  );
}
