import { createAdminClient } from "@/lib/supabase/admin";
import { sendStreakReminderEmail, sendMilestoneEmail, sendFixInactivityEmail } from "@/lib/email";
import { sendPushToUser } from "@/lib/push";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createAdminClient();
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
      await sendPushToUser(userId, {
        title: `Keep your ${streak}-day streak`,
        body: "You haven't checked in today. Tap to log your fix.",
        url: "/dashboard",
        tag: "streak-reminder",
      });
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

  // --- Fix inactivity reminders ---
  // Find users with active fixes who haven't checked in for exactly 3 days
  let inactivitySent = 0;

  const threeDaysAgo = new Date(Date.now() - 3 * 86_400_000).toISOString().split("T")[0];
  const twoDaysAgo = new Date(Date.now() - 2 * 86_400_000).toISOString().split("T")[0];

  // Users whose last check-in was exactly 3 days ago (not 2 or 1 days ago, and not today)
  const { data: lastCheckins3 } = await supabase
    .from("fix_entries")
    .select("user_id")
    .eq("date", threeDaysAgo);

  const { data: recentCheckins } = await supabase
    .from("fix_entries")
    .select("user_id")
    .gte("date", twoDaysAgo);

  const recentSet = new Set((recentCheckins ?? []).map((e: { user_id: string }) => e.user_id));
  const inactiveUsers = [...new Set((lastCheckins3 ?? []).map((e: { user_id: string }) => e.user_id))]
    .filter((uid) => !recentSet.has(uid));

  for (const userId of inactiveUsers) {
    try {
      const { data: activeFixes } = await supabase
        .from("fixes")
        .select("id, title, started_at")
        .eq("user_id", userId)
        .is("ended_at", null)
        .order("started_at", { ascending: true })
        .limit(3);

      if (!activeFixes || activeFixes.length === 0) continue;

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", userId)
        .single();

      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      const email = authUser?.user?.email;
      if (!email) continue;

      const name = profile?.display_name || profile?.username || email.split("@")[0];
      const fixes = activeFixes.map((f: { id: string; title: string; started_at: string }) => ({
        title: f.title,
        id: f.id,
        daysSinceCheckin: 3,
        dayCount: Math.max(1, Math.ceil((Date.now() - new Date(f.started_at).getTime()) / 86_400_000)),
      }));

      await sendFixInactivityEmail({ toEmail: email, toName: name, fixes });
      const firstFix = fixes[0];
      const pushBody =
        fixes.length === 1
          ? `"${firstFix.title}" hasn't been checked in for 3 days.`
          : `${fixes.length} active fixes haven't been checked in for 3 days.`;
      await sendPushToUser(userId, {
        title: "Don't lose your hyperfix",
        body: pushBody,
        url: fixes.length === 1 ? `/dashboard/fix/${firstFix.id}` : "/dashboard",
        tag: "inactivity-reminder",
      });
      inactivitySent++;
    } catch (err) {
      errors.push(`inactivity:${userId}: ${err}`);
    }
  }

  // --- "Still waiting on you" reminders (Just Start) ---
  // The strongest ADHD return hook: a task you started-but-didn't-finish
  // nags the brain (Zeigarnik). Nudge once when it's gone quiet for 2+ days,
  // then back off for 3 days (last_reminded_at) so we never spam. One push
  // per user per run — their oldest-quiet open task.
  let taskReminders = 0;
  const now = Date.now();
  const quietBefore = now - 2 * 86_400_000;     // last activity older than 2 days
  const remindCooldown = now - 3 * 86_400_000;  // not reminded in the last 3 days

  const { data: openTasks } = await supabase
    .from("start_tasks")
    .select("id, user_id, title, sessions, last_started_at, last_reminded_at, created_at")
    .is("done_at", null)
    .order("created_at", { ascending: true })
    .limit(2000);

  const remindedUsers = new Set<string>();
  for (const t of openTasks ?? []) {
    try {
      if (remindedUsers.has(t.user_id)) continue;

      const lastActivity = new Date(t.last_started_at ?? t.created_at).getTime();
      if (lastActivity > quietBefore) continue;
      if (t.last_reminded_at && new Date(t.last_reminded_at).getTime() > remindCooldown) continue;

      const started = (t.sessions ?? 0) > 0;
      await sendPushToUser(t.user_id, {
        title: started ? "That thing is still waiting" : "Still avoiding it?",
        body: started
          ? `"${t.title}" — you started once. Just 5 more minutes?`
          : `"${t.title}" — you only have to start. 5 minutes, you can quit after.`,
        url: "/dashboard",
        tag: "task-reminder",
      });

      await supabase
        .from("start_tasks")
        .update({ last_reminded_at: new Date().toISOString() })
        .eq("id", t.id);

      remindedUsers.add(t.user_id);
      taskReminders++;
    } catch (err) {
      errors.push(`task:${t.id}: ${err}`);
    }
  }

  return Response.json({
    ok: true,
    streakReminders,
    milestonesSent,
    inactivitySent,
    taskReminders,
    errors: errors.length > 0 ? errors : undefined,
  });
}
