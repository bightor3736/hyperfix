import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function randomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Room name required" }, { status: 400 });

  // Generate a unique code
  let code = randomCode();
  for (let i = 0; i < 5; i++) {
    const { data } = await supabase.from("focus_rooms").select("code").eq("code", code).single();
    if (!data) break;
    code = randomCode();
  }

  const { data: room, error } = await supabase
    .from("focus_rooms")
    .insert({ code, name: name.trim(), owner_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Owner auto-joins
  await supabase.from("room_members").insert({ room_id: room.id, user_id: user.id });

  return NextResponse.json({ room });
}
