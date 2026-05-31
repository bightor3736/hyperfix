import type { ComponentType } from "react";
import {
  SparkleIcon,
  PinIcon,
  LibraryIcon,
  NoteIcon,
  BrainIcon,
} from "@/components/LandingIcons";
import { GiftIcon } from "@/components/MilestoneIcons";

type IconComponent = ComponentType<{ size?: number; className?: string }>;

export type ProFeature = {
  Icon: IconComponent;
  name: string;
  desc: string;
};

export const PRO_FEATURES: ProFeature[] = [
  {
    Icon: SparkleIcon,
    name: "1.5× XP, always on",
    desc: "Every check-in, log, and task earns 50% more points — climb the leaderboard faster.",
  },
  {
    Icon: BrainIcon,
    name: "5 streak freezes / month",
    desc: "Miss a day? A freeze auto-covers it so your streak survives. Refills monthly. Free plan gets 2 total.",
  },
  {
    Icon: GiftIcon,
    name: "Custom accent color",
    desc: "Pick your profile's accent from a palette — it tints your hero, badge, and share card.",
  },
  {
    Icon: NoteIcon,
    name: "Profile banner",
    desc: "Add a full-width cover image to the top of your public profile.",
  },
  {
    Icon: PinIcon,
    name: "Multiple pinned fixes",
    desc: "Pin up to 3 hyperfixations to the top of your profile instead of just one.",
  },
  {
    Icon: BrainIcon,
    name: "Private analytics",
    desc: "Streak history, intensity trends, and category breakdowns — a dashboard only you see.",
  },
  {
    Icon: LibraryIcon,
    name: "Data export",
    desc: "Download every fix, check-in, and comment as a JSON file.",
  },
  {
    Icon: SparkleIcon,
    name: "Pro badge",
    desc: "A glowing PRO badge on your profile so everyone knows you mean it.",
  },
];
