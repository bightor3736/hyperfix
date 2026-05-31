import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPushToUser } from "@/lib/push";

/**
 * Trigger a surprise XP boost (a "Happy Hour") and notify everyone.
 *
 * POST /api/admin/boost
 *   header: x-admin-secret: <ADMIN_SECRET | CRON_SECRET>
 *   body (all optional): { multiplier?: number, hours?: number, name?: string, description?: string }
 *
 * Can be wired to a Vercel cron for random drops, or hit manually.
 */
export async function POST(req: Request) {
  const secret = process.env.ADMIN_SECRET || process.env.CRON_SECRET;
  const provided =
    req.headers.get("x-admin-secret") ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { multiplier?: number; hours?: number; name?: string; description?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* empty body is fine */
  }

  const multiplier = Math.min(5, Math.max(1.5, body.multiplier ?? 2));
  const hours = Math.min(24, Math.max(1, body.hours ?? 1));
  const name = body.name ?? `${multiplier}× XP Happy Hour`;
  const description =
    body.description ?? `All points are worth ${multiplier}× for the next ${hours}h. Go log something.`;

  const admin = createAdminClient();
  const now = new Date();
  const endsAt = new Date(now.getTime() + hours * 3600_000);

  // Deactivate any currently-running boosts, then create the new one.
  await admin.from("point_boosts").update({ active: false }).eq("active", true);
  const { data: boost, error } = await admin
    .from("point_boosts")
    .insert({
      name,
      description,
      multiplier,
      starts_at: now.toISOString(),
      ends_at: endsAt.toISOString(),
      active: true,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Notify everyone with a push subscription.
  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("user_id");
  const userIds = [...new Set((subs ?? []).map((s: { user_id: string }) => s.user_id))];

  let pushed = 0;
  await Promise.all(
    userIds.map(async (uid) => {
      const res = await sendPushToUser(uid, {
        title: `⚡ ${name}`,
        body: description,
        url: "/dashboard/points",
        tag: "xp-boost",
      });
      pushed += res.sent;
    })
  );

  return NextResponse.json({
    boost: boost?.id,
    multiplier,
    endsAt: endsAt.toISOString(),
    notifiedUsers: userIds.length,
    pushesSent: pushed,
  });
}
