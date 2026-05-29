import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 });

  const { data: room } = await supabase
    .from("focus_rooms")
    .select("id")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  // Verify membership
  const { data: member } = await supabase
    .from("room_members")
    .select("id")
    .eq("room_id", room.id)
    .eq("user_id", user.id)
    .single();

  if (!member) return NextResponse.json({ error: "Not a member" }, { status: 403 });

  const { data: message } = await supabase
    .from("room_messages")
    .insert({ room_id: room.id, user_id: user.id, content: content.trim() })
    .select(`id, content, created_at, profile:profiles(username, avatar_url)`)
    .single();

  return NextResponse.json({ message });
}
