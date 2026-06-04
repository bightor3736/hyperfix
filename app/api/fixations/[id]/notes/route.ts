import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { awardPoints } from "@/lib/gamification/award";
import { POINT_VALUES } from "@/lib/gamification/levels";
import { completeQuestByKind } from "@/lib/quests/complete";

// GET — recent brain bursts for one fixation.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data, error } = await supabase
    .from("fixation_notes")
    .select("id, body, created_at")
    .eq("fixation_id", id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ notes: data ?? [] });
}

// POST — capture a thought. Small XP, capped to once per fixation per day so
// it rewards the habit without being farmable.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await req.json()) as { body?: string };
  const text = body.body?.trim();
  if (!text) return NextResponse.json({ error: "Empty note" }, { status: 400 });

  // Verify ownership of the fixation.
  const { data: fixation } = await supabase
    .from("hyperfixations")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!fixation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("fixation_notes")
    .insert({ user_id: user.id, fixation_id: id, body: text })
    .select("id, body, created_at")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Idempotent on (user, kind, ref): one brain-burst payout per fixation per day.
  const today = new Date().toISOString().split("T")[0];
  await awardPoints(user.id, "brain_burst", `${id}:${today}`, "Brain burst");
  await completeQuestByKind(user.id, "brain_burst");

  return NextResponse.json({ note: data, xp: POINT_VALUES.brain_burst });
}
