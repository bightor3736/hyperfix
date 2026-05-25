import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const fixId = req.nextUrl.searchParams.get("fixId");
  if (!fixId) {
    return NextResponse.json({ error: "fixId required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fix_reactions")
    .select("emoji")
    .eq("fix_id", fixId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.emoji] = (counts[row.emoji] ?? 0) + 1;
  }

  return NextResponse.json({ counts });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const { allowed } = rateLimit(`reactions:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { fixId, emoji } = body as { fixId: string; emoji: string };

  if (!fixId || !emoji) {
    return NextResponse.json({ error: "fixId and emoji required" }, { status: 400 });
  }

  // Check if reaction exists
  const { data: existing } = await supabase
    .from("fix_reactions")
    .select("id")
    .eq("fix_id", fixId)
    .eq("user_id", user.id)
    .eq("emoji", emoji)
    .single();

  if (existing) {
    // Remove reaction
    await supabase
      .from("fix_reactions")
      .delete()
      .eq("fix_id", fixId)
      .eq("user_id", user.id)
      .eq("emoji", emoji);
  } else {
    // Add reaction
    await supabase
      .from("fix_reactions")
      .insert({ fix_id: fixId, user_id: user.id, emoji });

    // Notify the fix owner (if not reacting to own fix)
    const { data: fix } = await supabase
      .from("fixes")
      .select("user_id")
      .eq("id", fixId)
      .single();
    if (fix && fix.user_id !== user.id) {
      const { data: ownerPrefs } = await supabase
        .from("profiles")
        .select("notification_prefs")
        .eq("id", fix.user_id)
        .single();
      const prefs = (ownerPrefs?.notification_prefs ?? {}) as Record<string, boolean>;
      if (prefs.social_reactions !== false) {
        await supabase.from("notifications").insert({
          user_id: fix.user_id,
          type: "reaction",
          actor_id: user.id,
          fix_id: fixId,
          emoji,
        });
      }
    }
  }

  // Return updated counts
  const { data: allReactions } = await supabase
    .from("fix_reactions")
    .select("emoji")
    .eq("fix_id", fixId);

  const counts: Record<string, number> = {};
  for (const row of allReactions ?? []) {
    counts[row.emoji] = (counts[row.emoji] ?? 0) + 1;
  }

  return NextResponse.json({ counts, toggled: emoji, added: !existing });
}
