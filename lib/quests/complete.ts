import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { QuestKind } from "@/lib/quests/generate";

// Mark today's daily quest of the given kind complete and award its XP.
// Idempotent and non-fatal — used by feature endpoints (mood, meds, rsd, focus)
// so that doing the underlying action auto-completes the matching quest.
export async function completeQuestByKind(userId: string, kind: QuestKind): Promise<void> {
  try {
    const admin = createAdminClient();
    const today = new Date().toISOString().split("T")[0];
    const { data: quest } = await admin
      .from("daily_quests")
      .select("id, xp_reward, completed_at")
      .eq("user_id", userId)
      .eq("date", today)
      .eq("kind", kind)
      .maybeSingle();
    if (!quest || quest.completed_at) return;

    await admin
      .from("daily_quests")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", quest.id);

    await admin.rpc("award_points", {
      p_user: userId,
      p_kind: "check_in",
      p_points: quest.xp_reward,
      p_multiplier: 1,
      p_ref: `quest:${quest.id}`,
      p_description: "Daily quest completed",
    });
  } catch {
    /* non-fatal — the user's action still succeeded */
  }
}
