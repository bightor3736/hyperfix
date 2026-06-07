import { createClient } from "@/lib/supabase/server";
import { trackServer, type AnalyticsEvent } from "@/lib/analytics/server";
import { NextResponse } from "next/server";

// Events the client is allowed to send. The high-trust funnel events
// (signup, login, task_start, upgrade) are written server-side only, so a
// crafted request can't inflate them. Client events are UI-intent signals.
const CLIENT_EVENTS = new Set<AnalyticsEvent>(["share", "checkout_start"]);

export async function POST(req: Request) {
  let event: string | undefined;
  let props: Record<string, unknown> = {};
  try {
    const body = (await req.json()) as { event?: string; props?: Record<string, unknown> };
    event = body.event;
    if (body.props && typeof body.props === "object") props = body.props;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!event || !CLIENT_EVENTS.has(event as AnalyticsEvent)) {
    // Silently accept-and-drop unknown events so the client never errors.
    return NextResponse.json({ ok: true });
  }

  // Attach the authenticated user (if any) server-side — never trusted from body.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  await trackServer(event as AnalyticsEvent, { userId: user?.id ?? null, props });
  return NextResponse.json({ ok: true });
}
