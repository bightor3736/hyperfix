import "server-only";
import { createClient } from "@/lib/supabase/server";

export type QuestKind =
  | "check_in"
  | "brain_dump"
  | "focus_session"
  | "mood_log"
  | "med_log"
  | "rsd_entry";

export type Quest = {
  id: string;
  kind: QuestKind;
  title: string;
  description: string;
  xp_reward: number;
  href: string;
  completed_at: string | null;
};

const QUEST_DEFS: Record<QuestKind, { title: string; description: string; xp_reward: number; href: string }> = {
  check_in: {
    title: "Check in on a project",
    description: "Log today's progress on any active project.",
    xp_reward: 10,
    href: "/dashboard",
  },
  brain_dump: {
    title: "Dump 3 thoughts",
    description: "Clear your head — add at least one thing to your brain dump.",
    xp_reward: 8,
    href: "/dashboard/brain-dump",
  },
  focus_session: {
    title: "Do a focus session",
    description: "Complete a 25-min focus timer. Silence everything else.",
    xp_reward: 15,
    href: "/dashboard/timer",
  },
  mood_log: {
    title: "Log your mood",
    description: "Check in on how you're feeling. Takes 10 seconds.",
    xp_reward: 8,
    href: "/dashboard/mood",
  },
  med_log: {
    title: "Log your meds",
    description: "Track today's medication. Keep the streak going.",
    xp_reward: 5,
    href: "/dashboard/meds",
  },
  rsd_entry: {
    title: "Write an RSD entry",
    description: "Something weighing on you? Process it here.",
    xp_reward: 10,
    href: "/dashboard/rsd",
  },
};

// Deterministic weekly rotation — 3 quests per day, varies by day-of-week
const WEEKLY_ROTATION: QuestKind[][] = [
  ["check_in", "mood_log", "focus_session"],       // Sunday
  ["check_in", "brain_dump", "focus_session"],     // Monday
  ["mood_log", "med_log", "check_in"],             // Tuesday
  ["focus_session", "rsd_entry", "mood_log"],      // Wednesday
  ["check_in", "brain_dump", "med_log"],           // Thursday
  ["focus_session", "mood_log", "check_in"],       // Friday
  ["brain_dump", "rsd_entry", "focus_session"],    // Saturday
];

export async function getDailyQuests(userId: string): Promise<Quest[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  // Fetch existing quests for today
  const { data: existing } = await supabase
    .from("daily_quests")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .order("created_at");

  if (existing && existing.length >= 3) {
    return existing.map(rowToQuest);
  }

  // Generate today's quests
  const dayOfWeek = new Date().getDay(); // 0 = Sun
  const kinds = WEEKLY_ROTATION[dayOfWeek];

  const rows = kinds.map((kind) => ({
    user_id: userId,
    date: today,
    kind,
    title: QUEST_DEFS[kind].title,
    description: QUEST_DEFS[kind].description,
    xp_reward: QUEST_DEFS[kind].xp_reward,
  }));

  const { data: inserted } = await supabase
    .from("daily_quests")
    .upsert(rows, { onConflict: "user_id,date,kind", ignoreDuplicates: true })
    .select("*")
    .order("created_at");

  // Fall back to fetch after upsert in case of conflicts
  if (!inserted || inserted.length === 0) {
    const { data: fallback } = await supabase
      .from("daily_quests")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .order("created_at");
    return (fallback ?? []).map(rowToQuest);
  }

  return inserted.map(rowToQuest);
}

function rowToQuest(row: {
  id: string;
  kind: string;
  title: string;
  description: string | null;
  xp_reward: number;
  completed_at: string | null;
}): Quest {
  const kind = row.kind as QuestKind;
  return {
    id: row.id,
    kind,
    title: row.title,
    description: row.description ?? QUEST_DEFS[kind]?.description ?? "",
    xp_reward: row.xp_reward,
    href: QUEST_DEFS[kind]?.href ?? "/dashboard",
    completed_at: row.completed_at,
  };
}
