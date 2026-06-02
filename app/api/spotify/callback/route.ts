// Spotify OAuth: callback — exchange auth code for tokens and store on the room.
//
// Required env vars:
//   SPOTIFY_CLIENT_ID
//   SPOTIFY_CLIENT_SECRET
//   NEXT_PUBLIC_SITE_URL
//
// GET /api/spotify/callback?code=AUTHCODE&state=BASE64ROOM.nonce

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSpotifyCreds, tokenEndpoint } from "@/lib/spotify";

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "";
}

function decodeRoomCode(state: string | null): string {
  if (!state) return "";
  const raw = state.split(".")[0] ?? "";
  try {
    return Buffer.from(raw, "base64url").toString("utf8");
  } catch {
    return "";
  }
}

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const authCode = searchParams.get("code");
  const state = searchParams.get("state");
  const roomCode = decodeRoomCode(state);

  const errorRedirect = NextResponse.redirect(
    `${siteUrl()}/dashboard/rooms/${roomCode || ""}?spotify=error`
  );

  if (!authCode || !roomCode) return errorRedirect;

  const creds = getSpotifyCreds();
  if (!creds) return errorRedirect;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return errorRedirect;

  // Re-verify ownership.
  const { data: room } = await supabase
    .from("focus_rooms")
    .select("id")
    .eq("code", roomCode)
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!room) return errorRedirect;

  const redirectUri = `${siteUrl()}/api/spotify/callback`;

  try {
    const basic = Buffer.from(
      `${creds.clientId}:${creds.clientSecret}`
    ).toString("base64");

    const res = await fetch(tokenEndpoint(), {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: redirectUri,
      }),
      cache: "no-store",
    });

    if (!res.ok) return errorRedirect;
    const tokens = (await res.json()) as TokenResponse;
    if (!tokens.access_token || !tokens.refresh_token) return errorRedirect;

    const expiresAt = new Date(
      Date.now() + (tokens.expires_in ?? 3600) * 1000
    ).toISOString();

    const admin = createAdminClient();
    await admin
      .from("focus_rooms")
      .update({
        spotify_access_token: tokens.access_token,
        spotify_refresh_token: tokens.refresh_token,
        spotify_expires_at: expiresAt,
      })
      .eq("id", room.id);

    return NextResponse.redirect(
      `${siteUrl()}/dashboard/rooms/${roomCode}?spotify=connected`
    );
  } catch {
    return errorRedirect;
  }
}
