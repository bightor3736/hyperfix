/**
 * Hyperfix brand — APPLE DESIGN SYSTEM
 *
 * AppIcon      — rounded square app icon with purple gradient + H mark
 * LogoMark     — alias for AppIcon
 * Wordmark     — icon + "hyperfix" text
 *
 * Legacy exports preserved for dashboard compatibility:
 * LogoTile, LogoWordmark, LogoLockup, LogoFull, SparkIcon
 */

export function AppIcon({ size = 36 }: { size?: number }) {
  const r = size * 0.22;
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx={r} fill="url(#hf-grad)" />
      <defs>
        <linearGradient id="hf-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      {/* Stylised H with lightning bolt slash */}
      <path d="M11 10v16M25 10v16M11 18h14" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 11l-4 7h5l-4 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

export function LogoMark({ size = 28, className = "" }: { size?: number; className?: string; color?: string; ink?: string }) {
  return <AppIcon size={size} />;
}

export function Wordmark({ dark = true }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <AppIcon size={30} />
      <span
        style={{
          fontFamily: '-apple-system, "SF Pro Display", "Helvetica Neue", system-ui, sans-serif',
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "-0.022em",
          color: dark ? "#ffffff" : "#1d1d1f",
          lineHeight: 1,
        }}
      >
        hyperfix
      </span>
    </span>
  );
}

/** Legacy: The mark inside a soft squircle tile */
export function LogoTile({
  size = 40,
  className = "",
  tile = "var(--accent)",
}: {
  size?: number;
  className?: string;
  tile?: string;
}) {
  const radius = Math.max(8, Math.round(size * 0.28));
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        background: tile,
        borderRadius: radius,
        boxShadow: "var(--shadow-sm)",
      }}
      aria-hidden="true"
    >
      <AppIcon size={Math.round(size * 0.62)} />
    </span>
  );
}

export function LogoWordmark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const fontSize =
    size === "sm" ? "text-[22px]" :
    size === "lg" ? "text-[42px]" :
    "text-[28px]";

  return (
    <span
      className={`font-display-medium leading-none text-ink ${fontSize} ${className}`}
      style={{ fontWeight: 700, letterSpacing: "-0.02em" }}
    >
      hyperfix
    </span>
  );
}

export { LogoWordmark as LogoFull };

export function LogoLockup({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const markPx = size === "sm" ? 24 : size === "lg" ? 42 : 30;
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <AppIcon size={markPx} />
      <LogoWordmark size={size} />
    </span>
  );
}

export function SparkIcon({
  size = 20,
  className = "",
  color = "var(--accent)",
}: {
  size?: number;
  className?: string;
  color?: string;
}) {
  return <AppIcon size={size} />;
}
