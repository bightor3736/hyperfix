// Monoline SVG icons for streak / milestone badges. Replaces emoji-based milestones.

type IconProps = { size?: number; className?: string };

const baseProps = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function SkullIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M12 2a8 8 0 0 0-8 8v6a2 2 0 0 0 2 2h1v3h10v-3h1a2 2 0 0 0 2-2v-6a8 8 0 0 0-8-8z" />
      <circle cx="9" cy="11" r="1.5" />
      <circle cx="15" cy="11" r="1.5" />
      <path d="M10 17h4" />
    </svg>
  );
}

export function TrophyIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M7 6H4a2 2 0 0 0 0 4h3" />
      <path d="M17 6h3a2 2 0 0 1 0 4h-3" />
    </svg>
  );
}

export function ConfettiIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M4 20l4-12 8 8z" />
      <path d="M14 5l2 2" />
      <path d="M18 3l1 1" />
      <path d="M20 8l1 1" />
      <path d="M17 11l2 2" />
    </svg>
  );
}

export function HeartCrackIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      <path d="M12 6l-2 4 3 2-2 4" />
    </svg>
  );
}

export function TombstoneIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M5 21V11a7 7 0 0 1 14 0v10" />
      <path d="M3 21h18" />
      <path d="M9 10h6M12 10v6" />
    </svg>
  );
}

export function GiftIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 1 1 0-5C9 3 12 8 12 8s3-5 4.5-5a2.5 2.5 0 1 1 0 5" />
    </svg>
  );
}
