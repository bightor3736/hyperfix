export type ProFeature = {
  icon: string;
  name: string;
  desc: string;
};

export const PRO_FEATURES: ProFeature[] = [
  {
    icon: "🎨",
    name: "Custom accent color",
    desc: "Pick your profile's accent from a palette — it tints your hero, badge, and share card.",
  },
  {
    icon: "🖼️",
    name: "Profile banner",
    desc: "Add a full-width cover image to the top of your public profile.",
  },
  {
    icon: "📌",
    name: "Multiple pinned fixes",
    desc: "Pin up to 3 hyperfixations to the top of your profile instead of just one.",
  },
  {
    icon: "📊",
    name: "Private analytics",
    desc: "Streak history, intensity trends, and category breakdowns — a dashboard only you see.",
  },
  {
    icon: "📦",
    name: "Data export",
    desc: "Download every fix, check-in, and comment as a JSON file.",
  },
  {
    icon: "✦",
    name: "Pro badge",
    desc: "A glowing PRO badge on your profile so everyone knows you mean it.",
  },
];
