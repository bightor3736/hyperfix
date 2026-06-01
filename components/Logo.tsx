/**
 * Hyperfix brand — the dopamine game
 *
 * LogoMark     — a bold four-point "spark" (the dopamine hit). Energy purple
 *                by default, single colour, reads from 16px favicon to hero.
 * LogoWordmark — "hyperfix" in Fraunces medium.
 * LogoLockup   — mark + wordmark.
 * LogoTile     — the spark on a rounded app-icon tile (for icons / avatars).
 */

// The spark: one clean four-point sparkle, vertical axis slightly longer
// so it reads as a burst rather than a generic AI sparkle.
const SPARK_PATH =
  "M14 1 C 15.1 9.2, 18.8 12.9, 27 14 C 18.8 15.1, 15.1 18.8, 14 27 C 12.9 18.8, 9.2 15.1, 1 14 C 9.2 12.9, 12.9 9.2, 14 1 Z";

export function LogoMark({
  size = 28,
  className = "",
  color = "var(--energy)",
}: {
  size?: number;
  className?: string;
  color?: string;
}) {
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
      <path d={SPARK_PATH} fill={color} />
    </svg>
  );
}

/** The spark on a rounded tile — app icon, avatars, favicons. */
export function LogoTile({
  size = 40,
  className = "",
  tile = "var(--energy)",
  mark = "#ffffff",
}: {
  size?: number;
  className?: string;
  tile?: string;
  mark?: string;
}) {
  const radius = Math.round(size * 0.28);
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, background: tile, borderRadius: radius }}
      aria-hidden="true"
    >
      <LogoMark size={Math.round(size * 0.62)} color={mark} />
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
  color = "var(--energy)",
}: {
  size?: number;
  className?: string;
  color?: string;
}) {
  return <LogoMark size={size} className={className} color={color} />;
}
