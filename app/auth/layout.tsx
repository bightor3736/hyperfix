import { LogoLockup, LogoWordmark } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-stretch"
      style={{ background: "#080808" }}
    >
      {/* LEFT PANEL — branding card */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[44%] p-5">
        <div
          className="relative w-full rounded-3xl overflow-hidden flex flex-col"
          style={{
            background: "#0A0A0A",
            border: "1px solid rgba(244,244,244,0.07)",
          }}
        >
          {/* Lime radial glow — bottom center */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: "160%",
              height: "75%",
              background:
                "radial-gradient(ellipse 65% 55% at 50% 100%, rgba(110,210,15,0.42) 0%, rgba(100,195,10,0.12) 38%, transparent 70%)",
              filter: "blur(1px)",
            }}
          />
          {/* Dark vignette top so logo reads clearly */}
          <div
            className="absolute top-0 left-0 right-0 h-52 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,10,1) 0%, rgba(10,10,10,0.5) 60%, transparent 100%)",
            }}
          />

          {/* Logo — top left */}
          <div className="relative z-10 p-8">
            <a href="/">
              <LogoLockup size="sm" />
            </a>
          </div>

          {/* Tagline — bottom */}
          <div className="relative z-10 mt-auto px-8 pb-10">
            <p
              className="font-display text-3xl xl:text-4xl leading-[1.1]"
              style={{ color: "rgba(244,244,244,0.88)", letterSpacing: "-0.03em" }}
            >
              What are you
              <br />
              <em className="italic" style={{ color: "#A855F7" }}>unwell</em> about?
            </p>
            <p
              className="mt-4 font-mono text-[10px] uppercase tracking-widest"
              style={{ color: "rgba(244,244,244,0.28)" }}
            >
              Log it. Count it. Mourn it.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo — wordmark only, no mark */}
          <div className="mb-10 lg:hidden">
            <a href="/">
              <LogoWordmark size="md" />
            </a>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
