// Monoline SVG icons for fixation categories.
// Drop-in replacement for every CATEGORY_EMOJI lookup across the app.

type IconProps = { size?: number; className?: string; color?: string };

const base = (size: number, color?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: color ?? "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

// song / music
export function SongIcon({ size = 16, className, color }: IconProps) {
  return (
    <svg {...base(size, color)} className={className} aria-hidden>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

// fanfic
export function FanficIcon({ size = 16, className, color }: IconProps) {
  return (
    <svg {...base(size, color)} className={className} aria-hidden>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      <path d="M12 12a2 2 0 0 1 4 0 2 2 0 0 1-2 2 2 2 0 0 1-2-2z" />
    </svg>
  );
}

// show / tv
export function ShowIcon({ size = 16, className, color }: IconProps) {
  return (
    <svg {...base(size, color)} className={className} aria-hidden>
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="m7 2 5 4 5-4" />
    </svg>
  );
}

// film
export function FilmIcon({ size = 16, className, color }: IconProps) {
  return (
    <svg {...base(size, color)} className={className} aria-hidden>
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <path d="M7 3v18M17 3v18M2 12h20M2 7.5h5M2 16.5h5M17 7.5h5M17 16.5h5" />
    </svg>
  );
}

// ship (heart)
export function ShipIcon({ size = 16, className, color }: IconProps) {
  return (
    <svg {...base(size, color)} className={className} aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

// game (controller)
export function GameIcon({ size = 16, className, color }: IconProps) {
  return (
    <svg {...base(size, color)} className={className} aria-hidden>
      <path d="M17.5 17 22 8.5a5 5 0 0 0-9-3 5 5 0 0 0-9 3L6.5 17a3 3 0 0 0 5.5-1h0a3 3 0 0 0 5.5 1z" />
      <line x1="8" y1="11" x2="10" y2="11" />
      <line x1="9" y1="10" x2="9" y2="12" />
      <line x1="14.5" y1="11" x2="15" y2="11" />
      <line x1="17" y1="11" x2="17.5" y2="11" />
    </svg>
  );
}

// video essay
export function VideoEssayIcon({ size = 16, className, color }: IconProps) {
  return (
    <svg {...base(size, color)} className={className} aria-hidden>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  );
}

// podcast (mic)
export function PodcastIcon({ size = 16, className, color }: IconProps) {
  return (
    <svg {...base(size, color)} className={className} aria-hidden>
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

// book
export function BookIcon({ size = 16, className, color }: IconProps) {
  return (
    <svg {...base(size, color)} className={className} aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

// character (sparkle)
export function CharacterIcon({ size = 16, className, color }: IconProps) {
  return (
    <svg {...base(size, color)} className={className} aria-hidden>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// other (star)
export function OtherIcon({ size = 16, className, color }: IconProps) {
  return (
    <svg {...base(size, color)} className={className} aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// person (real person enjoyer)
export function PersonIcon({ size = 16, className, color }: IconProps) {
  return (
    <svg {...base(size, color)} className={className} aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

// Mapping: category → component
const ICON_BY_CATEGORY: Record<string, (p: IconProps) => React.JSX.Element> = {
  song: SongIcon,
  fanfic: FanficIcon,
  show: ShowIcon,
  film: FilmIcon,
  ship: ShipIcon,
  game: GameIcon,
  "video essay": VideoEssayIcon,
  podcast: PodcastIcon,
  book: BookIcon,
  character: CharacterIcon,
  person: PersonIcon,
  other: OtherIcon,
};

// Map: category → accent color (used for chips, borders)
export const CATEGORY_COLOR: Record<string, string> = {
  song: "#F59E0B",
  fanfic: "#EC4899",
  show: "#A78BFA",
  film: "#3B82F6",
  ship: "#EF4444",
  game: "#10B981",
  "video essay": "#F97316",
  podcast: "#9B8AFB",
  book: "#F97316",
  character: "#EC4899",
  person: "#06B6D4",
  other: "#9A9A9A",
};

// Single drop-in component: <CategoryIcon category="song" size={16} />
export function CategoryIcon({
  category,
  size = 16,
  className,
  color,
}: {
  category: string;
  size?: number;
  className?: string;
  color?: string;
}) {
  const key = (category ?? "other").toLowerCase();
  const Cmp = ICON_BY_CATEGORY[key] ?? OtherIcon;
  return <Cmp size={size} className={className} color={color} />;
}

// Helper: emoji-free label for legacy emoji strings (use when fixing notification/email text)
export function categoryLabel(category: string): string {
  const key = (category ?? "other").toLowerCase();
  if (key === "video essay") return "video essay";
  return key;
}
