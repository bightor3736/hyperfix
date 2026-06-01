// Wordmark matching the landing / whenevr template logo: "hyperfix" in
// Source Serif 4 italic with a small ® superscript.
function Wordmark({ size = 26 }: { size?: number }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-landing-serif), 'Source Serif 4', serif",
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.08em",
        color: "var(--ink)",
        display: "inline-block",
      }}
    >
      hyperfix
      <span
        style={{
          fontSize: "0.42em",
          verticalAlign: "super",
          fontStyle: "normal",
          letterSpacing: 0,
          marginLeft: "0.06em",
        }}
      >
        ®
      </span>
    </span>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-stretch"
      style={
        {
          // Mirror the landing page palette + typography (scoped to auth) so
          // sign-up / log-in feel like the marketing site.
          background: "#f0f0f0",
          color: "#0a0a0a",
          fontFamily: "var(--font-landing-sans), Inter, system-ui, sans-serif",
          letterSpacing: "-0.01em",
          "--bg": "#f0f0f0",
          "--bg-soft": "#eae9e7",
          "--bg-elevated": "#ffffff",
          "--ink": "#0a0a0a",
          "--ink-muted": "#7c7c7c",
          "--ink-faint": "#a4a4a4",
          "--line": "rgba(0,0,0,0.10)",
          "--line-strong": "rgba(0,0,0,0.18)",
          // landing green accent
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
            <Wordmark size={26} />
          </a>
        </div>

        {/* Mobile header */}
        <div className="lg:hidden relative z-10 flex items-center justify-center pt-10 pb-4">
          <a href="/" className="inline-block transition-transform hover:scale-[1.02]">
            <Wordmark size={26} />
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

      {/* RIGHT PANEL — landing hero treatment (blob + headline), desktop only */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[46%] p-5">
        <div
          className="relative w-full rounded-3xl overflow-hidden flex flex-col justify-end anim-fadeUp"
          style={{ background: "#ffffff", border: "1px solid var(--line)" }}
        >
          {/* The landing's blue/purple hero blob */}
          <img
            src="/site/images/922LPrLT3JS7JXQbJxraBeoo8I_1.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute"
            style={{
              top: "-8%",
              right: "-22%",
              width: "135%",
              maxWidth: "none",
              transform: "rotate(-12deg)",
            }}
          />

          {/* Bottom headline */}
          <div className="relative z-10 px-10 pb-10">
            <p
              className="leading-[1.02]"
              style={{
                color: "var(--ink)",
                fontFamily: "var(--font-landing-sans), Inter, sans-serif",
                fontWeight: 600,
                letterSpacing: "-0.05em",
                fontSize: "clamp(30px, 3.4vw, 50px)",
              }}
            >
              Small wins that{" "}
              <span
                style={{
                  fontFamily: "var(--font-landing-serif), 'Source Serif 4', serif",
                  fontStyle: "italic",
                }}
              >
                actually
              </span>{" "}
              stick.
            </p>
            <p
              className="mt-4 text-[15px] text-ink-muted max-w-sm"
              style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", letterSpacing: "-0.01em" }}
            >
              One tap, a real hit that isn&apos;t your phone. Earn XP, build a streak, level up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
