"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Hls from "hls.js";
import { AppIcon } from "@/components/Logo";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const HLS_URL =
  "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

export function CTASection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Hls.isSupported()) {
      const hls = new Hls({ autoStartLoad: true });
      hls.loadSource(HLS_URL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_URL;
      video.play().catch(() => {});
    }
  }, []);

  return (
    <section
      style={{
        position: "relative",
        padding: "128px 24px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      {/* HLS video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%", objectFit: "cover", zIndex: 0,
        }}
      />
      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1 }} />

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
          Join 2,400+ people who stopped avoiding and started doing. Free forever.
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
