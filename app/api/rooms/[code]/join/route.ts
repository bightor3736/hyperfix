import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(_: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: room } = await supabase
    .from("focus_rooms")
    .select("id, max_members")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  // Already a member? Skip the capacity check so rejoining a full room still works.
  const { data: existing } = await supabase
    .from("room_members")
    .select("id")
    .eq("room_id", room.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    const { count } = await supabase
      .from("room_members")
      .select("*", { count: "exact", head: true })
      .eq("room_id", room.id);

    if ((count ?? 0) >= room.max_members) {
      return NextResponse.json({ error: "Room is full" }, { status: 400 });
    }
  }

  // Upsert membership
  await supabase.from("room_members").upsert(
    { room_id: room.id, user_id: user.id, last_seen: new Date().toISOString() },
    { onConflict: "room_id,user_id" }
  );

  await supabase
    .from("focus_rooms")
    .update({ last_activity: new Date().toISOString() })
    .eq("id", room.id);

  return NextResponse.json({ ok: true, roomId: room.id });
}
