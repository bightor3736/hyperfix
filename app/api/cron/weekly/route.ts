import { createAdminClient } from "@/lib/supabase/admin";
import { sendWeeklyDigestEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Optionally check it's Sunday
  if (new Date().getDay() !== 0) {
    return Response.json({ ok: true, skipped: "not Sunday" });
  }

  const supabase = createAdminClient();
  let emailsSent = 0;
  const errors: string[] = [];

  // Get all users who have at least 1 active fix
  const { data: activeUsers } = await supabase
    .from("fixes")
    .select("user_id")
    .not("status", "in", '("Ended","Dormant")');

  const uniqueUserIds = [...new Set((activeUsers ?? []).map((r: { user_id: string }) => r.user_id))];

  for (const userId of uniqueUserIds) {
    try {
      // Get profile + notification prefs
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username, notification_prefs")
        .eq("id", userId)
        .single();

      // Check if user wants weekly digest (default true)
      const notifPrefs = profile?.notification_prefs as Record<string, boolean> | null ?? {};
      if (notifPrefs.weekly_digest === false) continue;

      // Get auth user email
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      const email = authUser?.user?.email;
      if (!email) continue;

      const name = profile?.display_name || profile?.username || email.split("@")[0];

      // Count active fixes
      const { count: activeFixCount } = await supabase
        .from("fixes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .not("status", "in", '("Ended","Dormant")');

      // Compute streak
      const { data: entryDates } = await supabase
        .from("fix_entries")
        .select("date")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(400);

      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86_400_000).toISOString().split("T")[0];
      const uniqueDates = [...new Set((entryDates ?? []).map((e: { date: string }) => e.date))].sort().reverse();
      let streak = 0;
      const startCursor = uniqueDates[0] === today || uniqueDates[0] === yesterday ? uniqueDates[0] : null;
      if (startCursor) {
        let cursor: string = startCursor;
        for (const d of uniqueDates) {
          if (d === cursor) {
            streak++;
            cursor = new Date(new Date(cursor).getTime() - 86_400_000).toISOString().split("T")[0];
          } else break;
        }
      }

      // Find top fix (most days)
      const { data: activeFixes } = await supabase
        .from("fixes")
        .select("id, title, started_at")
        .eq("user_id", userId)
        .not("status", "in", '("Ended","Dormant")');

      let topFix: { title: string; days: number } | null = null;
      if (activeFixes && activeFixes.length > 0) {
        const withDays = activeFixes.map((f: { title: string; started_at: string }) => ({
          title: f.title,
          days: Math.max(1, Math.ceil((Date.now() - new Date(f.started_at).getTime()) / 86_400_000)),
        }));
        withDays.sort((a: { days: number }, b: { days: number }) => b.days - a.days);
        topFix = withDays[0];
      }

      // Graveyard count
      const { count: graveyardCount } = await supabase
        .from("fixes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "Ended");

      await sendWeeklyDigestEmail({
        toEmail: email,
        toName: name,
        activeFixCount: activeFixCount ?? 0,
        streak,
        topFix,
        graveyardCount: graveyardCount ?? 0,
      });
      emailsSent++;
    } catch (err) {
      errors.push(`user:${userId}: ${err}`);
    }
  }

  return Response.json({
    ok: true,
    emailsSent,
    errors: errors.length > 0 ? errors : undefined,
  });
}
