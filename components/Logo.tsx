/**
 * Hyperfix brand — NEO-BRUTALIST
 *
 * The mark is a FOCUS LOCK: four hard corner brackets (the universal
 * camera/scanner "locked-on" frame) clamping a solid center block. It reads
 * instantly as fixation — total, locked-in focus — and is built from plain
 * rects so it stays razor-sharp at any size, from a 16px favicon to a hero.
 *
 * LogoMark     — the lock, on transparent ground.
 * LogoTile     — the lock inside a bordered, shadowed app-icon block.
 * LogoWordmark — "hyperfix" in Space Grotesk, heavy, tight.
 * LogoLockup   — mark + wordmark.
 */

export function LogoMark({
  size = 28,
  className = "",
  color = "var(--accent)",
  ink = "var(--ink)",
}: {
  size?: number;
  className?: string;
  /** fill of the locked-on center block */
  color?: string;
  /** color of the corner brackets + center border */
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
      <g fill={ink}>
        {/* top-left bracket */}
        <rect x="3" y="3" width="3" height="8" />
        <rect x="3" y="3" width="8" height="3" />
        {/* top-right bracket */}
        <rect x="26" y="3" width="3" height="8" />
        <rect x="21" y="3" width="8" height="3" />
        {/* bottom-left bracket */}
        <rect x="3" y="21" width="3" height="8" />
        <rect x="3" y="26" width="8" height="3" />
        {/* bottom-right bracket */}
        <rect x="26" y="21" width="3" height="8" />
        <rect x="21" y="26" width="8" height="3" />
      </g>
      {/* locked-on center block */}
      <rect x="11.5" y="11.5" width="9" height="9" fill={color} stroke={ink} strokeWidth="2.5" />
    </svg>
  );
}

/** The mark inside a bordered, shadowed tile — app icon / avatar / favicon. */
export function LogoTile({
  size = 40,
  className = "",
  tile = "var(--accent)",
}: {
  size?: number;
  className?: string;
  tile?: string;
}) {
  const radius = Math.max(4, Math.round(size * 0.14));
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        background: tile,
        borderRadius: radius,
        border: "1.5px solid var(--line-strong)",
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
      style={{ fontWeight: 700, letterSpacing: "-0.04em" }}
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
