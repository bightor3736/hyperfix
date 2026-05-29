import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get("code");
  const state = searchParams.get("state") ?? ""; // room code
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL(`/room/${state}?spotify=denied`, req.url));
  }

  // Exchange code for tokens
  const body = new URLSearchParams({
    grant_type:   "authorization_code",
    code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI ?? "",
  });

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body,
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL(`/room/${state}?spotify=error`, req.url));
  }

  const tokens = await tokenRes.json();
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/auth/login", req.url));

  // Store tokens on the room owned by this user
  if (state) {
    await supabase
      .from("focus_rooms")
      .update({
        spotify_access_token:  tokens.access_token,
        spotify_refresh_token: tokens.refresh_token,
        spotify_expires_at:    expiresAt,
      })
      .eq("code", state.toUpperCase())
      .eq("owner_id", user.id);
  }

  return NextResponse.redirect(new URL(`/room/${state}?spotify=ok`, req.url));
}
