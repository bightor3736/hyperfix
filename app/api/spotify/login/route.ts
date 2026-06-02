// Spotify OAuth: start authorization (owner connects their Spotify to a room).
//
// Required env vars:
//   SPOTIFY_CLIENT_ID
//   SPOTIFY_CLIENT_SECRET   (used later in the callback)
//   NEXT_PUBLIC_SITE_URL    -> redirect URI is ${NEXT_PUBLIC_SITE_URL}/api/spotify/callback
//
// GET /api/spotify/login?code=ROOMCODE

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSpotifyCreds } from "@/lib/spotify";

const SCOPES =
  "user-read-playback-state user-modify-playback-state user-read-currently-playing";

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roomCode = searchParams.get("code")?.trim() ?? "";

  const errorRedirect = NextResponse.redirect(
    `${siteUrl()}/dashboard/rooms/${roomCode || ""}?spotify=error`
  );

  if (!roomCode || roomCode.length !== 6) return errorRedirect;

  const creds = getSpotifyCreds();
  if (!creds) return errorRedirect;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return errorRedirect;

  // Verify the user owns this room.
  const { data: room } = await supabase
    .from("focus_rooms")
    .select("id")
    .eq("code", roomCode)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!room) return errorRedirect;

  // state = base64url(roomCode):nonce — ownership is re-verified on callback.
  const nonce = Math.random().toString(36).slice(2);
  const state = `${Buffer.from(roomCode).toString("base64url")}.${nonce}`;

  const redirectUri = `${siteUrl()}/api/spotify/callback`;

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", creds.clientId);
  authUrl.searchParams.set("scope", SCOPES);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);

  return NextResponse.redirect(authUrl.toString());
}
