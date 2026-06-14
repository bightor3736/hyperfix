import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // follower count (people who follow userId)
  const { count: followerCount } = await supabase
    .from("follows")
    .select("id", { count: "exact", head: true })
    .eq("following_id", userId);

  // following count (people userId follows)
  const { count: followingCount } = await supabase
    .from("follows")
    .select("id", { count: "exact", head: true })
    .eq("follower_id", userId);

  let following = false;
  if (user) {
    const { data: existing } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", userId)
      .maybeSingle();
    following = !!existing;
  }

  return NextResponse.json({
    following,
    followerCount: followerCount ?? 0,
    followingCount: followingCount ?? 0,
  });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const { allowed } = rateLimit(`follow:${ip}`, 10, 60_000);
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

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { targetUserId } = body as { targetUserId: string };

  if (!targetUserId) {
    return NextResponse.json({ error: "targetUserId required" }, { status: 400 });
  }

  if (targetUserId === user.id) {
    return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
  }

  // Check if already following
  const { data: existing } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle();

  if (existing) {
    // Unfollow
    await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId);
  } else {
    // Follow
    await supabase.from("follows").insert({
      follower_id: user.id,
      following_id: targetUserId,
    });

    // In-app notification (respect the target's preference)
    const { data: targetPrefs } = await supabase
      .from("profiles")
      .select("notification_prefs")
      .eq("id", targetUserId)
      .single();
    const prefs = (targetPrefs?.notification_prefs ?? {}) as Record<string, boolean>;
    if (prefs.social_follows !== false) {
      await supabase.from("notifications").insert({
        user_id: targetUserId,
        type: "follow",
        actor_id: user.id,
      });
    }

  }

  // Return updated follower count
  const { count: followerCount } = await supabase
    .from("follows")
    .select("id", { count: "exact", head: true })
    .eq("following_id", targetUserId);

  return NextResponse.json({
    following: !existing,
    followerCount: followerCount ?? 0,
  });
}
