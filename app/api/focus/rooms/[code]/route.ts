import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type TimerState = {
  mode: "focus" | "break";
  round: number;
  isRunning: boolean;
  remaining: number;
  startedAt: string | null;
};

async function loadRoom(supabase: Awaited<ReturnType<typeof createClient>>, code: string) {
  const { data } = await supabase
    .from("focus_rooms")
    .select("id, code, name, owner_id, is_active, is_private, timer_state, last_activity")
    .eq("code", code.toUpperCase())
    .maybeSingle();
  return data;
}

// GET — full room snapshot for polling: room meta, timer, and members+profiles.
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code } = await params;
  const room = await loadRoom(supabase, code);
  if (!room || !room.is_active) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const { data: members } = await supabase
    .from("room_members")
    .select("user_id, status, task, joined_at, last_seen, profiles(display_name, username, avatar_url)")
    .eq("room_id", room.id)
    .order("joined_at", { ascending: true });

  return NextResponse.json({
    room: {
      code: room.code,
      name: room.name,
      ownerId: room.owner_id,
      isOwner: room.owner_id === user.id,
      isMember: (members ?? []).some((m) => m.user_id === user.id),
      timer: room.timer_state as TimerState,
    },
    members: members ?? [],
    serverNow: new Date().toISOString(),
    me: user.id,
  });
}

// PATCH — presence heartbeat (any member) or timer control (owner only).
export async function PATCH(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code } = await params;
  const room = await loadRoom(supabase, code);
  if (!room || !room.is_active) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as {
    action?: "presence" | "timer";
    status?: string;
    task?: string;
    timer?: Partial<TimerState>;
  };

  if (body.action === "timer") {
    if (room.owner_id !== user.id) return NextResponse.json({ error: "Only the owner controls the timer" }, { status: 403 });
    const current = room.timer_state as TimerState;
    const next: TimerState = { ...current, ...body.timer } as TimerState;
    await supabase
      .from("focus_rooms")
      .update({ timer_state: next, last_activity: new Date().toISOString() })
      .eq("id", room.id);
    return NextResponse.json({ ok: true, timer: next });
  }

  // Default: presence heartbeat + optional status/task update.
  const update: Record<string, unknown> = { last_seen: new Date().toISOString() };
  if (typeof body.status === "string") update.status = body.status;
  if (typeof body.task === "string") update.task = body.task.slice(0, 120);

  await supabase
    .from("room_members")
    .update(update)
    .eq("room_id", room.id)
    .eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}

// DELETE — leave the room. If the owner leaves and no one's left, close it.
export async function DELETE(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code } = await params;
  const room = await loadRoom(supabase, code);
  if (!room) return NextResponse.json({ ok: true });

  await supabase.from("room_members").delete().eq("room_id", room.id).eq("user_id", user.id);

  const { count } = await supabase
    .from("room_members")
    .select("user_id", { count: "exact", head: true })
    .eq("room_id", room.id);

  if ((count ?? 0) === 0 && room.owner_id === user.id) {
    await supabase.from("focus_rooms").update({ is_active: false }).eq("id", room.id);
  }

  return NextResponse.json({ ok: true });
}
