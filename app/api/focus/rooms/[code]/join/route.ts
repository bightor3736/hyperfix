import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST — join a room by code (idempotent). Returns 404 for unknown/closed rooms.
export async function POST(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code } = await params;
  const { data: room } = await supabase
    .from("focus_rooms")
    .select("id, code, is_active, max_members")
    .eq("code", code.toUpperCase())
    .maybeSingle();

  if (!room || !room.is_active) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  // Capacity check (skip if already a member).
  const { data: existing } = await supabase
    .from("room_members")
    .select("user_id")
    .eq("room_id", room.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    const { count } = await supabase
      .from("room_members")
      .select("user_id", { count: "exact", head: true })
      .eq("room_id", room.id);
    if ((count ?? 0) >= room.max_members) {
      return NextResponse.json({ error: "Room is full" }, { status: 409 });
    }
  }

  const { error } = await supabase
    .from("room_members")
    .upsert(
      { room_id: room.id, user_id: user.id, status: "focusing", task: "", last_seen: new Date().toISOString() },
      { onConflict: "room_id,user_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("focus_rooms").update({ last_activity: new Date().toISOString() }).eq("id", room.id);

  return NextResponse.json({ ok: true, code: room.code });
}
