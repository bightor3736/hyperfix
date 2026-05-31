import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { POINT_VALUES, KIND_LABELS, type PointKind } from "@/lib/gamification/levels";
import {
  ACHIEVEMENT_DEFS,
  computeUserStats,
  isUnlocked,
} from "@/lib/gamification/achievements";

async function activeMultiplier(
  admin: ReturnType<typeof createAdminClient>
): Promise<number> {
  const nowIso = new Date().toISOString();
  const { data } = await admin
    .from("point_boosts")
    .select("multiplier, starts_at, ends_at")
    .eq("active", true)
    .lte("starts_at", nowIso)
    .order("multiplier", { ascending: false })
    .limit(5);

  const live = (data ?? []).find(
    (b: { ends_at: string | null }) => !b.ends_at || b.ends_at >= nowIso
  );
  return live?.multiplier ?? 1;
}

// Pro members earn at 1.5×.
const PRO_MULTIPLIER = 1.5;

/**
 * Award points for an action. Idempotent on (user, kind, ref).
 * Never throws — gamification must not break the underlying action.
 */
export async function awardPoints(
  userId: string,
  kind: Exclude<PointKind, "achievement">,
  ref: string,
  description?: string
): Promise<void> {
  try {
    const admin = createAdminClient();
    const base = POINT_VALUES[kind];

    const [boostMult, { data: profile }] = await Promise.all([
      activeMultiplier(admin),
      admin.from("profiles").select("is_pro").eq("id", userId).single(),
    ]);
    const multiplier = boostMult * (profile?.is_pro ? PRO_MULTIPLIER : 1);

    await admin.rpc("award_points", {
      p_user: userId,
      p_kind: kind,
      p_points: base,
      p_multiplier: multiplier,
      p_ref: ref,
      p_description: description ?? KIND_LABELS[kind] ?? kind,
    });

    await evaluateAchievements(userId);
  } catch (err) {
    console.error("[awardPoints]", err);
  }
}

/**
 * Record a forgiving daily check-in. Consumes streak freezes to cover
 * missed days. Returns the new streak state (or null on failure).
 */
export async function recordCheckin(
  userId: string
): Promise<{ current_streak: number; longest_streak: number; freezes: number; froze: boolean } | null> {
  try {
    const admin = createAdminClient();
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await admin.rpc("record_checkin", {
      p_user: userId,
      p_today: today,
    });
    if (error || !data || !data[0]) return null;
    return data[0];
  } catch (err) {
    console.error("[recordCheckin]", err);
    return null;
  }
}

/**
 * Unlock any newly-earned achievements and award their bonus points.
 * Safe to call repeatedly; unlocks are idempotent.
 */
export async function evaluateAchievements(userId: string): Promise<void> {
  try {
    const admin = createAdminClient();

    const { data: profile } = await admin
      .from("profiles")
      .select("total_points")
      .eq("id", userId)
      .single();

    const stats = await computeUserStats(admin, userId, profile?.total_points ?? 0);

    const { data: existing } = await admin
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", userId);
    const owned = new Set((existing ?? []).map((r: { achievement_id: string }) => r.achievement_id));

    for (const def of ACHIEVEMENT_DEFS) {
      if (owned.has(def.id)) continue;
      if (!isUnlocked(def, stats)) continue;

      const { error: insErr } = await admin
        .from("user_achievements")
        .insert({ user_id: userId, achievement_id: def.id });

      // Award the unlock bonus (idempotent on kind=achievement, ref=def.id)
      if (!insErr) {
        await admin.rpc("award_points", {
          p_user: userId,
          p_kind: "achievement",
          p_points: def.bonus,
          p_multiplier: 1,
          p_ref: def.id,
          p_description: `Unlocked: ${def.name}`,
        });
      }
    }
  } catch (err) {
    console.error("[evaluateAchievements]", err);
  }
}
