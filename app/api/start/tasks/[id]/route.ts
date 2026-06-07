import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// PATCH  → update a task: { step?, done? }
// DELETE → remove a task
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { step?: string; done?: boolean };
  const patch: Record<string, unknown> = {};
  if (typeof body.step === "string") patch.step = body.step.trim().slice(0, 160);
  if (typeof body.done === "boolean") patch.done_at = body.done ? new Date().toISOString() : null;
  if (Object.keys(patch).length === 0) return NextResponse.json({ ok: true });

  const { error } = await supabase
    .from("start_tasks")
    .update(patch)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: "Could not update" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("start_tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: "Could not delete" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
