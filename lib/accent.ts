export const DEFAULT_ACCENT = "#5EEAD4";

export const ACCENT_PRESETS: { name: string; hex: string }[] = [
  { name: "Teal", hex: "#5EEAD4" },
  { name: "Violet", hex: "#A78BFA" },
  { name: "Rose", hex: "#FB7185" },
  { name: "Amber", hex: "#FBBF24" },
  { name: "Sky", hex: "#38BDF8" },
  { name: "Lime", hex: "#A3E635" },
  { name: "Coral", hex: "#FF8A65" },
  { name: "Iris", hex: "#818CF8" },
];

const HEX_RE = /^#([0-9a-fA-F]{6})$/;

export function isValidAccent(hex: string | null | undefined): hex is string {
  return !!hex && HEX_RE.test(hex);
}

export function hexToRgba(hex: string, alpha: number): string {
  const m = HEX_RE.exec(hex);
  if (!m) return `rgba(94,234,212,${alpha})`;
  const int = parseInt(m[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function resolveAccent(isPro: boolean | null | undefined, accentColor: string | null | undefined): string {
  if (isPro && isValidAccent(accentColor)) return accentColor;
  return DEFAULT_ACCENT;
}
