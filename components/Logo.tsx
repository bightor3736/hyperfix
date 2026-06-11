/**
 * Hyperfix brand mark — ring + lightning bolt
 * The ring represents progress/streak (Apple Health inspired).
 * The bolt represents ADHD energy and breaking through paralysis.
 *
 * Legacy exports kept for dashboard compatibility.
 */

export function AppIcon({ size = 36 }: { size?: number }) {
  const r12 = 12;
  const c = 2 * Math.PI * r12; // 75.4
  const filled = c * 0.74;     // 74% filled arc
  const gap = c - filled;

  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden>
      <defs>
        <linearGradient id="hf-bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#3b0764" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="36" height="36" rx="8.5" fill="url(#hf-bg)" />

      {/* Ring track */}
      <circle cx="18" cy="18" r={r12} stroke="rgba(255,255,255,0.14)" strokeWidth="2.4" />

      {/* Ring arc — 74% filled, starts at 12 o'clock */}
      <circle
        cx="18"
        cy="18"
        r={r12}
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${gap}`}
        transform="rotate(-90 18 18)"
        opacity={0.92}
      />

      {/* Lightning bolt — centered, clean geometric */}
      <path
        d="M20 10.5 L13.5 20 H17.5 L15.5 26.5 L22.5 16.5 H18.5 Z"
        fill="white"
      />
    </svg>
  );
}

export function LogoMark({ size = 28, className = "" }: { size?: number; className?: string; color?: string; ink?: string }) {
  return <AppIcon size={size} />;
}

export function Wordmark({ dark = true, size = 20 }: { dark?: boolean; size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <AppIcon size={size + 10} />
      <span
        style={{
          fontFamily: '-apple-system,"SF Pro Display","Helvetica Neue",system-ui,sans-serif',
          fontSize: size,
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

export function LogoTile({ size = 40, className = "", tile = "var(--accent)" }: { size?: number; className?: string; tile?: string }) {
  const radius = Math.max(8, Math.round(size * 0.28));
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, background: tile, borderRadius: radius, boxShadow: "var(--shadow-sm)" }}
      aria-hidden
    >
      <AppIcon size={Math.round(size * 0.62)} />
    </span>
  );
}

export function LogoWordmark({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const fontSize = size === "sm" ? "text-[22px]" : size === "lg" ? "text-[42px]" : "text-[28px]";
  return (
    <span className={`font-display-medium leading-none text-ink ${fontSize} ${className}`} style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
      hyperfix
    </span>
  );
}

export { LogoWordmark as LogoFull };

export function LogoLockup({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const markPx = size === "sm" ? 24 : size === "lg" ? 42 : 30;
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <AppIcon size={markPx} />
      <LogoWordmark size={size} />
    </span>
  );
}

export function SparkIcon({ size = 20, className = "", color = "var(--accent)" }: { size?: number; className?: string; color?: string }) {
  return <AppIcon size={size} />;
}
