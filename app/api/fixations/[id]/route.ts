import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { awardPoints } from "@/lib/gamification/award";
import { POINT_VALUES } from "@/lib/gamification/levels";
import { completeQuestByKind } from "@/lib/quests/complete";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  let body: {
    status?: "active" | "fading" | "archived";
    intensity?: number;
    description?: string;
    checkin?: boolean;
  };
  try {
    body = (await req.json()) as {
      status?: "active" | "fading" | "archived";
      intensity?: number;
      description?: string;
      checkin?: boolean;
    };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from("hyperfixations")
    .select("id, user_id, status, name")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updates: Record<string, unknown> = {};
  if (body.status !== undefined) {
    updates.status = body.status;
    if (body.status === "archived" && existing.status !== "archived") {
      updates.ended_at = new Date().toISOString();
    }
  }
  if (body.intensity !== undefined) updates.intensity = body.intensity;
  if (body.description !== undefined) updates.description = body.description;

  const { data, error } = await supabase
    .from("hyperfixations")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Award XP for daily check-in or archiving. awardPoints is idempotent on
  // (user, kind, ref) — so a same-day check-in won't double-pay — and applies
  // the Pro multiplier + achievement evaluation.
  let xp = 0;
  if (body.checkin) {
    const today = new Date().toISOString().split("T")[0];
    xp = POINT_VALUES.fixation_checkin;
    await awardPoints(user.id, "fixation_checkin", `${id}_${today}`, `Check-in: ${existing.name}`);
    await completeQuestByKind(user.id, "fixation_checkin");
  } else if (body.status === "archived" && existing.status !== "archived") {
    xp = POINT_VALUES.fixation_complete;
    await awardPoints(user.id, "fixation_complete", `${id}_complete`, `Completed fixation: ${existing.name}`);
  }

  return NextResponse.json({ fixation: data, xp });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { error } = await supabase
    .from("hyperfixations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
