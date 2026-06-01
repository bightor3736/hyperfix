import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { awardPoints, recordCheckin } from "@/lib/gamification/award";
import { activityById, rollHitXp } from "@/lib/dopamine/menu";

/**
 * Log a completed dopamine hit. Awards XP and advances the daily streak
 * ("chose dopamine over doom today"). The core loop of the app.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { activityId } = await req.json();
  const activity = activityId ? activityById(activityId) : undefined;
  if (!activity) return NextResponse.json({ error: "Unknown activity" }, { status: 400 });

  const admin = createAdminClient();

  // Record the hit
  const { data: hit, error } = await admin
    .from("dopamine_hits")
    .insert({
      user_id: user.id,
      activity_id: activity.id,
      category: activity.category,
      label: activity.label,
      minutes: activity.minutes,
      energy: activity.energy,
    })
    .select("id")
    .single();

  if (error || !hit) {
    return NextResponse.json({ error: error?.message ?? "Failed" }, { status: 500 });
  }

  const { xp, jackpot } = rollHitXp(activity);

  // Award XP (boost- and Pro-aware, idempotent on the hit id) + advance streak
  await awardPoints(user.id, "dopamine_hit", hit.id, activity.label, xp);
  const streak = await recordCheckin(user.id);

  return NextResponse.json({
    ok: true,
    xp,
    jackpot,
    currentStreak: streak?.current_streak ?? null,
    froze: streak?.froze ?? false,
  });
}
