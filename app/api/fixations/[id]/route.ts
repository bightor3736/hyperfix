import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await req.json()) as {
    status?: "active" | "fading" | "archived";
    intensity?: number;
    description?: string;
    checkin?: boolean;
  };

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

  // Award XP for daily check-in or archiving
  let xp = 0;
  if (body.checkin) {
    xp = 5;
    try {
      const today = new Date().toISOString().split("T")[0];
      await supabase.rpc("award_points", {
        p_user_id: user.id,
        p_kind: "fixation_checkin",
        p_points: xp,
        p_ref_id: `${id}_${today}`,
        p_description: `Check-in: ${existing.name}`,
      });
    } catch {
      xp = 0;
    }
  } else if (body.status === "archived" && existing.status !== "archived") {
    xp = 15;
    try {
      await supabase.rpc("award_points", {
        p_user_id: user.id,
        p_kind: "fixation_complete",
        p_points: xp,
        p_ref_id: `${id}_complete`,
        p_description: `Completed fixation: ${existing.name}`,
      });
    } catch {
      xp = 0;
    }
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
