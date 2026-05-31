import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // App (dashboard) palette — hardcoded dark
        paper: "#080808",
        paperDeep: "#111113",
        paperMid: "#161618",
        inkSoft: "#9A9A9A",
        muted: "hsl(var(--muted))",
        mint: "#5EEAD4",
        mintDeep: "#2DD4BF",
        mintInk: "#0A1F1C",
        hot: "#E63946",
        warm: "#FB923C",
        success: "#34D399",
        danger: "#E63946",
        // Landing design tokens — CSS variable-based (light/dark aware)
        bg:          "var(--bg)",
        "bg-soft":   "var(--bg-soft)",
        "bg-elevated": "var(--bg-elevated)",
        ink:         "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        "ink-faint": "var(--ink-faint)",
        line:        "var(--line)",
        "line-strong": "var(--line-strong)",
        accent:      "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        "accent-ink":  "var(--accent-ink)",
        "invert-bg":   "var(--invert-bg)",
        "invert-ink":  "var(--invert-ink)",
        // shadcn compatibility tokens
        background:           "var(--background)",
        card:                "var(--card)",
        "card-foreground":   "var(--card-foreground)",
        popover:             "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        primary:             "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        "muted-foreground":  "var(--muted-foreground)",
        foreground:          "var(--foreground)",
        border:              "var(--border)",
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
