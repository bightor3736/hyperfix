"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export function CTASection() {
  return (
    <section style={{ padding: "32px 24px 96px", background: "var(--bg)" }}>
      <div
        style={{
          position: "relative",
          maxWidth: 1120,
          margin: "0 auto",
          borderRadius: 32,
          overflow: "hidden",
          background: "linear-gradient(150deg, #FF734F 0%, #FF5A36 55%, #E1431F 100%)",
          padding: "80px 32px",
          textAlign: "center",
        }}
      >
        {/* bolt watermark */}
        <svg aria-hidden viewBox="0 0 36 36" style={{ position: "absolute", left: -50, top: -40, width: 320, height: 320, opacity: 0.13 }}>
          <path d="M20.5 6.5 L11 19.8 a1 1 0 0 0 0.82 1.58 H16.4 L15 29.2 a0.6 0.6 0 0 0 1.08 0.45 L25.4 16.2 a1 1 0 0 0 -0.82 -1.58 H19.9 L21.6 7.1 a0.6 0.6 0 0 0 -1.1 -0.6 Z" fill="#fff" />
        </svg>

        <div style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
          <motion.h2
            {...fadeUp(0)}
            style={{ fontSize: "clamp(30px, 4.5vw, 52px)", fontWeight: 600, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.06 }}
          >
            Your first win is{" "}
            <span style={{ fontFamily: "var(--font-serif-display, serif)", fontStyle: "italic", fontWeight: 400 }}>
              five minutes
            </span>{" "}
            away.
          </motion.h2>
          <motion.p {...fadeUp(0.1)} style={{ marginTop: 16, fontSize: 17, color: "rgba(255,255,255,0.9)", lineHeight: 1.55 }}>
            Free forever. No credit card. No guilt if you miss a day.
          </motion.p>
          <motion.div {...fadeUp(0.2)} style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <a
              href="/auth/signup"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                height: 52, padding: "0 28px", borderRadius: 14,
                background: "#fff", color: "#E1431F", fontSize: 15, fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Start free <ArrowRight size={17} strokeWidth={2.5} />
            </a>
            <a
              href="/#how"
              style={{
                display: "inline-flex", alignItems: "center",
                height: 52, padding: "0 24px", borderRadius: 14,
                background: "rgba(255,255,255,0.16)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.35)",
                fontSize: 15, fontWeight: 600, textDecoration: "none",
              }}
            >
              See how it works
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
