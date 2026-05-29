import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Owner pushes current Spotify track to the room
export async function PATCH(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { track } = await req.json();

  const { data: room } = await supabase
    .from("focus_rooms")
    .select("id, owner_id")
    .eq("code", code.toUpperCase())
    .single();

  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (room.owner_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await supabase
    .from("focus_rooms")
    .update({ current_track: track })
    .eq("id", room.id);

  return NextResponse.json({ ok: true });
}
