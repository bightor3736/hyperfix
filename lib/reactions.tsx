import {
  RepeatIcon,
  SwirlIcon,
  TombIcon,
  FlameIcon,
  HeartIcon,
  UsersIcon,
} from "@/components/LandingIcons";
import type { ComponentType } from "react";

export type ReactionType =
  | "loop"
  | "spiral"
  | "buried"
  | "obsessed"
  | "love"
  | "same";

export type ReactionMeta = {
  key: ReactionType;
  label: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
};

export const REACTION_TYPES: ReactionMeta[] = [
  { key: "loop", label: "loop", Icon: RepeatIcon },
  { key: "spiral", label: "spiral", Icon: SwirlIcon },
  { key: "buried", label: "buried", Icon: TombIcon },
  { key: "obsessed", label: "obsessed", Icon: FlameIcon },
  { key: "love", label: "love", Icon: HeartIcon },
  { key: "same", label: "same", Icon: UsersIcon },
];

export const REACTION_KEYS: ReactionType[] = REACTION_TYPES.map((r) => r.key);

const REACTION_BY_KEY: Record<ReactionType, ReactionMeta> = REACTION_TYPES.reduce(
  (acc, r) => {
    acc[r.key] = r;
    return acc;
  },
  {} as Record<ReactionType, ReactionMeta>,
);

const LEGACY_EMOJI_MAP: Record<string, ReactionType> = {
  "💀": "buried",
  "😭": "spiral",
  "🔁": "loop",
  "💜": "love",
  "🎵": "same",
  "📖": "obsessed",
  "🔥": "obsessed",
  "❤️": "love",
  "✨": "love",
};

/**
 * Map any stored reaction value (old emoji or new type string) to a ReactionType.
 * Returns null only when the input is empty/invalid.
 */
export function legacyEmojiToType(value: string): ReactionType | null {
  if (!value) return null;
  // Already a new-style type?
  if ((REACTION_KEYS as string[]).includes(value)) {
    return value as ReactionType;
  }
  if (LEGACY_EMOJI_MAP[value]) return LEGACY_EMOJI_MAP[value];
  // Unknown legacy emoji — bucket into "same"
  return "same";
}

export function getReactionMeta(type: ReactionType): ReactionMeta {
  return REACTION_BY_KEY[type];
}

/**
 * Collapse a counts map keyed by either legacy emoji or new type into a map
 * keyed strictly by ReactionType.
 */
export function normalizeReactionCounts(
  counts: Record<string, number>,
): Record<ReactionType, number> {
  const out: Record<ReactionType, number> = {
    loop: 0,
    spiral: 0,
    buried: 0,
    obsessed: 0,
    love: 0,
    same: 0,
  };
  for (const [k, v] of Object.entries(counts ?? {})) {
    const t = legacyEmojiToType(k);
    if (!t) continue;
    out[t] = (out[t] ?? 0) + v;
  }
  return out;
}

/**
 * Collapse an array of stored reaction values (legacy emoji or new type)
 * into a Set of active ReactionType values.
 */
export function normalizeUserReactions(values: string[]): ReactionType[] {
  const set = new Set<ReactionType>();
  for (const v of values ?? []) {
    const t = legacyEmojiToType(v);
    if (t) set.add(t);
  }
  return Array.from(set);
}
