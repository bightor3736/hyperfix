import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const allowed = ["status", "task", "last_seen"] as const;
  const update: Record<string, string> = {};
  for (const k of allowed) if (body[k] !== undefined) update[k] = body[k];

  const { data: room } = await supabase
    .from("focus_rooms")
    .select("id")
    .eq("code", code.toUpperCase())
    .single();

  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await supabase
    .from("room_members")
    .update(update)
    .eq("room_id", room.id)
    .eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}
