import { LogoLockup } from "@/components/Logo";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-stretch" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      {/* LEFT PANEL — form, no card wrapper */}
      <div className="flex-1 lg:w-[52%] flex flex-col relative overflow-hidden">
        {/* mobile sage bloom from top */}
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

        {/* desktop header */}
        <div className="hidden lg:block relative z-10 px-10 pt-8">
          <a href="/" className="inline-block transition-transform hover:scale-[1.02]">
            <LogoLockup size="sm" />
          </a>
        </div>

        {/* mobile header */}
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

        {/* desktop footer */}
        <div className="hidden lg:block relative z-10 px-10 pb-6">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: "var(--ink-faint)" }}
          >
            hyperfix · the ADHD companion for your brain
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — sage showcase, desktop only */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[46%] p-5">
        <div
          className="relative w-full rounded-3xl overflow-hidden flex flex-col justify-between anim-fadeUp"
          style={{
            background:
              "radial-gradient(ellipse 110% 90% at 50% 115%, var(--accent) 0%, var(--accent-soft) 42%, var(--bg) 88%)",
            border: "1px solid var(--line)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: NOISE_URL, backgroundSize: "220px 220px", opacity: 0.3 }}
          />

          {/* top tagline */}
          <div className="relative z-10 p-10">
            <span
              className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1"
              style={{
                background: "var(--bg)",
                color: "var(--accent)",
                border: "1px solid var(--accent)",
              }}
            >
              built for ADHD brains
            </span>
          </div>

          {/* bottom copy */}
          <div className="relative z-10 px-10 pb-10">
            <p
              className="font-display leading-[1.04]"
              style={{ color: "var(--ink)", letterSpacing: "-0.02em", fontSize: "clamp(32px, 3.4vw, 48px)" }}
            >
              Your brain,
              <br />
              finally organized.
            </p>
            <p
              className="mt-4 font-sans text-base max-w-md"
              style={{ color: "var(--ink-muted)" }}
            >
              Capture it. Track it. Focus. Repeat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
