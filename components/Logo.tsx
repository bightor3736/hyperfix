/**
 * Hyperfix brand — geometric mark
 *
 * LogoMark    — rounded-square tile with a layered hexagon mark inside.
 *               Reads from 16px favicon up to hero sizes.
 * LogoWordmark — "hyperfix" lowercase, display serif, single weight.
 * LogoLockup  — mark + wordmark.
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
      <defs>
        <linearGradient id="hf-tile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#15171A" />
          <stop offset="100%" stopColor="#0A0B0D" />
        </linearGradient>
        <linearGradient id="hf-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5EEAD4" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
      </defs>

      {/* Tile */}
      <rect width="64" height="64" rx="15" fill="url(#hf-tile)" />
      <rect
        x="0.5"
        y="0.5"
        width="63"
        height="63"
        rx="14.5"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
      />

      {/* Optional outer glow ring */}
      {glow && (
        <rect
          width="64"
          height="64"
          rx="15"
          fill="none"
          stroke="#5EEAD4"
          strokeWidth="1.5"
          strokeOpacity="0.45"
        />
      )}

      {/* Outer hex outline */}
      <path
        d="M32 10 L50 20 L50 44 L32 54 L14 44 L14 20 Z"
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Inner offset hex — the "fixation" */}
      <path
        d="M32 22 L42 28 L42 40 L32 46 L22 40 L22 28 Z"
        fill="url(#hf-fill)"
      />

      {/* Center dot — point of focus */}
      <circle cx="32" cy="34" r="2.5" fill="#0A1F1C" />
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
      ? "text-xl tracking-tight font-semibold"
      : size === "lg"
        ? "text-5xl tracking-tight font-semibold"
        : "text-2xl tracking-tight font-semibold";

  return (
    <span className={`font-display leading-none ${cls} text-ink ${className}`}>
      hyperfix
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
      ? "text-xl tracking-tight font-semibold"
      : size === "lg"
        ? "text-5xl tracking-tight font-semibold"
        : "text-2xl tracking-tight font-semibold";

  return (
    <span className={`font-display leading-none ${cls} text-paper ${className}`}>
      hyperfix
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
  const markPx = size === "sm" ? 26 : size === "lg" ? 48 : 32;
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={markPx} glow={glow} />
      <LogoWordmark size={size} />
    </span>
  );
}

/** Standalone hex-mark icon — no tile, just the geometry. For decorative use. */
export function SparkIcon({
  size = 20,
  color = "#5EEAD4",
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
        d="M32 8 L54 20 L54 44 L32 56 L10 44 L10 20 Z"
        fill={color}
        opacity="0.18"
      />
      <path
        d="M32 16 L46 24 L46 40 L32 48 L18 40 L18 24 Z"
        fill={color}
      />
    </svg>
  );
}
