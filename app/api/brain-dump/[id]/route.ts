import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const SELECT = "id, text:content, status, created_at";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await req.json()) as { status?: string; text?: string };

  // Map client field `text` → DB column `content`; stamp completed_at on done.
  const update: Record<string, unknown> = {};
  if (typeof body.status === "string") {
    update.status = body.status;
    update.completed_at = body.status === "done" ? new Date().toISOString() : null;
  }
  if (typeof body.text === "string") update.content = body.text;

  const { data, error } = await supabase
    .from("brain_dump")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id)
    .select(SELECT)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase
    .from("brain_dump")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
