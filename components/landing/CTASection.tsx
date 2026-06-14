"use client";
import { motion } from "framer-motion";
import { AppIcon } from "@/components/Logo";
import { AmbientBackdrop } from "./demo/AmbientBackdrop";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export function CTASection() {
  return (
    <section
      style={{
        position: "relative",
        padding: "128px 24px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Ambient coded backdrop */}
      <AmbientBackdrop />
      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1 }} />

      {/* Content */}
      <div
        style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", maxWidth: 600, margin: "0 auto",
        }}
      >
        <motion.div {...fadeUp(0)} style={{ marginBottom: 32 }}>
          <AppIcon size={44} />
        </motion.div>

        <motion.h2
          {...fadeUp(0.1)}
          style={{
            fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(32px, 5vw, 60px)",
            letterSpacing: "-1px",
            color: "#ffffff",
            marginBottom: 16,
            lineHeight: 1.1,
          }}
        >
          Start Your Journey
        </motion.h2>

        <motion.p
          {...fadeUp(0.2)}
          style={{
            fontSize: 16, color: "rgba(255,255,255,0.55)",
            marginBottom: 40, maxWidth: 380, lineHeight: 1.6,
          }}
        >
          Stop avoiding and start doing — five minutes at a time. Free forever.
        </motion.p>

        <motion.div
          {...fadeUp(0.3)}
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 16 }}
        >
          <a
            href="/auth/signup"
            style={{
              background: "#ffffff", color: "#000000",
              fontSize: 14, fontWeight: 600,
              borderRadius: 10, padding: "14px 32px",
              textDecoration: "none", transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Start free
          </a>
          <a
            href="#features"
            className="liquid-glass"
            style={{
              color: "#ffffff",
              fontSize: 14, fontWeight: 600,
              borderRadius: 10, padding: "14px 32px",
              textDecoration: "none",
            }}
          >
            See how it works
          </a>
        </motion.div>
      </div>
    </section>
  );
}
