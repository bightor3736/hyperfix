import { createClient } from "@/lib/supabase/server";
import { completeQuestByKind } from "@/lib/quests/complete";
import { NextResponse } from "next/server";

// Solo focus timer completion. The timer runs entirely client-side; when a
// focus block finishes the client calls this to record it: it auto-completes
// today's focus_session quest (which carries the XP) if one is active.
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { minutes } = (await req.json().catch(() => ({}))) as { minutes?: number };

  await completeQuestByKind(user.id, "focus_session");

  return NextResponse.json({ ok: true, minutes: minutes ?? null });
}
