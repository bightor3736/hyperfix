import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { awardPoints } from "@/lib/gamification/award";
import { POINT_VALUES } from "@/lib/gamification/levels";
import { completeQuestByKind } from "@/lib/quests/complete";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("hyperfixations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ fixations: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: {
    name: string;
    description?: string;
    intensity?: number;
  };
  try {
    body = (await req.json()) as {
      name: string;
      description?: string;
      intensity?: number;
    };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("hyperfixations")
    .insert({
      user_id: user.id,
      name: body.name.trim(),
      description: body.description?.trim() || null,
      intensity: body.intensity ?? 3,
      status: "active",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Award XP for logging a new fixation. awardPoints handles the Pro
  // multiplier, idempotency, and achievement evaluation — and never throws.
  await awardPoints(user.id, "fixation_log", data.id, `Logged fixation: ${body.name.trim()}`);
  await completeQuestByKind(user.id, "log_fixation");

  return NextResponse.json({ fixation: data, xp: POINT_VALUES.fixation_log });
}
