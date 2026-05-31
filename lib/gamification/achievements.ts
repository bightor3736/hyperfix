import type { SupabaseClient } from "@supabase/supabase-js";

// Trigger type compatible with the AchievementList/AchievementCard UI components.
export type AchievementTrigger = "metric" | "streak" | "api";

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  trigger: AchievementTrigger;
  bonus: number;
  rarity: number;
  /** Which computed stat gates this achievement */
  stat: keyof UserStats;
  /** Threshold the stat must reach */
  threshold: number;
}

// Mirrors the seed rows in 2026_06_01_gamification.sql
export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { id: "first_fix",    name: "First Obsession",    description: "Log your very first hyperfixation.", trigger: "metric", bonus: 25,  rarity: 60, stat: "totalFixes",   threshold: 1 },
  { id: "checkin_7",    name: "One Week In",        description: "Check in 7 days total.",             trigger: "metric", bonus: 30,  rarity: 45, stat: "totalCheckIns", threshold: 7 },
  { id: "checkin_30",   name: "Deeply Unwell",      description: "Check in 30 days total.",            trigger: "metric", bonus: 75,  rarity: 20, stat: "totalCheckIns", threshold: 30 },
  { id: "streak_7",     name: "On A Roll",          description: "Hit a 7-day check-in streak.",       trigger: "streak", bonus: 40,  rarity: 35, stat: "currentStreak", threshold: 7 },
  { id: "streak_30",    name: "Feral",              description: "Hit a 30-day check-in streak.",      trigger: "streak", bonus: 120, rarity: 8,  stat: "currentStreak", threshold: 30 },
  { id: "five_fixes",   name: "Chaos Mode",         description: "Have 5 active fixations at once.",   trigger: "metric", bonus: 50,  rarity: 25, stat: "activeFixes",   threshold: 5 },
  { id: "graveyard_3",  name: "Graveyard Keeper",   description: "Lay 3 fixations to rest.",           trigger: "metric", bonus: 40,  rarity: 30, stat: "endedFixes",    threshold: 3 },
  { id: "mood_10",      name: "Self-Aware",         description: "Log your mood 10 times.",            trigger: "metric", bonus: 35,  rarity: 30, stat: "moodLogs",      threshold: 10 },
  { id: "task_25",      name: "Brain Emptied",      description: "Complete 25 brain-dump tasks.",      trigger: "metric", bonus: 45,  rarity: 18, stat: "tasksDone",     threshold: 25 },
  { id: "points_1000",  name: "Clinically Obsessed",description: "Reach 1,000 XP.",                    trigger: "metric", bonus: 100, rarity: 10, stat: "totalPoints",   threshold: 1000 },
  { id: "dopamine_first",name: "First Hit",          description: "Take your first dopamine hit instead of doomscrolling.", trigger: "metric", bonus: 15,  rarity: 70, stat: "dopamineHits", threshold: 1 },
  { id: "dopamine_25",  name: "Better Than The Feed",description: "Choose 25 healthy dopamine hits.",   trigger: "metric", bonus: 50,  rarity: 30, stat: "dopamineHits",  threshold: 25 },
  { id: "dopamine_100", name: "Rewired",            description: "Choose 100 dopamine hits.",          trigger: "metric", bonus: 150, rarity: 12, stat: "dopamineHits",  threshold: 100 },
];

export interface UserStats {
  totalFixes: number;
  activeFixes: number;
  endedFixes: number;
  totalCheckIns: number;
  currentStreak: number;
  moodLogs: number;
  tasksDone: number;
  dopamineHits: number;
  totalPoints: number;
}

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const unique = [...new Set(dates)].sort().reverse();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  let cursor = unique[0] === today || unique[0] === yesterday ? unique[0] : null;
  let streak = 0;
  if (cursor) {
    for (const d of unique) {
      if (d === cursor) {
        streak++;
        cursor = new Date(new Date(cursor).getTime() - 86400000).toISOString().split("T")[0];
      } else break;
    }
  }
  return streak;
}

// Gather the stats the achievement thresholds depend on.
export async function computeUserStats(
  supabase: SupabaseClient,
  userId: string,
  totalPoints: number
): Promise<UserStats> {
  const [
    activeFixesRes,
    endedFixesRes,
    allFixesRes,
    entriesRes,
    moodRes,
    tasksRes,
    dopamineRes,
  ] = await Promise.all([
    supabase.from("fixes").select("id", { count: "exact", head: true }).eq("user_id", userId).neq("status", "Ended"),
    supabase.from("fixes").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "Ended"),
    supabase.from("fixes").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("fix_entries").select("date").eq("user_id", userId).order("date", { ascending: false }).limit(400),
    supabase.from("mood_logs").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("brain_dump").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "done"),
    supabase.from("dopamine_hits").select("id", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  const dates = (entriesRes.data ?? []).map((e: { date: string }) => e.date);
  const totalCheckIns = new Set(dates).size;

  return {
    totalFixes: allFixesRes.count ?? 0,
    activeFixes: activeFixesRes.count ?? 0,
    endedFixes: endedFixesRes.count ?? 0,
    totalCheckIns,
    currentStreak: computeStreak(dates),
    moodLogs: moodRes.count ?? 0,
    tasksDone: tasksRes.count ?? 0,
    dopamineHits: dopamineRes.count ?? 0,
    totalPoints,
  };
}

export function progressFor(def: AchievementDef, stats: UserStats): number {
  const value = stats[def.stat] ?? 0;
  return Math.max(0, Math.min(100, Math.round((value / def.threshold) * 100)));
}

export function isUnlocked(def: AchievementDef, stats: UserStats): boolean {
  return (stats[def.stat] ?? 0) >= def.threshold;
}
