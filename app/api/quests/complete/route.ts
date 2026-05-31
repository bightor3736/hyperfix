import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { questId } = await req.json();
  if (!questId) return NextResponse.json({ error: "Missing questId" }, { status: 400 });

  const admin = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  // Fetch the quest and verify ownership + not already completed
  const { data: quest, error } = await admin
    .from("daily_quests")
    .select("id, user_id, kind, xp_reward, completed_at, date")
    .eq("id", questId)
    .eq("user_id", user.id)
    .single();

  if (error || !quest) return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  if (quest.completed_at) return NextResponse.json({ already: true });
  if (quest.date !== today) return NextResponse.json({ error: "Quest expired" }, { status: 400 });

  // Mark complete
  await admin
    .from("daily_quests")
    .update({ completed_at: new Date().toISOString() })
    .eq("id", questId);

  // Award XP
  await admin.rpc("award_points", {
    p_user: user.id,
    p_kind: "check_in",
    p_points: quest.xp_reward,
    p_multiplier: 1,
    p_ref: `quest:${questId}`,
    p_description: `Daily quest completed`,
  });

  return NextResponse.json({ ok: true, xp: quest.xp_reward });
}
