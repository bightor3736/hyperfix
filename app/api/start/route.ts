import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { awardPoints } from "@/lib/gamification/award";
import { POINT_VALUES } from "@/lib/gamification/levels";
import { completeQuestByKind } from "@/lib/quests/complete";

// Records that a user crossed the starting line on a task they were avoiding.
// We reward the START, not the finish — task initiation is the ADHD pain, so
// the win is showing up. A completed start-session also counts as a focus
// session for the daily loop.
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { minutes?: number; task?: string };
  const minutes = Math.max(1, Math.min(180, Math.round(body.minutes ?? 5)));
  const task = (body.task ?? "").slice(0, 80);

  // Minute-bucket ref so legit repeat starts each pay out, but a double-submit
  // of the same one stays idempotent.
  const ref = `start:${Math.floor(Date.now() / 60000)}`;
  const label = task ? `Started: ${task} (${minutes}m)` : `Started a dreaded task (${minutes}m)`;
  await awardPoints(user.id, "wall_broken", ref, label);
  await completeQuestByKind(user.id, "focus_session");

  return NextResponse.json({ ok: true, xp: POINT_VALUES.wall_broken });
}
