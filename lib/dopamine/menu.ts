// ─────────────────────────────────────────────────────────────
// The dopamine menu: healthy hits to reach for instead of the feed.
// Pure data + a picker. Client-safe.
// ─────────────────────────────────────────────────────────────

import { Footprints, PenLine, MessageCircle, Leaf, Coffee, type LucideIcon } from "lucide-react";

export type Energy = "low" | "med" | "high";
export type DopamineCategory = "move" | "create" | "connect" | "reset" | "treat";

export type DopamineActivity = {
  id: string;
  label: string;
  category: DopamineCategory;
  energy: Energy;
  minutes: number;
};

export const CATEGORY_META: Record<
  DopamineCategory,
  { label: string; icon: LucideIcon; color: string }
> = {
  move:    { label: "Move",    icon: Footprints,    color: "#6f8a63" },
  create:  { label: "Create",  icon: PenLine,       color: "#8a6f63" },
  connect: { label: "Connect", icon: MessageCircle, color: "#63808a" },
  reset:   { label: "Reset",   icon: Leaf,          color: "#7a8a63" },
  treat:   { label: "Treat",   icon: Coffee,        color: "#8a637f" },
};

export const DOPAMINE_MENU: DopamineActivity[] = [
  // MOVE
  { id: "m1", label: "Do 10 wall push-ups. Go.", category: "move", energy: "low", minutes: 2 },
  { id: "m2", label: "Walk to the end of the street and back.", category: "move", energy: "med", minutes: 10 },
  { id: "m3", label: "Put on one song and dance like an idiot.", category: "move", energy: "high", minutes: 4 },
  { id: "m4", label: "Stretch your neck, shoulders, and back.", category: "move", energy: "low", minutes: 3 },
  { id: "m5", label: "Do a 20-minute walk with a podcast.", category: "move", energy: "high", minutes: 20 },
  { id: "m6", label: "Stand up and shake out your whole body.", category: "move", energy: "low", minutes: 1 },

  // CREATE
  { id: "c1", label: "Doodle whatever's in your head for 5 min.", category: "create", energy: "low", minutes: 5 },
  { id: "c2", label: "Voice-memo a rambling idea you've been sitting on.", category: "create", energy: "low", minutes: 3 },
  { id: "c3", label: "Write 3 sentences of literally anything.", category: "create", energy: "low", minutes: 5 },
  { id: "c4", label: "Add to that project you keep thinking about.", category: "create", energy: "high", minutes: 20 },
  { id: "c5", label: "Take one interesting photo of where you are.", category: "create", energy: "low", minutes: 2 },

  // CONNECT
  { id: "n1", label: "Text someone you've been meaning to. One line.", category: "connect", energy: "low", minutes: 3 },
  { id: "n2", label: "Send a meme to a friend with zero context.", category: "connect", energy: "low", minutes: 2 },
  { id: "n3", label: "Reply to that message you've been avoiding.", category: "connect", energy: "med", minutes: 5 },
  { id: "n4", label: "Voice-note a friend instead of typing.", category: "connect", energy: "med", minutes: 5 },
  { id: "n5", label: "Join a Focus Room and work near someone.", category: "connect", energy: "high", minutes: 25 },

  // RESET
  { id: "r1", label: "Reset one surface. Just one. Clear it.", category: "reset", energy: "med", minutes: 8 },
  { id: "r2", label: "Drink a full glass of water right now.", category: "reset", energy: "low", minutes: 1 },
  { id: "r3", label: "Open a window and take 5 slow breaths.", category: "reset", energy: "low", minutes: 2 },
  { id: "r4", label: "Reorganize one drawer with a playlist on.", category: "reset", energy: "med", minutes: 15 },
  { id: "r5", label: "Put away 5 things that are out of place.", category: "reset", energy: "low", minutes: 3 },
  { id: "r6", label: "Step outside for 2 minutes of real daylight.", category: "reset", energy: "low", minutes: 2 },

  // TREAT
  { id: "t1", label: "Make your favorite drink, properly.", category: "treat", energy: "low", minutes: 5 },
  { id: "t2", label: "Put headphones on and fully feel one song.", category: "treat", energy: "low", minutes: 4 },
  { id: "t3", label: "Watch ONE funny clip, then put the phone down.", category: "treat", energy: "low", minutes: 3 },
  { id: "t4", label: "Lie down and do nothing for 5 real minutes.", category: "treat", energy: "low", minutes: 5 },
];

// XP per hit, scaled gently by effort.
export function xpFor(a: DopamineActivity): number {
  const byEnergy: Record<Energy, number> = { low: 8, med: 12, high: 18 };
  return byEnergy[a.energy];
}

// Probability a hit pays out a jackpot, and the multiplier when it does.
export const JACKPOT_CHANCE = 0.125; // ~1 in 8
export const JACKPOT_MULTIPLIER = 3;

/**
 * Roll the actual XP for a completed hit. Most hits pay the base value, but
 * ~1 in 8 pays a 3x jackpot. The unpredictability is the point — a variable
 * reward keeps the ADHD dopamine loop alive where a fixed reward goes stale.
 */
export function rollHitXp(a: DopamineActivity): { xp: number; base: number; jackpot: boolean } {
  const base = xpFor(a);
  const jackpot = Math.random() < JACKPOT_CHANCE;
  return { xp: jackpot ? base * JACKPOT_MULTIPLIER : base, base, jackpot };
}

/**
 * Pick a hit matched to the user's current energy + available time.
 * `exclude` lets the UI reroll without repeating the same suggestion.
 */
export function pickHit(opts: {
  energy?: Energy;
  maxMinutes?: number;
  category?: DopamineCategory;
  exclude?: string;
}): DopamineActivity {
  const { energy, maxMinutes, category, exclude } = opts;
  let pool = DOPAMINE_MENU.filter((a) => {
    if (energy && a.energy !== energy) return false;
    if (maxMinutes && a.minutes > maxMinutes) return false;
    if (category && a.category !== category) return false;
    if (exclude && a.id === exclude) return false;
    return true;
  });
  // Relax filters if we filtered everything out.
  if (pool.length === 0) pool = DOPAMINE_MENU.filter((a) => a.id !== exclude);
  if (pool.length === 0) pool = DOPAMINE_MENU;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function activityById(id: string): DopamineActivity | undefined {
  return DOPAMINE_MENU.find((a) => a.id === id);
}
