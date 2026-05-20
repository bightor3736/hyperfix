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

      {/* Lit facets */}
      <path d="M58,32 L50,14 L32,32 Z" fill="#3CCFBA" />
      <path d="M32,58 L14,50 L32,32 Z" fill="#3CCFBA" />
      <path d="M6,32 L14,14 L32,32 Z" fill="#3CCFBA" />
      <path d="M32,6 L50,14 L32,32 Z" fill="#5EEAD4" />

      {/* Shadow facets */}
      <path d="M58,32 L50,50 L32,32 Z" fill="#0D9488" />
      <path d="M50,50 L32,58 L32,32 Z" fill="#0A7A70" />
      <path d="M14,50 L6,32 L32,32 Z" fill="#0D9488" />
      <path d="M14,14 L32,6 L32,32 Z" fill="#0A7A70" />

      {/* Outer octagon stroke */}
      <path d="M58,32 L50,50 L32,58 L14,50 L6,32 L14,14 L32,6 L50,14 Z" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {/* Inner table */}
      <path d="M43,32 L39,39 L32,43 L25,39 L21,32 L25,25 L32,21 L39,25 Z" fill="rgba(255,255,255,0.18)" />

      {/* Facet lines outer → inner */}
      <line x1="58" y1="32" x2="43" y2="32" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
      <line x1="50" y1="50" x2="39" y2="39" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
      <line x1="32" y1="58" x2="32" y2="43" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
      <line x1="14" y1="50" x2="25" y2="39" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
      <line x1="6" y1="32" x2="21" y2="32" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
      <line x1="14" y1="14" x2="25" y2="25" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
      <line x1="32" y1="6" x2="32" y2="21" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
      <line x1="50" y1="14" x2="39" y2="25" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
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

/** Standalone gem mark — no tile, just the geometry. For decorative use. */
export function SparkIcon({
  size = 20,
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
      <path d="M58,32 L50,14 L32,32 Z" fill="#3CCFBA" />
      <path d="M32,58 L14,50 L32,32 Z" fill="#3CCFBA" />
      <path d="M6,32 L14,14 L32,32 Z" fill="#3CCFBA" />
      <path d="M32,6 L50,14 L32,32 Z" fill="#5EEAD4" />
      <path d="M58,32 L50,50 L32,32 Z" fill="#0D9488" />
      <path d="M50,50 L32,58 L32,32 Z" fill="#0A7A70" />
      <path d="M14,50 L6,32 L32,32 Z" fill="#0D9488" />
      <path d="M14,14 L32,6 L32,32 Z" fill="#0A7A70" />
      <path d="M58,32 L50,50 L32,58 L14,50 L6,32 L14,14 L32,6 L50,14 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <path d="M43,32 L39,39 L32,43 L25,39 L21,32 L25,25 L32,21 L39,25 Z" fill="rgba(255,255,255,0.25)" />
    </svg>
  );
}
