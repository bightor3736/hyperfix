/**
 * Hyperfix brand — SOFT & FRIENDLY
 *
 * The mark is a START SPARK: a rounded play triangle (the universal "go")
 * with a small spark dot floating off its top-right corner — the moment of
 * ignition. Round joins everywhere; it reads warm at 16px and at hero size.
 *
 * LogoMark     — the start spark, on transparent ground.
 * LogoTile     — the spark inside a soft squircle app-icon tile.
 * LogoWordmark — "hyperfix" lowercase, rounded, friendly.
 * LogoLockup   — mark + wordmark.
 */

export function LogoMark({
  size = 28,
  className = "",
  color = "var(--accent)",
  ink = "var(--yellow)",
}: {
  size?: number;
  className?: string;
  /** fill of the play triangle */
  color?: string;
  /** color of the spark dot */
  ink?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* rounded play triangle — heavy round-join stroke does the softening */}
      <path
        d="M11 9.5 L23.5 16.75 L11 24 Z"
        fill={color}
        stroke={color}
        strokeWidth="5.5"
        strokeLinejoin="round"
      />
      {/* spark dot — the moment it catches */}
      <circle cx="25.5" cy="6.5" r="3.5" fill={ink} />
    </svg>
  );
}

/** The mark inside a soft squircle tile — app icon / avatar / favicon. */
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
      <LogoMark size={Math.round(size * 0.62)} color="#FFFFFF" ink="#FFFFFF" />
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
      <LogoMark size={markPx} />
      <LogoWordmark size={size} />
    </span>
  );
}

/** Mark without text — decorative / favicon use. */
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
