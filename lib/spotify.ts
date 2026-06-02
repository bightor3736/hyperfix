import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Server-only Spotify helpers.
 *
 * Required env vars:
 *   SPOTIFY_CLIENT_ID
 *   SPOTIFY_CLIENT_SECRET
 */

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

export interface CurrentTrack {
  name: string;
  artist: string;
  albumArt: string | null;
  progressMs: number;
  durationMs: number;
  isPlaying: boolean;
  trackId: string | null;
}

interface SpotifyImage {
  url?: string;
}
interface SpotifyArtist {
  name?: string;
}
interface SpotifyAlbum {
  images?: SpotifyImage[];
}
interface SpotifyItem {
  id?: string;
  name?: string;
  duration_ms?: number;
  artists?: SpotifyArtist[];
  album?: SpotifyAlbum;
}
interface CurrentlyPlayingResponse {
  is_playing?: boolean;
  progress_ms?: number;
  item?: SpotifyItem | null;
}

interface TokenRefreshResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
}

function spotifyCreds(): { clientId: string; clientSecret: string } | null {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

/**
 * Maps a Spotify "currently-playing" JSON payload to the stored current_track shape.
 * Returns null when there is nothing to map.
 */
export function mapTrack(json: unknown): CurrentTrack | null {
  if (!json || typeof json !== "object") return null;
  const data = json as CurrentlyPlayingResponse;
  const item = data.item;
  if (!item || typeof item !== "object") return null;

  const artist = Array.isArray(item.artists)
    ? item.artists.map((a) => a.name).filter(Boolean).join(", ")
    : "";
  const albumArt = item.album?.images?.[0]?.url ?? null;

  return {
    name: item.name ?? "",
    artist,
    albumArt,
    progressMs: typeof data.progress_ms === "number" ? data.progress_ms : 0,
    durationMs: typeof item.duration_ms === "number" ? item.duration_ms : 0,
    isPlaying: Boolean(data.is_playing),
    trackId: item.id ?? null,
  };
}

/**
 * Returns a valid (non-expired) Spotify access token for the room's owner.
 * If the current token is expired (or about to be), it refreshes via the
 * refresh token, persists the new token + expiry on the focus_rooms row
 * (admin client / service role), and returns the fresh token.
 *
 * Returns null if credentials/tokens are missing or the refresh fails.
 */
export async function getValidAccessToken(
  roomId: string,
  accessToken: string | null,
  refreshToken: string | null,
  expiresAt: string | null
): Promise<string | null> {
  if (!accessToken) return null;

  const expiresAtMs = expiresAt ? new Date(expiresAt).getTime() : 0;
  // 30s safety margin.
  const stillValid = expiresAtMs && expiresAtMs - 30_000 > Date.now();
  if (stillValid) return accessToken;

  if (!refreshToken) return null;
  const creds = spotifyCreds();
  if (!creds) return null;

  try {
    const basic = Buffer.from(
      `${creds.clientId}:${creds.clientSecret}`
    ).toString("base64");

    const res = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = (await res.json()) as TokenRefreshResponse;
    if (!json.access_token) return null;

    const newExpiresAt = new Date(
      Date.now() + (json.expires_in ?? 3600) * 1000
    ).toISOString();

    const admin = createAdminClient();
    const update: Record<string, string> = {
      spotify_access_token: json.access_token,
      spotify_expires_at: newExpiresAt,
    };
    // Spotify may rotate the refresh token.
    if (json.refresh_token) update.spotify_refresh_token = json.refresh_token;

    await admin.from("focus_rooms").update(update).eq("id", roomId);

    return json.access_token;
  } catch {
    return null;
  }
}

export function tokenEndpoint(): string {
  return TOKEN_ENDPOINT;
}

export function getSpotifyCreds(): {
  clientId: string;
  clientSecret: string;
} | null {
  return spotifyCreds();
}
