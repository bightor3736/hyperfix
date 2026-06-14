"use client";
import { AppIcon } from "@/components/Logo";

// White concentric rings — only used on the coral right panel.
function ConcentricMark({ size = 28 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <div style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.6)" }} />
      <div style={{ width: size * 0.42, height: size * 0.42, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.6)" }} />
    </div>
  );
}

function RightPanel() {
  return (
    <div className="relative hidden lg:flex lg:w-[48%] xl:w-[46%] p-5">
      <div
        className="relative w-full overflow-hidden flex flex-col justify-between p-10"
        style={{
          borderRadius: 24,
          background: "linear-gradient(150deg, #FF734F 0%, #FF5A36 55%, #E1431F 100%)",
        }}
      >
        {/* giant bolt watermark */}
        <svg
          aria-hidden
          viewBox="0 0 36 36"
          style={{ position: "absolute", right: -40, bottom: -30, width: 360, height: 360, opacity: 0.14 }}
        >
          <path
            d="M20.5 6.5 L11 19.8 a1 1 0 0 0 0.82 1.58 H16.4 L15 29.2 a0.6 0.6 0 0 0 1.08 0.45 L25.4 16.2 a1 1 0 0 0 -0.82 -1.58 H19.9 L21.6 7.1 a0.6 0.6 0 0 0 -1.1 -0.6 Z"
            fill="#ffffff"
          />
        </svg>

        {/* top logo */}
        <div className="relative z-10 flex justify-end">
          <ConcentricMark size={56} />
        </div>

        {/* bottom statement */}
        <div className="relative z-10">
          <p
            style={{
              color: "#ffffff",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              fontSize: "clamp(28px, 3vw, 46px)",
              lineHeight: 1.08,
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
            style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}
          >
            Name it, do five minutes, earn XP for starting. No guilt, no streak resets, no leaderboards.
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
        background: "#FBF7F1",
        color: "#181410",
        fontFamily: "var(--font-grotesk), system-ui, sans-serif",
        letterSpacing: "-0.01em",
        "--bg": "#FBF7F1",
        "--bg-soft": "#F5EFE5",
        "--bg-elevated": "#FFFFFF",
        "--ink": "#181410",
        "--ink-muted": "rgba(24,20,16,0.60)",
        "--ink-faint": "rgba(24,20,16,0.40)",
        "--line": "rgba(24,20,16,0.10)",
        "--line-strong": "rgba(24,20,16,0.18)",
        "--accent": "#FF5A36",
        "--accent-soft": "rgba(255,90,54,0.12)",
        "--accent-ink": "#ffffff",
        "--xp": "#6D5AE6",
        "--xp-soft": "rgba(109,90,230,0.12)",
        "--primary": "#181410",
        "--primary-foreground": "#FBF7F1",
        "--invert-bg": "#181410",
        "--invert-ink": "#FBF7F1",
      } as React.CSSProperties}
    >
      {/* LEFT PANEL — form */}
      <div className="relative flex flex-1 flex-col overflow-hidden lg:w-[52%]">
        {/* header */}
        <div className="relative z-10 hidden px-10 pt-8 lg:block">
          <a href="/" className="inline-flex items-center gap-2.5" style={{ textDecoration: "none" }}>
            <AppIcon size={24} />
            <span style={{ fontWeight: 700, fontSize: 16, color: "#181410", letterSpacing: "-0.025em" }}>
              hyperfix
            </span>
          </a>
        </div>

        {/* Mobile header */}
        <div className="relative z-10 flex items-center justify-center pb-4 pt-10 lg:hidden">
          <a href="/" className="inline-flex items-center gap-2.5" style={{ textDecoration: "none" }}>
            <AppIcon size={24} />
            <span style={{ fontWeight: 700, fontSize: 16, color: "#181410", letterSpacing: "-0.025em" }}>
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
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(24,20,16,0.40)" }}>
            hyperfix · start small, that counts
          </p>
        </div>
      </div>

      <RightPanel />
    </div>
  );
}
