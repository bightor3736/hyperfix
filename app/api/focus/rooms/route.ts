import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Default Pomodoro state stored on a freshly-created room.
const DEFAULT_TIMER = { mode: "focus", round: 1, isRunning: false, remaining: 1500, startedAt: null };

function genCode() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// GET — list discoverable (public, active) rooms with live member counts.
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: rooms, error } = await supabase
    .from("focus_rooms")
    .select("id, code, name, owner_id, is_active, is_private, last_activity, timer_state")
    .eq("is_active", true)
    .eq("is_private", false)
    .order("last_activity", { ascending: false })
    .limit(30);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Attach member counts.
  const ids = (rooms ?? []).map((r) => r.id);
  const counts: Record<string, number> = {};
  if (ids.length) {
    const { data: members } = await supabase
      .from("room_members")
      .select("room_id")
      .in("room_id", ids);
    for (const m of members ?? []) counts[m.room_id] = (counts[m.room_id] ?? 0) + 1;
  }

  return NextResponse.json({
    rooms: (rooms ?? []).map((r) => ({ ...r, member_count: counts[r.id] ?? 0 })),
  });
}

// POST — create a room and auto-join the owner.
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, isPrivate } = (await req.json().catch(() => ({}))) as { name?: string; isPrivate?: boolean };
  const roomName = (name?.trim() || "Focus room").slice(0, 60);

  // Retry on the (unlikely) code collision.
  let code = genCode();
  let room: { id: string; code: string } | null = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase
      .from("focus_rooms")
      .insert({ code, name: roomName, owner_id: user.id, is_private: !!isPrivate, timer_state: DEFAULT_TIMER })
      .select("id, code")
      .single();
    if (!error && data) { room = data; break; }
    if (error && !error.message.includes("duplicate")) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    code = genCode();
  }
  if (!room) return NextResponse.json({ error: "Could not create room" }, { status: 500 });

  // Owner joins their own room.
  await supabase
    .from("room_members")
    .upsert({ room_id: room.id, user_id: user.id, status: "focusing", task: "" }, { onConflict: "room_id,user_id" });

  return NextResponse.json({ code: room.code });
}
