/* Hyperfix mark — a coral "spark" tile: rounded square with a clean bolt.
   The bolt ties to the product's core action: Just Start. */

const SPARK = "#FF5A36";

export function AppIcon({ size = 36, tile = SPARK }: { size?: number; tile?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden>
      <rect width="36" height="36" rx="10" fill={tile} />
      {/* chunky rounded lightning bolt */}
      <path
        d="M20.5 6.5 L11 19.8 a1 1 0 0 0 0.82 1.58 H16.4 L15 29.2 a0.6 0.6 0 0 0 1.08 0.45 L25.4 16.2 a1 1 0 0 0 -0.82 -1.58 H19.9 L21.6 7.1 a0.6 0.6 0 0 0 -1.1 -0.6 Z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function LogoMark({ size = 28 }: { size?: number; className?: string; color?: string; ink?: string }) {
  return <AppIcon size={size} />;
}

export function Wordmark({ dark = false, size = 18 }: { dark?: boolean; size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
      <AppIcon size={size + 10} />
      <span style={{
        fontFamily: 'var(--font), -apple-system, "Inter", system-ui, sans-serif',
        fontSize: size,
        fontWeight: 600,
        letterSpacing: "-0.03em",
        color: dark ? "#FBF7F1" : "var(--ink, #181410)",
        lineHeight: 1,
      }}>
        hyperfix
      </span>
    </span>
  );
}

/* ── Compatibility exports used across the app ── */
export function LogoTile({ size = 40, className = "", tile = SPARK }: { size?: number; className?: string; tile?: string }) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <AppIcon size={size} tile={tile} />
    </span>
  );
}
export function LogoWordmark({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const fontSize = size === "sm" ? "text-[22px]" : size === "lg" ? "text-[42px]" : "text-[28px]";
  return <span className={`leading-none ${fontSize} ${className}`} style={{ color: "var(--ink)", fontWeight: 600, letterSpacing: "-0.03em" }}>hyperfix</span>;
}
export { LogoWordmark as LogoFull };
export function LogoLockup({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const markPx = size === "sm" ? 24 : size === "lg" ? 42 : 30;
  return <span className={`inline-flex items-center gap-2.5 ${className}`}><AppIcon size={markPx} /><LogoWordmark size={size} /></span>;
}
export function SparkIcon({ size = 20 }: { size?: number; className?: string; color?: string }) {
  return <AppIcon size={size} />;
}
