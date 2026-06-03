// Profile themes drive the background "vibe" of a public profile page — the
// Discord/Vault-style customization layer. Each theme renders over the app's
// near-black base so foreground text stays readable.
//
// `accent` lets a theme tint itself to the user's chosen accent colour; pass
// the resolved hex in and the gradient picks it up.

export interface ProfileTheme {
  id: string;
  name: string;
  /** Builds the page background CSS. `accent` is the user's resolved hex. */
  background: (accent: string) => string;
  /** Premium themes are gated behind Pro. */
  pro?: boolean;
}

import { hexToRgba } from "@/lib/accent";

export const PROFILE_THEMES: ProfileTheme[] = [
  {
    id: "aurora",
    name: "Aurora",
    background: (a) =>
      [
        `radial-gradient(ellipse 80% 60% at 80% -10%, ${hexToRgba(a, 0.22)} 0%, transparent 55%)`,
        `radial-gradient(ellipse 70% 60% at 10% 10%, rgba(99,102,241,0.16) 0%, transparent 55%)`,
        "var(--bg)",
      ].join(", "),
  },
  {
    id: "midnight",
    name: "Midnight",
    background: () =>
      ["linear-gradient(180deg, #0b1020 0%, #070708 60%)", "var(--bg)"].join(", "),
  },
  {
    id: "sunset",
    name: "Sunset",
    background: () =>
      [
        "radial-gradient(ellipse 90% 70% at 50% -20%, rgba(251,113,133,0.22) 0%, transparent 55%)",
        "radial-gradient(ellipse 70% 50% at 90% 0%, rgba(251,191,36,0.16) 0%, transparent 50%)",
        "var(--bg)",
      ].join(", "),
  },
  {
    id: "forest",
    name: "Forest",
    background: () =>
      [
        "radial-gradient(ellipse 80% 60% at 20% -10%, rgba(34,197,94,0.18) 0%, transparent 55%)",
        "var(--bg)",
      ].join(", "),
  },
  {
    id: "tide",
    name: "Tide",
    background: () =>
      [
        "radial-gradient(ellipse 90% 70% at 50% 110%, rgba(56,189,248,0.20) 0%, transparent 55%)",
        "var(--bg)",
      ].join(", "),
  },
  {
    id: "mono",
    name: "Mono",
    background: () => "var(--bg)",
  },
  // Pro-only — animated/lush gradients.
  {
    id: "nebula",
    name: "Nebula",
    pro: true,
    background: (a) =>
      [
        `radial-gradient(ellipse 70% 90% at 110% 60%, ${hexToRgba(a, 0.42)} 0%, transparent 55%)`,
        "radial-gradient(ellipse 60% 70% at -10% 10%, rgba(168,85,247,0.32) 0%, transparent 50%)",
        "linear-gradient(160deg, #160f3a 0%, #070708 70%)",
      ].join(", "),
  },
  {
    id: "ember",
    name: "Ember",
    pro: true,
    background: () =>
      [
        "radial-gradient(ellipse 80% 70% at 50% -10%, rgba(251,146,60,0.34) 0%, transparent 55%)",
        "radial-gradient(ellipse 60% 60% at 90% 100%, rgba(220,38,38,0.26) 0%, transparent 50%)",
        "linear-gradient(160deg, #1a0e0e 0%, #070708 70%)",
      ].join(", "),
  },
];

export const DEFAULT_THEME = PROFILE_THEMES[0];

export function getProfileTheme(id: string | null | undefined): ProfileTheme {
  return PROFILE_THEMES.find((t) => t.id === id) ?? DEFAULT_THEME;
}
