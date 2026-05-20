import { createClient } from "@/lib/supabase/server";
import { sendStreakReminderEmail, sendMilestoneEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split("T")[0];

  let streakReminders = 0;
  let milestonesSent = 0;
  const errors: string[] = [];

  // --- Streak reminders ---
  // Find users who checked in yesterday but NOT today
  const { data: yesterdayUsers } = await supabase
    .from("fix_entries")
    .select("user_id")
    .eq("date", yesterday);

  const { data: todayUsers } = await supabase
    .from("fix_entries")
    .select("user_id")
    .eq("date", today);

  const todaySet = new Set((todayUsers ?? []).map((e: { user_id: string }) => e.user_id));
  const needsReminder = [...new Set((yesterdayUsers ?? []).map((e: { user_id: string }) => e.user_id))]
    .filter((uid) => !todaySet.has(uid));

  for (const userId of needsReminder) {
    try {
      // Compute streak length
      const { data: dates } = await supabase
        .from("fix_entries")
        .select("date")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(400);

      const unique = [...new Set((dates ?? []).map((e: { date: string }) => e.date))].sort().reverse();
      let streak = 0;
      let cursor = unique[0] === yesterday ? yesterday : null;
      if (cursor) {
        for (const d of unique) {
          if (d === cursor) {
            streak++;
            cursor = new Date(new Date(cursor).getTime() - 86_400_000).toISOString().split("T")[0];
          } else break;
        }
      }

      if (streak < 2) continue;

      // Get user email and name
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", userId)
        .single();

      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      const email = authUser?.user?.email;
      if (!email) continue;

      const name = profile?.display_name || profile?.username || email.split("@")[0];
      await sendStreakReminderEmail({ toEmail: email, toName: name, streakDays: streak });
      streakReminders++;
    } catch (err) {
      errors.push(`streak:${userId}: ${err}`);
    }
  }

  // --- Milestone emails ---
  const MILESTONES = [7, 30, 100, 365] as const;

  for (const days of MILESTONES) {
    const cutoff = new Date(Date.now() - days * 86_400_000).toISOString().split("T")[0];

    const { data: fixes } = await supabase
      .from("fixes")
      .select("id, title, user_id, started_at")
      .gte("started_at", `${cutoff}T00:00:00`)
      .lte("started_at", `${cutoff}T23:59:59`)
      .not("status", "eq", "Ended");

    for (const fix of fixes ?? []) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, username")
          .eq("id", fix.user_id)
          .single();

        const { data: authUser } = await supabase.auth.admin.getUserById(fix.user_id);
        const email = authUser?.user?.email;
        if (!email) continue;

        const name = profile?.display_name || profile?.username || email.split("@")[0];
        await sendMilestoneEmail({
          toEmail: email,
          toName: name,
          fixTitle: fix.title,
          fixId: fix.id,
          milestone: days,
        });
        milestonesSent++;
      } catch (err) {
        errors.push(`milestone:${fix.id}: ${err}`);
      }
    }
  }

  return Response.json({
    ok: true,
    streakReminders,
    milestonesSent,
    errors: errors.length > 0 ? errors : undefined,
  });
}
