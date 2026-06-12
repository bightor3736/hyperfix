"use client";
import { useEffect, useRef } from "react";

function ConcentricMark({ size = 28 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <div style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.5)" }} />
      <div style={{ width: size * 0.42, height: size * 0.42, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.5)" }} />
    </div>
  );
}

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4";

function RightPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  }, []);

  return (
    <div className="relative hidden lg:flex lg:w-[48%] xl:w-[46%] p-5">
      <div
        className="relative w-full overflow-hidden flex flex-col justify-between p-10"
        style={{ borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* background video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
          src={VIDEO_URL}
        />
        {/* dark overlay */}
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)", zIndex: 1 }} />

        {/* top logo */}
        <div className="relative z-10 flex justify-end">
          <ConcentricMark size={56} />
        </div>

        {/* bottom statement */}
        <div className="relative z-10">
          <p
            style={{
              color: "#ffffff",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              fontSize: "clamp(28px, 3vw, 44px)",
              lineHeight: 1.1,
            }}
          >
            Small wins that{" "}
            <span
              style={{
                fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              actually stick.
            </span>
          </p>
          <p
            className="mt-4 text-[15px] font-medium max-w-xs"
            style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}
          >
            Log what you&apos;re obsessed with. Earn XP, build a streak, level up — no guilt, no leaderboards.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen items-stretch"
      style={{
        background: "#000000",
        color: "#ffffff",
        fontFamily: "var(--font-grotesk), system-ui, sans-serif",
        letterSpacing: "-0.01em",
        "--bg": "#000000",
        "--bg-soft": "#0d0d0d",
        "--bg-elevated": "#111111",
        "--ink": "#ffffff",
        "--ink-muted": "rgba(255,255,255,0.55)",
        "--ink-faint": "rgba(255,255,255,0.30)",
        "--line": "rgba(255,255,255,0.10)",
        "--line-strong": "rgba(255,255,255,0.22)",
        "--accent": "#A78BFA",
        "--accent-soft": "rgba(167,139,250,0.12)",
        "--accent-ink": "#000000",
        "--xp": "#A78BFA",
        "--xp-soft": "rgba(167,139,250,0.12)",
        "--primary": "#ffffff",
        "--primary-foreground": "#000000",
        "--invert-bg": "#ffffff",
        "--invert-ink": "#000000",
      } as React.CSSProperties}
    >
      {/* LEFT PANEL — form */}
      <div className="relative flex flex-1 flex-col overflow-hidden lg:w-[52%]">
        {/* header */}
        <div className="relative z-10 hidden px-10 pt-8 lg:block">
          <a href="/" className="inline-flex items-center gap-2.5" style={{ textDecoration: "none" }}>
            <ConcentricMark size={22} />
            <span style={{ fontWeight: 700, fontSize: 16, color: "#ffffff", letterSpacing: "-0.025em" }}>
              hyperfix
            </span>
          </a>
        </div>

        {/* Mobile header */}
        <div className="relative z-10 flex items-center justify-center pb-4 pt-10 lg:hidden">
          <a href="/" className="inline-flex items-center gap-2.5" style={{ textDecoration: "none" }}>
            <ConcentricMark size={22} />
            <span style={{ fontWeight: 700, fontSize: 16, color: "#ffffff", letterSpacing: "-0.025em" }}>
              hyperfix
            </span>
          </a>
        </div>

        {/* Form area */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-8">
          <div className="anim-fadeUp delay-200 w-full max-w-[380px]">
            {children}
          </div>
        </div>

        {/* footer */}
        <div className="relative z-10 hidden px-10 pb-6 lg:block">
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(255,255,255,0.25)" }}>
            hyperfix · the app for your hyperfixations
          </p>
        </div>
      </div>

      <RightPanel />
    </div>
  );
}
