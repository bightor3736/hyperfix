import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const { allowed } = rateLimit(`msg:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: { conversationId?: string; body?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const conversationId = payload.conversationId;
  const body = (payload.body ?? "").trim();

  if (!conversationId || typeof conversationId !== "string") {
    return NextResponse.json(
      { error: "conversationId required" },
      { status: 400 },
    );
  }
  if (!body) {
    return NextResponse.json({ error: "Body required" }, { status: 400 });
  }
  if (body.length > 2000) {
    return NextResponse.json({ error: "Body too long" }, { status: 400 });
  }

  // Verify participant (RLS will also enforce, but we check for a clean error)
  const { data: convoRaw } = await supabase
    .from("conversations")
    .select("id, user_a, user_b")
    .eq("id", conversationId)
    .maybeSingle();
  const convo = convoRaw as
    | { id: string; user_a: string; user_b: string }
    | null;
  if (!convo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (convo.user_a !== user.id && convo.user_b !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: inserted, error: insErr } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body,
    })
    .select("id, conversation_id, sender_id, body, read, created_at")
    .single();

  if (insErr || !inserted) {
    return NextResponse.json(
      { error: insErr?.message ?? "Insert failed" },
      { status: 500 },
    );
  }

  // Touch conversation.last_message_at
  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  // Best-effort notification (notifications table exists in this codebase)
  const recipientId = convo.user_a === user.id ? convo.user_b : convo.user_a;
  try {
    await supabase.from("notifications").insert({
      user_id: recipientId,
      type: "message",
      actor_id: user.id,
    });
  } catch {
    // ignore — notifications schema may not accept this type
  }

  return NextResponse.json({ message: inserted });
}
