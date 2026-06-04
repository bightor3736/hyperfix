import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { awardPoints } from "@/lib/gamification/award";
import { POINT_VALUES } from "@/lib/gamification/levels";
import { completeQuestByKind } from "@/lib/quests/complete";

// Records a completed focus-timer session: awards XP and auto-completes the
// daily focus_session quest. The timer is a proof-of-action tool for working
// on your hyperfixation.
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { minutes?: number };
  const minutes = Math.max(1, Math.min(180, Math.round(body.minutes ?? 25)));

  // Ref includes the minute-bucket timestamp so legitimate repeat sessions
  // each pay out, while an accidental double-submit of the same one won't.
  const ref = `focus:${Math.floor(Date.now() / 60000)}`;
  await awardPoints(user.id, "focus_session", ref, `${minutes}-min focus session`);
  await completeQuestByKind(user.id, "focus_session");

  return NextResponse.json({ ok: true, xp: POINT_VALUES.focus_session });
}
