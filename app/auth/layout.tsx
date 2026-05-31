import { LogoLockup } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-stretch"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
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
            hyperfix · the ADHD companion for your brain
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
                color: "var(--accent)",
                border: "1px solid var(--accent)",
              }}
            >
              built for ADHD brains
            </span>

            {/* Mock fix card preview */}
            <div
              className="mt-8 rounded-2xl p-6"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--line)",
              }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="inline-flex items-center font-mono text-[9px] uppercase tracking-widest rounded-full px-2.5 py-1"
                  style={{
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                    border: "1px solid rgba(111,138,99,0.3)",
                  }}
                >
                  Show
                </span>
                <span className="font-mono text-[10px] text-ink-faint">Obsessing</span>
              </div>

              {/* Day counter */}
              <div className="flex items-baseline gap-2 mb-2">
                <span
                  className="font-display leading-none tracking-tight text-ink"
                  style={{ fontSize: 52 }}
                >
                  47
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                  days
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-display text-ink mb-4"
                style={{ fontSize: 18, letterSpacing: "-0.01em", lineHeight: 1.2 }}
              >
                Severance, Season Two
              </h3>

              {/* Intensity bar */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                    Intensity
                  </span>
                  <span className="font-mono text-[11px] text-ink-muted">9/10</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: "90%", background: "var(--accent)" }}
                  />
                </div>
              </div>

              {/* Stat chips */}
              <div className="flex gap-2">
                <span
                  className="inline-flex items-center font-mono text-[10px] rounded-full px-2.5 py-1"
                  style={{
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                    border: "1px solid rgba(111,138,99,0.25)",
                  }}
                >
                  12-day streak
                </span>
                <span
                  className="inline-flex items-center font-mono text-[10px] rounded-full px-2.5 py-1 text-ink-muted"
                  style={{ background: "var(--bg-soft)", border: "1px solid var(--line)" }}
                >
                  94 fixations logged
                </span>
              </div>
            </div>
          </div>

          {/* Bottom quote */}
          <div className="relative z-10 px-10 pb-10">
            <p
              className="font-display leading-[1.06]"
              style={{
                color: "var(--ink)",
                letterSpacing: "-0.02em",
                fontSize: "clamp(26px, 2.8vw, 38px)",
              }}
            >
              For the thing that
              <br />
              rearranged your brain.
            </p>
            <p className="mt-3 font-sans text-sm text-ink-muted max-w-xs">
              Log it. Count the days. Mourn it when it ends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
