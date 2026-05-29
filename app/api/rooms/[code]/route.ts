import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();

  const { data: room, error } = await supabase
    .from("focus_rooms")
    .select(`
      *,
      members:room_members(
        user_id, status, task, joined_at, last_seen,
        profile:profiles(id, username, avatar_url)
      ),
      messages:room_messages(
        id, content, created_at,
        profile:profiles(username, avatar_url)
      )
    `)
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .order("created_at", { referencedTable: "room_messages", ascending: true })
    .single();

  if (error || !room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  return NextResponse.json({ room });
}
