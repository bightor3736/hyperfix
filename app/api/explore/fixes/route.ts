import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor"); // created_at of last item
  const category = searchParams.get("category") || null;
  const limit = 24;

  const supabase = await createClient();

  let query = supabase
    .from("fixes")
    .select("id, title, category, status, intensity, note, started_at, ended_at, is_public, profiles(username, display_name, avatar_url)")
    .eq("is_public", true)
    .not("status", "eq", "Ended")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cursor) query = query.lt("created_at", cursor);
  if (category) query = query.eq("category", category);

  const { data: fixes, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch reaction counts
  const fixIds = (fixes ?? []).map((f) => f.id);
  const reactions: Record<string, Record<string, number>> = {};
  if (fixIds.length > 0) {
    const { data: rxns } = await supabase
      .from("fix_reactions")
      .select("fix_id, emoji")
      .in("fix_id", fixIds);
    for (const r of rxns ?? []) {
      if (!reactions[r.fix_id]) reactions[r.fix_id] = {};
      reactions[r.fix_id][r.emoji] = (reactions[r.fix_id][r.emoji] ?? 0) + 1;
    }
  }

  return NextResponse.json({ fixes: fixes ?? [], reactions, hasMore: (fixes ?? []).length === limit });
}
