import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { awardPoints, recordCheckin } from "@/lib/gamification/award";
import { firstStepFor, WALL_XP } from "@/lib/walls/steps";

/**
 * Break a wall: the user named a dreaded task and just STARTED it.
 * We reward the start (not the finish) — the start is the wall.
 * Awards XP + advances the daily streak.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const task = typeof body.task === "string" ? body.task.trim().slice(0, 200) : "";
  if (!task) return NextResponse.json({ error: "Task required" }, { status: 400 });

  const firstStep = typeof body.firstStep === "string" && body.firstStep.trim()
    ? body.firstStep.trim().slice(0, 300)
    : firstStepFor(task);

  const admin = createAdminClient();
  const { data: wall, error } = await admin
    .from("walls_broken")
    .insert({ user_id: user.id, task, first_step: firstStep })
    .select("id")
    .single();

  if (error || !wall) {
    return NextResponse.json({ error: error?.message ?? "Failed" }, { status: 500 });
  }

  await awardPoints(user.id, "wall_broken", wall.id, task, WALL_XP);
  const streak = await recordCheckin(user.id);

  return NextResponse.json({
    ok: true,
    xp: WALL_XP,
    currentStreak: streak?.current_streak ?? null,
    froze: streak?.froze ?? false,
  });
}
