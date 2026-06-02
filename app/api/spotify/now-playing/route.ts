// Spotify now-playing — polled by ALL room members.
//
// Only the owner's request hits Spotify (and refreshes tokens). Non-owners just
// get the stored `current_track` from the room row.
//
// Required env vars: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET
//
// GET /api/spotify/now-playing?code=ROOMCODE
// -> { connected: boolean, isOwner: boolean, track: CurrentTrack | null }

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getValidAccessToken, mapTrack, type CurrentTrack } from "@/lib/spotify";

interface RoomRow {
  id: string;
  owner_id: string;
  spotify_access_token: string | null;
  spotify_refresh_token: string | null;
  spotify_expires_at: string | null;
  current_track: CurrentTrack | null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roomCode = searchParams.get("code")?.trim() ?? "";

  if (!roomCode) {
    return NextResponse.json({ error: "Missing room code" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: room } = await supabase
    .from("focus_rooms")
    .select(
      "id, owner_id, spotify_access_token, spotify_refresh_token, spotify_expires_at, current_track"
    )
    .eq("code", roomCode)
    .maybeSingle<RoomRow>();

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const isOwner = room.owner_id === user.id;
  const connected = Boolean(room.spotify_access_token);

  if (!connected) {
    return NextResponse.json({ connected: false, isOwner, track: null });
  }

  // Non-owners just read the cached track.
  if (!isOwner) {
    return NextResponse.json({
      connected: true,
      isOwner: false,
      track: room.current_track ?? null,
    });
  }

  // Owner: refresh token if needed, then hit Spotify and persist the result.
  const accessToken = await getValidAccessToken(
    room.id,
    room.spotify_access_token,
    room.spotify_refresh_token,
    room.spotify_expires_at
  );

  if (!accessToken) {
    // Token problem — fall back to cached track but still report connected.
    return NextResponse.json({
      connected: true,
      isOwner: true,
      track: room.current_track ?? null,
    });
  }

  try {
    const res = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );

    // 204 = nothing playing.
    let track: CurrentTrack | null = null;
    if (res.status === 200) {
      const json = await res.json();
      track = mapTrack(json);
    }

    // Persist for non-owner members.
    const admin = createAdminClient();
    await admin
      .from("focus_rooms")
      .update({ current_track: track })
      .eq("id", room.id);

    return NextResponse.json({ connected: true, isOwner: true, track });
  } catch {
    return NextResponse.json({
      connected: true,
      isOwner: true,
      track: room.current_track ?? null,
    });
  }
}
