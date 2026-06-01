// Points awarded per action. Single source of truth.
export const POINT_VALUES = {
  check_in: 10,
  new_fix: 25,
  dopamine_hit: 12,     // base; route overrides per activity energy
  wall_broken: 20,      // started a dreaded task — we reward the START, not the finish
  fixation_log: 10,     // logged a new hyperfixation
  fixation_checkin: 5,  // daily check-in on an active fixation
  fixation_complete: 15, // archived / completed a fixation
  user_creation: 50,
} as const;

export type PointKind = keyof typeof POINT_VALUES | "achievement";

// Human-readable labels for the awards history feed.
export const KIND_LABELS: Record<string, string> = {
  check_in: "Daily check-in",
  new_fix: "Fixation logged",
  dopamine_hit: "Dopamine hit",
  wall_broken: "Wall broken",
  fixation_log: "Hyperfixation logged",
  fixation_checkin: "Fixation check-in",
  fixation_complete: "Fixation completed",
  user_creation: "Joined Hyperfix",
  achievement: "Achievement unlocked",
};

export interface Level {
  id: string;
  name: string;
  description: string;
  points: number;
}

// On-brand level ladder. Thresholds are cumulative total_points.
export const LEVELS: Level[] = [
  { id: "lvl_1", name: "Mildly Curious", description: "Something's caught your eye.", points: 0 },
  { id: "lvl_2", name: "Interested", description: "You think about it daily now.", points: 50 },
  { id: "lvl_3", name: "Invested", description: "It's a personality trait at this point.", points: 150 },
  { id: "lvl_4", name: "Hooked", description: "You've reorganised your life around it.", points: 400 },
  { id: "lvl_5", name: "Unwell", description: "We love that for you.", points: 900 },
  { id: "lvl_6", name: "Feral", description: "There is no off switch.", points: 2000 },
  { id: "lvl_7", name: "Clinically Obsessed", description: "Send help. Or don't.", points: 5000 },
];

export function levelForPoints(points: number): { level: Level; index: number; next: Level | null } {
  let index = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].points) {
      index = i;
      break;
    }
  }
  return {
    level: LEVELS[index],
    index,
    next: index < LEVELS.length - 1 ? LEVELS[index + 1] : null,
  };
}
