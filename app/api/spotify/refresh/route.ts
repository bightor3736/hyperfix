import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Refreshes Spotify token for the room and returns the current track
export async function POST(req: Request) {
  const { roomCode } = await req.json();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: room } = await supabase
    .from("focus_rooms")
    .select("id, owner_id, spotify_access_token, spotify_refresh_token, spotify_expires_at")
    .eq("code", roomCode.toUpperCase())
    .eq("owner_id", user.id)
    .single();

  if (!room?.spotify_refresh_token) return NextResponse.json({ error: "No Spotify connected" }, { status: 404 });

  let accessToken = room.spotify_access_token;

  // Refresh if expired
  if (new Date(room.spotify_expires_at ?? 0) < new Date(Date.now() + 60_000)) {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type:    "refresh_token",
        refresh_token: room.spotify_refresh_token,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      accessToken = data.access_token;
      await supabase.from("focus_rooms").update({
        spotify_access_token: accessToken,
        spotify_expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
      }).eq("id", room.id);
    }
  }

  // Fetch current track
  const trackRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (trackRes.status === 204) return NextResponse.json({ track: null });
  if (!trackRes.ok)           return NextResponse.json({ error: "Spotify error" }, { status: 502 });

  const data = await trackRes.json();
  if (!data?.item) return NextResponse.json({ track: null });

  const track = {
    name:        data.item.name,
    artist:      data.item.artists.map((a: { name: string }) => a.name).join(", "),
    albumArt:    data.item.album.images[0]?.url ?? null,
    progressMs:  data.progress_ms,
    durationMs:  data.item.duration_ms,
    isPlaying:   data.is_playing,
    trackId:     data.item.id,
    trackUri:    data.item.uri,
  };

  // Persist to room so new joiners see it
  await supabase.from("focus_rooms").update({ current_track: track }).eq("id", room.id);

  return NextResponse.json({ track });
}
