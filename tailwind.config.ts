import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#080808",
        paperDeep: "#111113",
        ink: "#F4F4F4",
        inkSoft: "#9A9A9A",
        muted: "#525252",
        accent: "#A3E635",
        accentDeep: "#7CB205",
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
    },
  },
  plugins: [],
};

export default config;
