export type BannerPreset = {
  id: string;
  label: string;
  /** Two or three stops for the gradient — first is the dominant tone. */
  palette: string[];
};

/**
 * 24 curated gradient banner presets used by /api/banner-preset/[id]
 * and the BannerGalleryPicker component.
 *
 * Palettes are listed dark → light → accent to make the runtime
 * gradient generator predictable.
 */
export const BANNER_PRESETS: BannerPreset[] = [
  // ── Teal ────────────────────────────────────────────────
  { id: "aurora-teal",   label: "Aurora",  palette: ["#021617", "#0E3B3A", "#5EEAD4"] },
  { id: "breeze-teal",   label: "Breeze",  palette: ["#0A1F2A", "#1B4E59", "#7FD8C8"] },
  { id: "deep-teal",     label: "Deep",    palette: ["#01100F", "#063434", "#2DD4BF"] },
  { id: "ice-teal",      label: "Ice",     palette: ["#0D1B22", "#1F4750", "#A5F3E9"] },

  // ── Amber / Orange ──────────────────────────────────────
  { id: "sunset-amber",  label: "Sunset",  palette: ["#1A0A05", "#5C2110", "#FB923C"] },
  { id: "ember-amber",   label: "Ember",   palette: ["#150703", "#4A1605", "#F97316"] },
  { id: "copper-amber",  label: "Copper",  palette: ["#1B0F08", "#5A2E18", "#D97757"] },
  { id: "gold-amber",    label: "Gold",    palette: ["#1A1304", "#5C3F0D", "#FACC15"] },

  // ── Pink / Red ─────────────────────────────────────────
  { id: "crimson-red",   label: "Crimson", palette: ["#15040A", "#4D0A1A", "#E11D48"] },
  { id: "rose-pink",     label: "Rose",    palette: ["#1A0710", "#4D1530", "#FB7185"] },
  { id: "magenta-pink",  label: "Magenta", palette: ["#150516", "#4A0E48", "#EC4899"] },
  { id: "blood-red",     label: "Blood",   palette: ["#0D0203", "#3B0608", "#B91C1C"] },

  // ── Purple / Violet ────────────────────────────────────
  { id: "vapor-purple",  label: "Vapor",   palette: ["#0B061B", "#2B1B5A", "#A78BFA"] },
  { id: "dusk-purple",   label: "Dusk",    palette: ["#0E0820", "#311E63", "#9B8AFB"] },
  { id: "plum-purple",   label: "Plum",    palette: ["#160820", "#3D1858", "#C084FC"] },
  { id: "indigo-violet", label: "Indigo",  palette: ["#06081F", "#1E2266", "#6366F1"] },

  // ── Green ──────────────────────────────────────────────
  { id: "forest-green",  label: "Forest",  palette: ["#03100A", "#0E3823", "#22C55E"] },
  { id: "lime-green",    label: "Lime",    palette: ["#0A1505", "#274D0E", "#84CC16"] },
  { id: "sage-green",    label: "Sage",    palette: ["#0F1612", "#2E3F33", "#A3B59F"] },
  { id: "emerald-green", label: "Emerald", palette: ["#031410", "#064E3B", "#10B981"] },

  // ── Neutral ────────────────────────────────────────────
  { id: "noir-neutral",  label: "Noir",    palette: ["#050506", "#1A1A1C", "#3F3F46"] },
  { id: "paper-cream",   label: "Paper",   palette: ["#1D1A14", "#4A4537", "#F4EFE6"] },
  { id: "fog-neutral",   label: "Fog",     palette: ["#0D1014", "#2A323B", "#94A3B8"] },
  { id: "slate-neutral", label: "Slate",   palette: ["#08090C", "#1E2530", "#64748B"] },
];

export function getBannerPreset(id: string): BannerPreset | undefined {
  return BANNER_PRESETS.find((p) => p.id === id);
}

export function bannerPresetUrl(id: string, origin?: string): string {
  const base =
    origin ??
    (typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://hyperfix.app");
  return `${base}/api/banner-preset/${id}`;
}
