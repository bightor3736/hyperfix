import { LogoLockup } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-stretch"
      style={
        {
          background: "var(--bg)",
          color: "var(--ink)",
          // Match the landing page's green accent so sign-up / log-in feel
          // continuous with the marketing site (scoped to auth only).
          "--accent": "#1dcc5d",
          "--accent-soft": "#e3f9ec",
          "--accent-ink": "#04130a",
          "--xp": "#13a64c",
          "--xp-soft": "#e3f9ec",
          "--primary": "#1dcc5d",
          "--primary-foreground": "#04130a",
        } as React.CSSProperties
      }
    >
      {/* LEFT PANEL — form, no card wrapper */}
      <div className="flex-1 lg:w-[52%] flex flex-col relative overflow-hidden">
        {/* Mobile sage bloom from top */}
        <div
          aria-hidden
          className="lg:hidden absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: 240,
            background:
              "radial-gradient(ellipse 120% 100% at 50% 0%, var(--accent-soft) 0%, transparent 72%)",
            opacity: 0.7,
          }}
        />

        {/* Desktop header */}
        <div className="hidden lg:block relative z-10 px-10 pt-8">
          <a href="/" className="inline-block transition-transform hover:scale-[1.02]">
            <LogoLockup size="sm" />
          </a>
        </div>

        {/* Mobile header */}
        <div className="lg:hidden relative z-10 flex items-center justify-center pt-10 pb-4">
          <a href="/" className="inline-block transition-transform hover:scale-[1.02]">
            <LogoLockup size="sm" />
          </a>
        </div>

        {/* Form area — no card around it */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="w-full max-w-[380px] anim-fadeUp delay-200">
            {children}
          </div>
        </div>

        {/* Desktop footer */}
        <div className="hidden lg:block relative z-10 px-10 pb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
            hyperfix · your daily dopamine, on tap
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — editorial showcase, desktop only */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[46%] p-5">
        <div
          className="relative w-full rounded-3xl overflow-hidden flex flex-col justify-between anim-fadeUp"
          style={{
            background: "var(--bg-soft)",
            border: "1px solid var(--line)",
          }}
        >
          {/* Radial accent bloom top-left */}
          <div
            aria-hidden
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: "70%",
              height: "55%",
              background:
                "radial-gradient(ellipse 100% 100% at 0% 0%, var(--accent-soft) 0%, transparent 70%)",
              opacity: 0.9,
            }}
          />

          {/* Top content */}
          <div className="relative z-10 p-10">
            <span
              className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.14em] rounded-full px-3 py-1"
              style={{
                background: "var(--bg)",
                color: "var(--ink)",
                border: "1px solid var(--ink)",
              }}
            >
              the anti-doomscroll game
            </span>

            {/* Mock player card preview */}
            <div
              className="mt-8 rounded-2xl p-6"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="inline-flex items-center font-mono text-[9px] uppercase tracking-widest rounded-full px-2.5 py-1"
                  style={{ background: "var(--accent-soft)", color: "var(--ink)", border: "1px solid var(--line)" }}
                >
                  Level 4 · Hooked
                </span>
                <span className="font-mono text-[10px] text-ink-faint">14-day streak</span>
              </div>

              {/* XP number */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display leading-none tracking-tight text-ink" style={{ fontSize: 52 }}>
                  520
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">XP</span>
              </div>

              {/* Title */}
              <h3 className="font-display text-ink mb-4" style={{ fontSize: 18, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                Today&apos;s dopamine: do 10 wall push-ups.
              </h3>

              {/* XP bar */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Next level</span>
                  <span className="font-mono text-[11px] text-ink-muted">520 / 900</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                  <div className="h-full rounded-full" style={{ width: "62%", background: "linear-gradient(90deg, var(--accent), var(--xp))" }} />
                </div>
              </div>

              {/* Stat chips */}
              <div className="flex gap-2">
                <span
                  className="inline-flex items-center font-mono text-[10px] rounded-full px-2.5 py-1"
                  style={{ background: "var(--accent-soft)", color: "var(--ink)", border: "1px solid var(--line)" }}
                >
                  63 dopamine hits
                </span>
                <span
                  className="inline-flex items-center font-mono text-[10px] rounded-full px-2.5 py-1 text-ink-muted"
                  style={{ background: "var(--bg-soft)", border: "1px solid var(--line)" }}
                >
                  4 badges
                </span>
              </div>
            </div>
          </div>

          {/* Bottom quote */}
          <div className="relative z-10 px-10 pb-10">
            <p
              className="font-display leading-[1.06]"
              style={{ color: "var(--ink)", letterSpacing: "-0.02em", fontSize: "clamp(26px, 2.8vw, 38px)" }}
            >
              Your daily dopamine.
              <br />
              On tap.
            </p>
            <p className="mt-3 font-sans text-sm text-ink-muted max-w-xs">
              One tap, a real hit that isn&apos;t your phone. Earn XP, build a streak, level up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
