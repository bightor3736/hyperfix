/**
 * Hyperfix brand — editorial mark
 *
 * LogoMark     — a six-pointed asterisk spark in var(--accent). No tile.
 *                Reads from 16px favicon up to hero sizes.
 * LogoWordmark — "hyperfix" in Fraunces medium (matching the landing Wordmark).
 * LogoLockup   — mark + wordmark, same visual language as the landing.
 */

export function LogoMark({
  size = 28,
  className = "",
  color = "var(--accent)",
}: {
  size?: number;
  className?: string;
  color?: string;
}) {
  // Six-pointed asterisk: three lines crossing at (14,14) with radius 10.
  // Spokes at 90°, 30°, and 150° from the positive x-axis.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* vertical */}
      <line x1="14" y1="4"    x2="14" y2="24"   stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* upper-right → lower-left */}
      <line x1="22.66" y1="9"  x2="5.34" y2="19"  stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* upper-left → lower-right */}
      <line x1="5.34"  y1="9"  x2="22.66" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
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
      className={`font-display-medium leading-none tracking-tight text-ink ${fontSize} ${className}`}
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
  const markPx = size === "sm" ? 22 : size === "lg" ? 40 : 28;
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={markPx} />
      <LogoWordmark size={size} />
    </span>
  );
}

/** Spark mark without text — for decorative or favicon use. */
export function SparkIcon({
  size = 20,
  className = "",
  color = "var(--accent)",
}: {
  size?: number;
  className?: string;
  color?: string;
}) {
  return <LogoMark size={size} className={className} color={color} />;
}
