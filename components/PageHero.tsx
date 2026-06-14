import type { ReactNode } from "react";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")";

export function PageHero({
  label,
  heading,
  sub,
  right,
  children,
}: {
  label: string;
  heading: ReactNode;
  sub?: string;
  right?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header
      className="relative overflow-hidden"
      style={{
        background: [
          "radial-gradient(ellipse 80% 140% at 110% 65%, rgba(109,90,230,0.55) 0%, transparent 55%)",
          "radial-gradient(ellipse 50% 80%  at 85%  -5%, rgba(109,90,230,0.30) 0%, transparent 50%)",
          "linear-gradient(145deg, var(--xp) 0%, #4a3bc4 100%)",
        ].join(", "),
        padding: "clamp(28px,4.5vw,44px) clamp(20px,5vw,44px) clamp(32px,4vw,44px)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: NOISE, backgroundSize: "200px 200px", opacity: 0.7 }}
      />
      <div className="relative z-10">
        <p
          className="font-mono text-[11px] uppercase tracking-[0.18em] mb-2"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          {label}
        </p>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h1
            style={{
              fontFamily: "var(--font-landing-sans), Inter, sans-serif",
              fontWeight: 700,
              letterSpacing: "-0.05em",
              fontSize: "clamp(36px,5.5vw,54px)",
              lineHeight: 1,
              color: "#fff",
            }}
          >
            {heading}
          </h1>
          {right && <div className="shrink-0">{right}</div>}
        </div>
        {sub && (
          <p className="mt-3 font-sans text-[15px] max-w-lg" style={{ color: "rgba(255,255,255,0.55)" }}>
            {sub}
          </p>
        )}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </header>
  );
}

export function PageHeroStat({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div
      className="flex flex-col items-center rounded-2xl px-4 py-3"
      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
    >
      <span
        className="text-[22px] font-bold tabular-nums leading-none"
        style={{ color: "#fff", fontFamily: "var(--font-landing-sans), Inter, sans-serif", letterSpacing: "-0.03em" }}
      >
        {value}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
        {label}
      </span>
    </div>
  );
}
