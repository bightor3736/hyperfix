import "server-only";
import { createClient } from "@/lib/supabase/server";

// Every quest is a hyperfixation action — the daily loop, gamified.
export type QuestKind =
  | "log_fixation"
  | "fixation_checkin"
  | "deep_dive"
  | "brain_burst"
  | "focus_session";

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
  log_fixation: {
    title: "Log a hyperfixation",
    description: "What's pulling you in right now? Add it to your list.",
    xp_reward: 10,
    href: "/dashboard/new",
  },
  fixation_checkin: {
    title: "Check in on a fixation",
    description: "Still deep in it? Tap to keep the flame alive.",
    xp_reward: 8,
    href: "/dashboard/fixations",
  },
  deep_dive: {
    title: "Do a deep dive",
    description: "Answer one reflection prompt about a fixation.",
    xp_reward: 8,
    href: "/dashboard/fixations",
  },
  brain_burst: {
    title: "Brain-burst a thought",
    description: "Get one idea about a fixation out of your head.",
    xp_reward: 6,
    href: "/dashboard/fixations",
  },
  focus_session: {
    title: "Do a focus session",
    description: "Run one focus timer on your fixation. Lock in.",
    xp_reward: 15,
    href: "/dashboard/timer",
  },
};

// Deterministic weekly rotation — 3 quests per day, varies by day-of-week.
const WEEKLY_ROTATION: QuestKind[][] = [
  ["fixation_checkin", "deep_dive", "focus_session"],   // Sunday
  ["log_fixation", "brain_burst", "focus_session"],     // Monday
  ["fixation_checkin", "deep_dive", "brain_burst"],     // Tuesday
  ["focus_session", "deep_dive", "fixation_checkin"],   // Wednesday
  ["log_fixation", "brain_burst", "fixation_checkin"],  // Thursday
  ["focus_session", "deep_dive", "fixation_checkin"],   // Friday
  ["brain_burst", "deep_dive", "focus_session"],        // Saturday
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
