import { LogoLockup } from "@/components/Logo";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-stretch" style={{ background: "#070708" }}>

      {/* LEFT PANEL — desktop only */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[44%] p-5">
        <div
          className="relative w-full rounded-3xl overflow-hidden flex flex-col anim-fadeUp"
          style={{
            background:
              "radial-gradient(ellipse 90% 80% at 50% 110%, #5EEAD4 0%, #2DD4BF 16%, #0E4F47 36%, #08231F 58%, #070708 80%)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: NOISE_URL, backgroundSize: "220px 220px", opacity: 0.55 }}
          />
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-56 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(7,7,8,1) 0%, rgba(7,7,8,0.55) 55%, transparent 100%)",
            }}
          />

          <div className="relative z-10 p-8">
            <a href="/" className="inline-block transition-transform hover:scale-[1.02]">
              <LogoLockup size="sm" />
            </a>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-end px-8 pb-10">
            <span
              className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-6"
              style={{
                background: "rgba(94,234,212,0.10)",
                color: "#5EEAD4",
                border: "1px solid rgba(94,234,212,0.22)",
                boxShadow: "0 0 20px rgba(94,234,212,0.12)",
              }}
            >
              the journal for your obsessions
            </span>
            <p
              className="font-display text-4xl xl:text-5xl leading-[1.02]"
              style={{ color: "#FFFFFF", letterSpacing: "-0.02em", fontWeight: 600 }}
            >
              What are you
              <br />
              obsessed with?
            </p>
            <p
              className="mt-4 font-sans text-base"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Log it. Count it. Mourn it.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="flex-1 flex flex-col relative overflow-hidden">

        {/* Grain overlay (whole panel) */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
        />

        {/* Mobile-only: teal bloom at top */}
        <div
          aria-hidden
          className="lg:hidden absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: 260,
            background:
              "radial-gradient(ellipse 120% 100% at 50% 0%, #2DD4BF 0%, #0E4F47 30%, #08231F 55%, transparent 80%)",
          }}
        />
        {/* Grain on the mobile bloom */}
        <div
          aria-hidden
          className="lg:hidden absolute top-0 left-0 right-0 pointer-events-none mix-blend-overlay"
          style={{
            height: 260,
            backgroundImage: NOISE_URL,
            backgroundSize: "220px 220px",
            opacity: 0.45,
          }}
        />
        {/* Fade the bloom into the dark body */}
        <div
          aria-hidden
          className="lg:hidden absolute pointer-events-none"
          style={{
            top: 160,
            left: 0,
            right: 0,
            height: 100,
            background: "linear-gradient(to bottom, transparent, #070708)",
          }}
        />

        {/* Mobile header — logo centred over the bloom */}
        <div className="lg:hidden relative z-10 flex items-center justify-center pt-12 pb-6">
          <a href="/" className="inline-block transition-transform hover:scale-[1.02]">
            <LogoLockup size="sm" />
          </a>
        </div>

        {/* Form area */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto">
          <div className="w-full max-w-[380px] anim-fadeUp delay-200 my-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
