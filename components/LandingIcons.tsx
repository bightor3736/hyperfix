// Monoline SVG icons for the landing page. Match vvault.app aesthetic.
// All icons are 22×22 viewBox 24×24, stroke="currentColor" strokeWidth="1.6".

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

export function HeadphonesIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

export function NoteIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h6" />
      <path d="M8 17h8" />
    </svg>
  );
}

export function XIcon({ size = 22, className }: IconProps) {
  // Twitter / X glyph
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function ChatIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function PinIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M11 8c0-1.1.9-2 2-2s2 .9 2 2c0 1.5-1.5 1.5-2 4l-1 4-1-4c-.4-2-2-2.5-2-4 0-1.1.9-2 2-2" />
    </svg>
  );
}

export function BrainIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z" />
    </svg>
  );
}

// Niche tracker icons
export function MicIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

export function SparkleIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function BookIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

export function RepeatIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

export function LibraryIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <line x1="4" y1="6" x2="4" y2="20" />
      <line x1="8" y1="4" x2="8" y2="20" />
      <path d="M11 4h6l3 14-6 2z" />
    </svg>
  );
}

export function BoltIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}

// Workflow / status
export function FlameIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

export function HeartIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function SwirlIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M12 12 m0 -6 a6 6 0 1 1 -6 6 a4 4 0 0 1 4 -4 a2.5 2.5 0 0 1 2.5 2.5 a1.5 1.5 0 0 1 -1.5 1.5" />
    </svg>
  );
}

export function TombIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M5 20V12a7 7 0 0 1 14 0v8z" />
      <path d="M3 20h18" />
      <path d="M10 11h4" />
      <path d="M12 11v4" />
    </svg>
  );
}

export function UsersIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      <path d="M2 20c0-3.5 3.13-6 7-6s7 2.5 7 6" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7" />
      <path d="M17 14c2.5.5 5 2.6 5 6" />
    </svg>
  );
}
