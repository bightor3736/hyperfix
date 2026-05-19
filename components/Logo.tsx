/**
 * Hyperfix logo system — pure typographic wordmark.
 * No icon container. The word is the mark.
 *
 * LogoWordmark — "hyperfix" in Fraunces, hyper=ink, fix=accent italic
 * LogoDark     — same but hyper=paper for dark backgrounds
 */

export function LogoWordmark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const cls =
    size === "sm"
      ? "text-xl tracking-crush font-medium"
      : size === "lg"
      ? "text-5xl tracking-crush font-medium"
      : "text-2xl tracking-crush font-medium";

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
      ? "text-xl tracking-crush font-medium"
      : size === "lg"
      ? "text-5xl tracking-crush font-medium"
      : "text-2xl tracking-crush font-medium";

  return (
    <span className={`font-display leading-none ${cls} ${className}`}>
      <span className="text-paper not-italic">hyper</span>
      <span className="text-accent italic">fix</span>
    </span>
  );
}

export { LogoWordmark as LogoFull };

/**
 * LogoMark — geometric hyperfix monomark.
 * Two stacked angular lime blades with a deeper-green overlap band,
 * set on a rounded near-black tile. Reads cleanly down to favicon size.
 */
export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
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
      <rect width="64" height="64" rx="14" fill="#0A0A0A" />
      <path d="M14 12 L44 12 L50 26 L20 26 Z" fill="#A3E635" />
      <path d="M20 30 L50 30 L44 52 L14 52 Z" fill="#A3E635" />
      <path d="M20 26 L50 26 L50 30 L20 30 Z" fill="#7CB205" />
    </svg>
  );
}

/**
 * LogoLockup — mark + wordmark, horizontally aligned.
 */
export function LogoLockup({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const markPx = size === "sm" ? 24 : size === "lg" ? 44 : 30;
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={markPx} />
      <LogoWordmark size={size} />
    </span>
  );
}
