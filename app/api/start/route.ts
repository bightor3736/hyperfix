import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { awardPoints, recordCheckin } from "@/lib/gamification/award";
import { POINT_VALUES } from "@/lib/gamification/levels";
import { completeQuestByKind } from "@/lib/quests/complete";
import { trackServer, isFirstTime } from "@/lib/analytics/server";

// Records that a user crossed the starting line on a task they were avoiding.
// We reward the START, not the finish — task initiation is the ADHD pain, so
// the win is showing up.
//
// Starting also:
//  - books the session against the task (sessions / minutes / last_started_at)
//  - keeps the streak alive via a forgiving check-in (every start = you
//    showed up; freezes auto-cover missed days, never a shaming "streak lost")
//  - counts as a focus session for the daily loop
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { minutes?: number; task?: string; taskId?: string; step?: string };
  const minutes = Math.max(1, Math.min(180, Math.round(body.minutes ?? 5)));
  const task = (body.task ?? "").slice(0, 120);

  // Book the session against the task it belongs to.
  if (body.taskId) {
    const admin = createAdminClient();
    const { data: row } = await admin
      .from("start_tasks")
      .select("sessions, total_minutes")
      .eq("id", body.taskId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (row) {
      await admin
        .from("start_tasks")
        .update({
          sessions: (row.sessions ?? 0) + 1,
          total_minutes: (row.total_minutes ?? 0) + minutes,
          last_started_at: new Date().toISOString(),
          ...(typeof body.step === "string" ? { step: body.step.trim().slice(0, 160) } : {}),
        })
        .eq("id", body.taskId)
        .eq("user_id", user.id);
    }
  }

  const label = task ? `Started: ${task} (${minutes}m)` : `Started a dreaded task (${minutes}m)`;
  const ref = `start:${Math.floor(Date.now() / 60000)}`;

  // Activation event: is this the user's very first start (the "aha")? Check
  // before writing so the first row is correctly flagged.
  const first = await isFirstTime(user.id, "task_start");

  await awardPoints(user.id, "wall_broken", ref, label);
  await completeQuestByKind(user.id, "focus_session");

  // Funnel: the core activation + repeat-engagement signal.
  await trackServer("task_start", {
    userId: user.id,
    props: { minutes, first, named: Boolean(task), hasTaskId: Boolean(body.taskId) },
  });

  // Forgiving streak: showing up to start keeps your streak alive.
  const streak = await recordCheckin(user.id);

  return NextResponse.json({
    ok: true,
    xp: POINT_VALUES.wall_broken,
    streak: streak?.current_streak ?? null,
    froze: streak?.froze ?? false,
  });
}
