import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base
        paper: "#080808",
        paperDeep: "#111113",
        paperMid: "#161618",
        ink: "#F4F4F4",
        inkSoft: "#9A9A9A",
        muted: "#525252",
        // Brand — violet spark
        accent: "#A855F7",
        accentDeep: "#7C3AED",
        accentLight: "#C084FC",
        // Intensity spectrum
        hot: "#E63946",       // 9-10 — send help
        warm: "#FB923C",      // 7-8  — deeply unwell
        // Semantic
        success: "#34D399",
        danger: "#E63946",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-instrument)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        crush: "-0.06em",
      },
      borderRadius: {
        card: "18px",
        pill: "999px",
      },
    },
  },
  plugins: [],
};

export default config;
