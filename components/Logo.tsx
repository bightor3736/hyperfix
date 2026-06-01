/**
 * Hyperfix brand — warm, friendly, a little obsessive
 *
 * LogoMark     — a soft "bloom" (a rounded quatrefoil). Reads as warmth and
 *                energy rather than a generic sparkle. Purple by default,
 *                single colour, legible from 16px favicon to hero.
 * LogoWordmark — "hyperfix" in Fraunces medium.
 * LogoLockup   — mark + wordmark.
 * LogoTile     — the bloom on a rounded app-icon tile (for icons / avatars).
 */

// The bloom: four overlapping rounded lobes around a center — a friendly,
// organic burst. Built from circles so it stays crisp at any size.
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
      <g fill={color}>
        <circle cx="14" cy="7.4" r="6.6" />
        <circle cx="14" cy="20.6" r="6.6" />
        <circle cx="7.4" cy="14" r="6.6" />
        <circle cx="20.6" cy="14" r="6.6" />
        <circle cx="14" cy="14" r="6.6" />
      </g>
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
