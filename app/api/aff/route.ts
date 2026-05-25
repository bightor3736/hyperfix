import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// POST — log an event (signup / pro)
export async function POST(req: NextRequest) {
  try {
    const { slug, event } = await req.json();
    if (!slug || !event) return NextResponse.json({ ok: false }, { status: 400 });

    const supabase = adminClient();
    const { data: link } = await supabase
      .from("aff_links")
      .select("slug")
      .eq("slug", slug)
      .single();

    if (!link) return NextResponse.json({ ok: false }, { status: 404 });

    await supabase.from("aff_events").insert({ slug, event });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// GET — admin: list all links with counts (requires ADMIN_EMAIL match)
export async function GET(req: NextRequest) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const authHeader = req.headers.get("x-admin-key");
  if (!adminEmail || authHeader !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = adminClient();
  const { data: links } = await supabase
    .from("aff_links")
    .select("slug, label, redirect_url, created_at")
    .order("created_at", { ascending: false });

  const { data: events } = await supabase
    .from("aff_events")
    .select("slug, event");

  const counts: Record<string, { clicks: number; signups: number; pro: number }> = {};
  for (const e of events ?? []) {
    if (!counts[e.slug]) counts[e.slug] = { clicks: 0, signups: 0, pro: 0 };
    if (e.event === "click") counts[e.slug].clicks++;
    if (e.event === "signup") counts[e.slug].signups++;
    if (e.event === "pro") counts[e.slug].pro++;
  }

  return NextResponse.json({
    links: (links ?? []).map((l) => ({ ...l, ...(counts[l.slug] ?? { clicks: 0, signups: 0, pro: 0 }) })),
  });
}
