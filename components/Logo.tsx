/**
 * Hyperfix brand system
 *
 * LogoMark  — custom ✦ spark symbol. Four-pointed star, vertical axis longer.
 *             Reads cleanly at 16px favicon through hero sizes.
 *
 * LogoWordmark — "hyper" (ink, bold) + "fix" (accent, italic)
 * LogoLockup   — mark + wordmark, horizontally aligned
 */

export function LogoMark({
  size = 32,
  className = "",
  glow = false,
}: {
  size?: number;
  className?: string;
  glow?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Tile background */}
      <rect width="64" height="64" rx="15" fill="#0D0B10" />

      {/* Optional outer glow ring */}
      {glow && (
        <rect
          width="64" height="64" rx="15"
          fill="none"
          stroke="#A855F7"
          strokeWidth="1.5"
          strokeOpacity="0.35"
        />
      )}

      {/* ✦ Spark mark — 4-pointed star, taller than wide */}
      {/* Top/bottom points at radius 24, left/right at radius 16, inner at radius 8 */}
      <path
        d="M 32 6 L 39 24 L 54 32 L 39 40 L 32 58 L 25 40 L 10 32 L 25 24 Z"
        fill="#A855F7"
      />

      {/* Inner highlight — small bright center diamond */}
      <path
        d="M 32 23 L 36 32 L 32 41 L 28 32 Z"
        fill="rgba(255,255,255,0.18)"
      />
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
  const cls =
    size === "sm"
      ? "text-xl tracking-crush font-black"
      : size === "lg"
        ? "text-5xl tracking-crush font-black"
        : "text-2xl tracking-crush font-black";

  return (
    <span className={`font-display leading-none ${cls} ${className}`}>
      <span className="text-ink not-italic">hyper</span>
      <span className="text-accent italic">fix</span>
    </span>
  );
}

export function LogoDark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const cls =
    size === "sm"
      ? "text-xl tracking-crush font-black"
      : size === "lg"
        ? "text-5xl tracking-crush font-black"
        : "text-2xl tracking-crush font-black";

  return (
    <span className={`font-display leading-none ${cls} ${className}`}>
      <span className="text-paper not-italic">hyper</span>
      <span className="text-accent italic">fix</span>
    </span>
  );
}

export { LogoWordmark as LogoFull };

export function LogoLockup({
  className = "",
  size = "md",
  glow = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}) {
  const markPx = size === "sm" ? 24 : size === "lg" ? 44 : 30;
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={markPx} glow={glow} />
      <LogoWordmark size={size} />
    </span>
  );
}

/** Standalone ✦ spark icon — no tile, just the path. For decorative use. */
export function SparkIcon({
  size = 20,
  color = "#A855F7",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M 32 6 L 39 24 L 54 32 L 39 40 L 32 58 L 25 40 L 10 32 L 25 24 Z"
        fill={color}
      />
    </svg>
  );
}
