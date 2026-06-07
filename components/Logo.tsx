/**
 * Hyperfix brand — NEO-BRUTALIST
 *
 * The mark is a TARGET: concentric hard-edged squares locking onto a center
 * block. It reads as "fixation" — total, square-jawed focus — and is built
 * from rects with thick black strokes so it stays razor-sharp at any size,
 * from a 16px favicon to a hero block.
 *
 * LogoMark     — the target, on transparent ground.
 * LogoTile     — the target inside a bordered, shadowed app-icon block.
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
  /** fill of the locked-on center + middle ring */
  color?: string;
  /** stroke / outer color */
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
      {/* outer square — the frame */}
      <rect x="2" y="2" width="28" height="28" rx="1.5" fill="var(--bg-elevated)" stroke={ink} strokeWidth="2.5" />
      {/* middle square — the accent block */}
      <rect x="8.5" y="8.5" width="15" height="15" rx="1" fill={color} stroke={ink} strokeWidth="2.5" />
      {/* center block — the lock-on */}
      <rect x="13.5" y="13.5" width="5" height="5" fill={ink} />
    </svg>
  );
}

/** The mark inside a bordered, shadowed tile — app icon / avatar / favicon. */
export function LogoTile({
  size = 40,
  className = "",
  tile = "var(--yellow)",
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
        border: "2.5px solid var(--ink)",
        boxShadow: "3px 3px 0 0 var(--ink)",
      }}
      aria-hidden="true"
    >
      <LogoMark size={Math.round(size * 0.6)} color="var(--bg-elevated)" />
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
