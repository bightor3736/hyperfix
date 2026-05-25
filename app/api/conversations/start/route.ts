import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { getOrCreateConversation } from "@/lib/conversations";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const { allowed } = rateLimit(`convo-start:${ip}`, 20, 60_000);
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

  let payload: { otherUserId?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const otherUserId = payload.otherUserId;
  if (!otherUserId || typeof otherUserId !== "string") {
    return NextResponse.json(
      { error: "otherUserId required" },
      { status: 400 },
    );
  }
  if (otherUserId === user.id) {
    return NextResponse.json(
      { error: "Cannot message yourself" },
      { status: 400 },
    );
  }

  try {
    const conversationId = await getOrCreateConversation(
      supabase,
      user.id,
      otherUserId,
    );
    return NextResponse.json({ conversationId });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}
