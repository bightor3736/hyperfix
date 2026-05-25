import { LogoLockup } from "@/components/Logo";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// ── Dark Hyperfix share card (matches the actual app card style) ─────────────
function MockShareCard() {
  const days = 47;
  const intensity = 8;
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 240,
        height: 370,
        background: "radial-gradient(ellipse 110% 80% at 50% 120%, #5EEAD4 0%, #2DD4BF 12%, #0E4F47 32%, #08231F 56%, #070708 82%)",
        borderRadius: 16,
        boxShadow: "0 30px 80px -10px rgba(0,0,0,0.7), 0 8px 24px -6px rgba(94,234,212,0.2), 0 0 0 1px rgba(94,234,212,0.18)",
        transform: "rotate(-3deg)",
      }}
    >
      {/* grain */}
      <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.4 }} />
      {/* top dim */}
      <div aria-hidden className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "55%", background: "linear-gradient(180deg, rgba(7,7,8,0.75) 0%, transparent 100%)" }} />

      <div className="relative h-full p-5 flex flex-col">
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 7, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
            hyperfix
          </span>
          <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 7, letterSpacing: "0.18em", textTransform: "uppercase", color: "#5EEAD4", background: "rgba(94,234,212,0.12)", border: "1px solid rgba(94,234,212,0.25)", borderRadius: 99, padding: "2px 6px", fontWeight: 600 }}>
            log
          </span>
        </div>

        <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 16, lineHeight: 1.15, color: "#FFFFFF", fontWeight: 600, letterSpacing: "-0.02em", marginTop: 14 }}>
          severance —<br />the door scene
        </p>

        <div className="mt-auto">
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 80, lineHeight: 0.82, color: "#5EEAD4", fontWeight: 600, letterSpacing: "-0.05em", textShadow: "0 0 40px rgba(94,234,212,0.55)" }}>
              {days}
            </span>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 7, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(94,234,212,0.7)", fontWeight: 600, paddingBottom: 8 }}>
              days<br />deep
            </span>
          </div>

          <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 7, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>intensity</span>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, color: "#5EEAD4", fontWeight: 700 }}>{intensity}<span style={{ opacity: 0.5 }}>/10</span></span>
          </div>
          <div style={{ marginTop: 4, height: 3, borderRadius: 99, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${intensity * 10}%`, background: "linear-gradient(to right, rgba(94,234,212,0.5), #5EEAD4)", boxShadow: "0 0 8px rgba(94,234,212,0.6)", borderRadius: 99 }} />
          </div>

          <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 7, color: "rgba(255,255,255,0.35)", letterSpacing: "0.18em", textTransform: "uppercase" }}>hyperfix.app</span>
            <span style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontStyle: "italic", fontSize: 10, color: "rgba(94,234,212,0.55)" }}>still counting.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Floating mini stat chip ──────────────────────────────────────────────────
function StatChip({
  value,
  label,
  className,
  style,
}: {
  value: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute rounded-2xl px-4 py-3 backdrop-blur-md ${className ?? ""}`}
      style={{
        background: "rgba(15,16,17,0.78)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 20px 40px -15px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02) inset",
        ...style,
      }}
    >
      <p
        className="font-display"
        style={{
          color: "#FFFFFF",
          fontSize: 22,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          fontWeight: 600,
        }}
      >
        {value}
      </p>
      <p
        className="font-mono mt-1"
        style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {label}
      </p>
    </div>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-stretch" style={{ background: "#070708" }}>
      {/* LEFT PANEL — form (desktop) / full (mobile) */}
      <div className="flex-1 lg:w-[52%] flex flex-col relative overflow-hidden">
        {/* grain overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
        />

        {/* mobile-only teal bloom */}
        <div
          aria-hidden
          className="lg:hidden absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: 220,
            background:
              "radial-gradient(ellipse 120% 100% at 50% 0%, #2DD4BF 0%, #0E4F47 30%, #08231F 55%, transparent 80%)",
          }}
        />
        <div
          aria-hidden
          className="lg:hidden absolute pointer-events-none"
          style={{
            top: 140,
            left: 0,
            right: 0,
            height: 90,
            background: "linear-gradient(to bottom, transparent, #070708)",
          }}
        />

        {/* desktop header — logo top-left */}
        <div className="hidden lg:block relative z-10 px-10 pt-8">
          <a href="/" className="inline-block transition-transform hover:scale-[1.02]">
            <LogoLockup size="sm" />
          </a>
        </div>

        {/* mobile header */}
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

          {/* mobile-only mini visual below form */}
          <div className="lg:hidden w-full max-w-[380px] mt-10 mb-4 anim-fadeUp delay-700">
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: "radial-gradient(ellipse 100% 80% at 50% 110%, #0E4F47 0%, #08231F 45%, #0F1011 90%)",
                border: "1px solid rgba(94,234,212,0.12)",
              }}
            >
              <div className="flex items-center gap-4">
                {/* Mini dark Hyperfix card */}
                <div
                  style={{
                    width: 56,
                    height: 86,
                    background: "radial-gradient(ellipse 100% 80% at 50% 130%, #2DD4BF 0%, #0E4F47 40%, #070708 80%)",
                    borderRadius: 8,
                    flexShrink: 0,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 20px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(94,234,212,0.18)",
                    transform: "rotate(-3deg)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: 30,
                      color: "#5EEAD4",
                      fontWeight: 700,
                      lineHeight: 1,
                      textShadow: "0 0 20px rgba(94,234,212,0.6)",
                    }}
                  >
                    47
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 6,
                      color: "rgba(94,234,212,0.6)",
                      letterSpacing: "0.2em",
                      marginTop: 3,
                      textTransform: "uppercase",
                    }}
                  >
                    DAYS
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-display"
                    style={{
                      color: "#FFFFFF",
                      fontSize: 20,
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      fontWeight: 600,
                    }}
                  >
                    Severance
                  </p>
                  <p
                    className="font-sans text-sm mt-1"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    the door scene
                  </p>
                  <p
                    className="font-mono mt-2"
                    style={{
                      color: "#5EEAD4",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                    }}
                  >
                    intensity 8/10
                  </p>
                </div>
              </div>
            </div>
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

      {/* RIGHT PANEL — visual showcase, desktop only */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[46%] p-5">
        <div
          className="relative w-full rounded-3xl overflow-hidden flex flex-col anim-fadeUp"
          style={{
            background:
              "radial-gradient(ellipse 110% 80% at 50% 115%, #5EEAD4 0%, #2DD4BF 12%, #0E4F47 32%, #08231F 56%, #070708 82%)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* heavy grain */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: NOISE_URL, backgroundSize: "220px 220px", opacity: 0.5 }}
          />
          {/* top fade */}
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(7,7,8,0.85) 0%, rgba(7,7,8,0.35) 55%, transparent 100%)",
            }}
          />

          {/* top tagline */}
          <div className="relative z-10 p-8">
            <span
              className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1"
              style={{
                background: "rgba(94,234,212,0.10)",
                color: "#5EEAD4",
                border: "1px solid rgba(94,234,212,0.22)",
                boxShadow: "0 0 20px rgba(94,234,212,0.12)",
              }}
            >
              the journal for your obsessions
            </span>
          </div>

          {/* center — mock card + floating stats */}
          <div className="relative z-10 flex-1 flex items-center justify-center">
            <div className="relative" style={{ width: 380, height: 460 }}>
              {/* ghost card behind */}
              <div
                aria-hidden
                className="absolute"
                style={{
                  width: 220,
                  height: 340,
                  background: "rgba(94,234,212,0.04)",
                  border: "1px solid rgba(94,234,212,0.08)",
                  borderRadius: 14,
                  left: 30,
                  top: 55,
                  transform: "rotate(-9deg)",
                  boxShadow: "0 20px 60px -20px rgba(0,0,0,0.4)",
                }}
              />
              <div className="absolute" style={{ left: 70, top: 35 }}>
                <MockShareCard />
              </div>

              {/* floating stats */}
              <StatChip
                value="12"
                label="day run"
                style={{ top: -10, right: -10 }}
              />
              <StatChip
                value="3"
                label="active fixes"
                style={{ bottom: 30, left: -20 }}
              />
              <StatChip
                value="8/10"
                label="intensity"
                style={{ bottom: -10, right: 20 }}
              />
            </div>
          </div>

          {/* bottom copy */}
          <div className="relative z-10 px-10 pb-10">
            <p
              className="font-display leading-[1.04]"
              style={{
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                fontSize: "clamp(28px, 3vw, 38px)",
                fontWeight: 600,
              }}
            >
              What are you
              <br />
              obsessed with?
            </p>
            <p
              className="mt-3 font-sans text-base"
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
