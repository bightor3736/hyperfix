import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(_: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: room } = await supabase
    .from("focus_rooms")
    .select("id, owner_id")
    .eq("code", code.toUpperCase())
    .single();

  if (!room) return NextResponse.json({ ok: true });

  await supabase
    .from("room_members")
    .delete()
    .eq("room_id", room.id)
    .eq("user_id", user.id);

  // If owner leaves, close the room
  if (room.owner_id === user.id) {
    await supabase.from("focus_rooms").update({ is_active: false }).eq("id", room.id);
  }

  return NextResponse.json({ ok: true });
}
