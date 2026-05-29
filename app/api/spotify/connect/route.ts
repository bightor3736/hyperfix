import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-modify-playback-state",
].join(" ");

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/auth/login", req.url));

  const { searchParams } = new URL(req.url);
  const roomCode = searchParams.get("room") ?? "";

  const params = new URLSearchParams({
    client_id:     process.env.SPOTIFY_CLIENT_ID ?? "",
    response_type: "code",
    redirect_uri:  process.env.SPOTIFY_REDIRECT_URI ?? "",
    scope:         SCOPES,
    state:         roomCode,
  });

  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
}
