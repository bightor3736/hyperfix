"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Music, Play, Pause, SkipForward, SkipBack } from "lucide-react";

interface CurrentTrack {
  name: string;
  artist: string;
  albumArt: string | null;
  progressMs: number;
  durationMs: number;
  isPlaying: boolean;
  trackId: string | null;
}

interface NowPlayingResponse {
  connected: boolean;
  isOwner: boolean;
  track: CurrentTrack | null;
}

type Action = "play" | "pause" | "next" | "previous";

const SPOTIFY_GREEN = "#1DB954";
const ACCENT = "#a78bfa";
const POLL_MS = 5000;

const panelStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 14,
  padding: 14,
  color: "#fff",
};

export default function SpotifyPanel({
  roomCode,
  isOwner,
}: {
  roomCode: string;
  isOwner: boolean;
}) {
  const [state, setState] = useState<NowPlayingResponse | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const mounted = useRef(true);

  // Read ?spotify=connected|error once on mount.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("spotify");
      if (s === "connected") setStatus("Spotify connected");
      else if (s === "error") setStatus("Couldn't connect Spotify");
      if (s) {
        const t = setTimeout(() => {
          if (mounted.current) setStatus(null);
        }, 4000);
        return () => clearTimeout(t);
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchNowPlaying = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/spotify/now-playing?code=${encodeURIComponent(roomCode)}`,
        { cache: "no-store" }
      );
      if (!res.ok) return;
      const data = (await res.json()) as NowPlayingResponse;
      if (mounted.current) setState(data);
    } catch {
      // resilient: ignore transient errors
    }
  }, [roomCode]);

  useEffect(() => {
    mounted.current = true;
    fetchNowPlaying();
    const id = setInterval(fetchNowPlaying, POLL_MS);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [fetchNowPlaying]);

  const control = useCallback(
    async (action: Action) => {
      if (busy) return;
      setBusy(true);
      try {
        const res = await fetch("/api/spotify/control", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: roomCode, action }),
        });
        const data = (await res.json()) as { ok?: boolean; error?: string };
        if (!data.ok && data.error && mounted.current) {
          setStatus(data.error);
          setTimeout(() => {
            if (mounted.current) setStatus(null);
          }, 5000);
        }
        // Optimistically refresh state shortly after.
        setTimeout(fetchNowPlaying, 600);
      } catch {
        // ignore
      } finally {
        if (mounted.current) setBusy(false);
      }
    },
    [busy, roomCode, fetchNowPlaying]
  );

  const muted = "rgba(255,255,255,0.5)";

  const header = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
        fontSize: 13,
        fontWeight: 600,
        color: muted,
      }}
    >
      <Music size={15} color={SPOTIFY_GREEN} />
      <span>Now Playing</span>
    </div>
  );

  const statusLine = status ? (
    <div style={{ marginTop: 8, fontSize: 12, color: muted }}>{status}</div>
  ) : null;

  // Loading
  if (state === null) {
    return (
      <div style={panelStyle}>
        {header}
        <div style={{ fontSize: 13, color: muted }}>Loading…</div>
        {statusLine}
      </div>
    );
  }

  // Not connected
  if (!state.connected) {
    return (
      <div style={panelStyle}>
        {header}
        {isOwner ? (
          <a
            href={`/api/spotify/login?code=${encodeURIComponent(roomCode)}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: SPOTIFY_GREEN,
              color: "#000",
              fontWeight: 600,
              fontSize: 13,
              padding: "8px 14px",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            <Music size={15} />
            Connect Spotify
          </a>
        ) : (
          <div style={{ fontSize: 13, color: muted }}>
            Host hasn&apos;t connected Spotify
          </div>
        )}
        {statusLine}
      </div>
    );
  }

  const track = state.track;

  // Connected, nothing playing
  if (!track) {
    return (
      <div style={panelStyle}>
        {header}
        <div style={{ fontSize: 13, color: muted }}>Nothing playing</div>
        {isOwner && <Controls busy={busy} isPlaying={false} onAction={control} />}
        {statusLine}
      </div>
    );
  }

  const pct =
    track.durationMs > 0
      ? Math.min(100, Math.max(0, (track.progressMs / track.durationMs) * 100))
      : 0;

  return (
    <div style={panelStyle}>
      {header}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {track.albumArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.albumArt}
            alt=""
            width={48}
            height={48}
            style={{ borderRadius: 8, flexShrink: 0, objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              flexShrink: 0,
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Music size={20} color={muted} />
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {track.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: muted,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {track.artist}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          marginTop: 10,
          height: 3,
          borderRadius: 999,
          background: "rgba(255,255,255,0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: ACCENT,
            transition: "width 0.5s linear",
          }}
        />
      </div>

      {isOwner && (
        <Controls busy={busy} isPlaying={track.isPlaying} onAction={control} />
      )}
      {statusLine}
    </div>
  );
}

function Controls({
  busy,
  isPlaying,
  onAction,
}: {
  busy: boolean;
  isPlaying: boolean;
  onAction: (a: Action) => void;
}) {
  const btn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: busy ? "default" : "pointer",
    opacity: busy ? 0.6 : 1,
  };

  return (
    <div
      style={{
        marginTop: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      <button
        type="button"
        aria-label="Previous"
        style={btn}
        disabled={busy}
        onClick={() => onAction("previous")}
      >
        <SkipBack size={16} />
      </button>
      <button
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
        style={{ ...btn, width: 40, height: 40, background: ACCENT, color: "#000", border: "none" }}
        disabled={busy}
        onClick={() => onAction(isPlaying ? "pause" : "play")}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <button
        type="button"
        aria-label="Next"
        style={btn}
        disabled={busy}
        onClick={() => onAction("next")}
      >
        <SkipForward size={16} />
      </button>
    </div>
  );
}
