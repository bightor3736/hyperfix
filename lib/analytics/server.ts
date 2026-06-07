import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Canonical funnel events. Keep this list small and stable — the funnel is
// only useful if the names don't drift. Add new ones deliberately.
export type AnalyticsEvent =
  | "signup"
  | "login"
  | "task_start"
  | "share"
  | "checkout_start"
  | "upgrade";

type TrackOpts = {
  userId?: string | null;
  props?: Record<string, unknown>;
  source?: string | null;
};

// Fire-and-forget server-side event write. Best-effort by design: analytics
// must NEVER block or break a user action, so every failure is swallowed.
export async function trackServer(event: AnalyticsEvent, opts: TrackOpts = {}): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from("analytics_events").insert({
      event,
      user_id: opts.userId ?? null,
      props: opts.props ?? {},
      source: opts.source ?? null,
    });
  } catch {
    /* analytics is best-effort — never throw */
  }
}

// Has this user fired `event` before? Used to detect milestones like the
// very first task_start (the activation "aha"). Returns false on any error
// so we never mislabel a normal event as a first-time one.
export async function isFirstTime(userId: string, event: AnalyticsEvent): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const { count } = await admin
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("event", event);
    return (count ?? 1) === 0;
  } catch {
    return false;
  }
}
