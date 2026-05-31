import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { awardPoints } from "@/lib/gamification/award";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const updates: Record<string, unknown> = {};
  if (body.status   !== undefined) updates.status   = body.status;
  if (body.content  !== undefined) updates.content  = body.content;
  if (body.energy_required !== undefined) updates.energy_required = body.energy_required;
  if (body.status === "done") updates.completed_at = new Date().toISOString();
  if (body.status && body.status !== "done") updates.completed_at = null;

  const { error } = await supabase
    .from("brain_dump")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // First time a task is marked done → award (idempotent on the task id)
  if (body.status === "done") {
    await awardPoints(user.id, "task_done", id, "Brain-dump task done");
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("brain_dump")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
