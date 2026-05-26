import { LogoLockup } from "@/components/Logo";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const TEAL = "#5EEAD4";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-stretch" style={{ background: "#070708" }}>
      {/* LEFT PANEL — form, no card wrapper */}
      <div className="flex-1 lg:w-[52%] flex flex-col relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
        />

        {/* mobile teal bloom from top */}
        <div
          aria-hidden
          className="lg:hidden absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: 240,
            background:
              "radial-gradient(ellipse 120% 100% at 50% 0%, #2DD4BF 0%, #0E4F47 28%, #08231F 55%, transparent 82%)",
          }}
        />
        <div
          aria-hidden
          className="lg:hidden absolute pointer-events-none"
          style={{
            top: 160,
            left: 0,
            right: 0,
            height: 80,
            background: "linear-gradient(to bottom, transparent, #070708)",
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
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            hyperfix · the journal for your obsessions
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — teal bloom showcase, desktop only */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[46%] p-5">
        <div
          className="relative w-full rounded-3xl overflow-hidden flex flex-col justify-between anim-fadeUp"
          style={{
            background:
              "radial-gradient(ellipse 110% 80% at 50% 115%, #5EEAD4 0%, #2DD4BF 12%, #0E4F47 32%, #08231F 56%, #070708 82%)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: NOISE_URL, backgroundSize: "220px 220px", opacity: 0.5 }}
          />
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(7,7,8,0.85) 0%, rgba(7,7,8,0.35) 55%, transparent 100%)",
            }}
          />

          {/* top tagline */}
          <div className="relative z-10 p-10">
            <span
              className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1"
              style={{
                background: "rgba(94,234,212,0.10)",
                color: TEAL,
                border: "1px solid rgba(94,234,212,0.22)",
                boxShadow: "0 0 20px rgba(94,234,212,0.12)",
              }}
            >
              the journal for your obsessions
            </span>
          </div>

          {/* bottom copy */}
          <div className="relative z-10 px-10 pb-10">
            <p
              className="font-display leading-[1.04]"
              style={{
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                fontSize: "clamp(32px, 3.4vw, 44px)",
                fontWeight: 600,
              }}
            >
              What are you
              <br />
              obsessed with?
            </p>
            <p
              className="mt-4 font-sans text-base max-w-md"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Log it. Count it. Mourn it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
