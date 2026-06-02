// Spotify playback control — owner only. Requires Spotify Premium + an active device.
//
// Required env vars: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET
//
// POST /api/spotify/control  { code: ROOMCODE, action: "play"|"pause"|"next"|"previous" }
// -> { ok: true } | { ok: false, error: string }

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getValidAccessToken } from "@/lib/spotify";

type Action = "play" | "pause" | "next" | "previous";

interface RoomRow {
  id: string;
  owner_id: string;
  spotify_access_token: string | null;
  spotify_refresh_token: string | null;
  spotify_expires_at: string | null;
}

const ENDPOINTS: Record<Action, { method: "PUT" | "POST"; path: string }> = {
  play: { method: "PUT", path: "play" },
  pause: { method: "PUT", path: "pause" },
  next: { method: "POST", path: "next" },
  previous: { method: "POST", path: "previous" },
};

const PREMIUM_HINT =
  "Open Spotify on a device first, and note playback control needs Premium.";

export async function POST(req: Request) {
  let body: { code?: string; action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const roomCode = (body.code ?? "").trim();
  const action = body.action as Action | undefined;

  if (!roomCode || !action || !(action in ENDPOINTS)) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid code/action" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { data: room } = await supabase
    .from("focus_rooms")
    .select(
      "id, owner_id, spotify_access_token, spotify_refresh_token, spotify_expires_at"
    )
    .eq("code", roomCode)
    .maybeSingle<RoomRow>();

  if (!room) {
    return NextResponse.json({ ok: false, error: "Room not found" }, { status: 404 });
  }

  if (room.owner_id !== user.id) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const accessToken = await getValidAccessToken(
    room.id,
    room.spotify_access_token,
    room.spotify_refresh_token,
    room.spotify_expires_at
  );

  if (!accessToken) {
    return NextResponse.json({ ok: false, error: "Spotify not connected" });
  }

  const { method, path } = ENDPOINTS[action];

  try {
    const res = await fetch(`https://api.spotify.com/v1/me/player/${path}`, {
      method,
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    // 204 = success (no content). 200 also fine.
    if (res.status === 204 || res.status === 200) {
      return NextResponse.json({ ok: true });
    }

    // No active device / not premium.
    if (res.status === 403 || res.status === 404) {
      return NextResponse.json({ ok: false, error: PREMIUM_HINT });
    }

    return NextResponse.json({ ok: false, error: "Spotify request failed" });
  } catch {
    return NextResponse.json({ ok: false, error: "Spotify request failed" });
  }
}
