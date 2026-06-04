import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { awardPoints } from "@/lib/gamification/award";
import { POINT_VALUES } from "@/lib/gamification/levels";
import { DEEP_DIVE_PROMPT_KEYS } from "@/lib/deepdive/prompts";

// GET — list this user's Deep Dive answers for one fixation.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data, error } = await supabase
    .from("fixation_insights")
    .select("id, prompt_key, body, created_at, updated_at")
    .eq("fixation_id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ insights: data ?? [] });
}

// POST — answer (or edit) a prompt. XP is awarded only the first time a given
// prompt is answered for a fixation; editing an existing answer earns nothing.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await req.json()) as { prompt_key?: string; body?: string };
  const promptKey = body.prompt_key?.trim();
  const answer = body.body?.trim();

  if (!promptKey || !DEEP_DIVE_PROMPT_KEYS.has(promptKey)) {
    return NextResponse.json({ error: "Unknown prompt" }, { status: 400 });
  }
  if (!answer) {
    return NextResponse.json({ error: "Answer is required" }, { status: 400 });
  }

  // Verify the fixation belongs to this user before writing anything.
  const { data: fixation } = await supabase
    .from("hyperfixations")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!fixation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Already answered? Update the text, award nothing.
  const { data: existing } = await supabase
    .from("fixation_insights")
    .select("id")
    .eq("user_id", user.id)
    .eq("fixation_id", id)
    .eq("prompt_key", promptKey)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("fixation_insights")
      .update({ body: answer, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select("id, prompt_key, body, created_at, updated_at")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ insight: data, xp: 0, awarded: false });
  }

  const { data, error } = await supabase
    .from("fixation_insights")
    .insert({ user_id: user.id, fixation_id: id, prompt_key: promptKey, body: answer })
    .select("id, prompt_key, body, created_at, updated_at")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await awardPoints(user.id, "fixation_insight", data.id, "Deep dive insight");

  return NextResponse.json({ insight: data, xp: POINT_VALUES.fixation_insight, awarded: true });
}
