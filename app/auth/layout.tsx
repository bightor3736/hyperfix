import { LogoMark } from "@/components/Logo";

// Brutalist wordmark for auth — mark + heavy Space Grotesk wordmark.
function Wordmark({ size = 26 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2" style={{ lineHeight: 1 }}>
      <LogoMark size={Math.round(size * 0.95)} color="var(--accent)" />
      <span style={{ fontWeight: 700, fontSize: size, letterSpacing: "-0.04em", color: "var(--ink)" }}>
        hyperfix
      </span>
    </span>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen items-stretch"
      style={
        {
          background: "#FAF6F0",
          color: "#2B2440",
          fontFamily: "var(--font-grotesk), system-ui, sans-serif",
          letterSpacing: "-0.01em",
          "--bg": "#FAF6F0",
          "--bg-soft": "#F2EAD7",
          "--bg-elevated": "#FFFFFF",
          "--ink": "#2B2440",
          "--ink-muted": "#2E2E2E",
          "--ink-faint": "#6A6A6A",
          "--line": "#E9E2D8",
          "--line-strong": "#2B2440",
          "--accent": "#6957E8",
          "--accent-soft": "#DCE2FF",
          "--accent-ink": "#FFFFFF",
          "--xp": "#9B8AFB",
          "--xp-soft": "#EFEBFF",
          "--primary": "#6957E8",
          "--primary-foreground": "#FFFFFF",
        } as React.CSSProperties
      }
    >
      {/* LEFT PANEL — form */}
      <div className="relative flex flex-1 flex-col overflow-hidden lg:w-[52%]">
        {/* Desktop header */}
        <div className="relative z-10 hidden px-10 pt-8 lg:block">
          <a href="/" className="inline-block">
            <Wordmark size={26} />
          </a>
        </div>

        {/* Mobile header */}
        <div className="relative z-10 flex items-center justify-center pb-4 pt-10 lg:hidden">
          <a href="/" className="inline-block">
            <Wordmark size={26} />
          </a>
        </div>

        {/* Form area */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-8">
          <div className="anim-fadeUp delay-200 w-full max-w-[380px]">
            {children}
          </div>
        </div>

        {/* Desktop footer */}
        <div className="relative z-10 hidden px-10 pb-6 lg:block">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">
            hyperfix · the app for your hyperfixations
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — bold brutalist block, desktop only */}
      <div className="hidden p-5 lg:flex lg:w-[48%] xl:w-[46%]">
        <div
          className="relative flex w-full flex-col justify-between overflow-hidden p-10"
          style={{ background: "var(--accent)", border: "1.5px solid var(--line-strong)", borderRadius: 16, boxShadow: "var(--shadow-xl)" }}
        >
          {/* big offset mark */}
          <div className="flex justify-end">
            <LogoMark size={120} color="var(--yellow)" ink="#FAF6F0" />
          </div>

          <div className="relative z-10">
            <p className="leading-[0.95]" style={{ color: "#fff", fontWeight: 700, letterSpacing: "-0.04em", fontSize: "clamp(34px,3.6vw,54px)" }}>
              Small wins that
              <br />
              <span
                className="mt-2 inline-block px-2"
                style={{ background: "var(--yellow)", color: "#2B2440", border: "1.5px solid var(--line-strong)", boxShadow: "var(--shadow)", transform: "rotate(-1.5deg)" }}
              >
                actually stick.
              </span>
            </p>
            <p className="mt-6 max-w-sm text-[15px] font-medium" style={{ color: "rgba(255,255,255,0.92)" }}>
              Log what you&apos;re obsessed with. Earn XP, build a streak, level up — no guilt, no leaderboards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
