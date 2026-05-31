"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const BG      = "var(--bg)";
const CARD    = "var(--bg)";
const BORDER  = "var(--line)";
const TEAL    = "var(--accent)";
const TEAL_BG = "var(--accent-soft)";
const TEAL_BD = "var(--accent)";
const MUTED   = "var(--ink-muted)";

type OpenRoom = {
  code: string;
  name: string;
  ownerName: string;
  memberCount: number;
  maxMembers: number;
  isFull: boolean;
  alreadyIn: boolean;
  track: { name: string; artist: string } | null;
  avatars: { username: string; avatarUrl: string | null }[];
};

export default function RoomLobbyPage() {
  const router = useRouter();
  const [name,     setName]     = useState("");
  const [code,     setCode]     = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading,  setLoading]  = useState<"create"|"join"|string|null>(null);
  const [error,    setError]    = useState("");
  const [rooms,    setRooms]    = useState<OpenRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  const loadRooms = useCallback(async () => {
    try {
      const res = await fetch("/api/rooms/list");
      if (res.ok) {
        const data = await res.json();
        setRooms(data.rooms ?? []);
      }
    } catch { /* ignore */ }
    setRoomsLoading(false);
  }, []);

  useEffect(() => {
    loadRooms();
    const id = setInterval(loadRooms, 10_000);
    return () => clearInterval(id);
  }, [loadRooms]);

  async function create() {
    if (!name.trim()) { setError("Give your room a name"); return; }
    setLoading("create"); setError("");
    const res = await fetch("/api/rooms/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, isPrivate }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed"); setLoading(null); return; }
    router.push(`/room/${data.room.code}`);
  }

  function joinByCode() {
    const c = code.trim().toUpperCase();
    if (c.length < 4) { setError("Enter a valid room code"); return; }
    enterRoom(c, "join");
  }

  async function enterRoom(c: string, key: string) {
    setLoading(key); setError("");
    const res = await fetch(`/api/rooms/${c}/join`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed"); setLoading(null); return; }
    router.push(`/room/${c}`);
  }

  return (
    <div style={{
      minHeight: "100vh", background: BG, display: "flex",
      flexDirection: "column", alignItems: "center",
      padding: "48px 24px", fontFamily: "inherit",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16,
          background: TEAL_BG, border: `1px solid ${TEAL_BD}`,
          borderRadius: 999, padding: "6px 16px",
        }}>
          <span style={{ fontSize: 18 }}>⚡</span>
          <span style={{ color: TEAL, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em" }}>FOCUS ROOMS</span>
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 800, color: "var(--ink)", margin: 0, lineHeight: 1.1 }}>
          Work better together
        </h1>
        <p style={{ color: MUTED, fontSize: 16, marginTop: 12, lineHeight: 1.6 }}>
          Body-doubling for ADHD brains. Jump into an open room or start your own.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 760, display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Create + join row */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {/* Create */}
          <div style={{ flex: "1 1 320px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
            <h2 style={{ color: "var(--ink)", fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>
              Create a room
            </h2>
            <input
              placeholder="Room name (e.g. Late Night Grind)"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && create()}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 15,
                background: "var(--line)", border: `1px solid ${BORDER}`,
                color: "var(--ink)", outline: "none", marginBottom: 12, boxSizing: "border-box",
              }}
            />
            <label style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
              color: MUTED, fontSize: 13, cursor: "pointer",
            }}>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={e => setIsPrivate(e.target.checked)}
                style={{ accentColor: TEAL, width: 16, height: 16 }}
              />
              Invite-only (hide from open rooms)
            </label>
            <button
              onClick={create}
              disabled={loading === "create"}
              style={{
                width: "100%", padding: "13px", borderRadius: 10, fontSize: 15, fontWeight: 700,
                background: TEAL, color: "var(--bg)", border: "none", cursor: "pointer",
                opacity: loading === "create" ? 0.6 : 1,
              }}
            >
              {loading === "create" ? "Creating…" : "Create Room"}
            </button>
          </div>

          {/* Join by code */}
          <div style={{ flex: "1 1 280px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
            <h2 style={{ color: "var(--ink)", fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>
              Join by code
            </h2>
            <input
              placeholder="Room code (e.g. ABC123)"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && joinByCode()}
              maxLength={6}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 15,
                background: "var(--line)", border: `1px solid ${BORDER}`,
                color: "var(--ink)", outline: "none", marginBottom: 12, boxSizing: "border-box",
                letterSpacing: "0.12em", textTransform: "uppercase",
              }}
            />
            <button
              onClick={joinByCode}
              disabled={loading === "join"}
              style={{
                width: "100%", padding: "13px", borderRadius: 10, fontSize: 15, fontWeight: 700,
                background: "var(--line)", color: "var(--ink)",
                border: `1px solid ${BORDER}`, cursor: "pointer",
                opacity: loading === "join" ? 0.6 : 1,
              }}
            >
              {loading === "join" ? "Joining…" : "Join Room"}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ color: "#F87171", fontSize: 14, textAlign: "center" }}>{error}</div>
        )}

        {/* Open rooms */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ color: "var(--ink)", fontSize: 20, fontWeight: 800, margin: 0 }}>
              Open rooms
            </h2>
            <span style={{ color: MUTED, fontSize: 13 }}>
              {roomsLoading ? "Loading…" : `${rooms.length} live`}
            </span>
          </div>

          {!roomsLoading && rooms.length === 0 && (
            <div style={{
              background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
              padding: 40, textAlign: "center", color: MUTED, fontSize: 15,
            }}>
              No open rooms right now. Be the first — create one above! ⚡
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 14 }}>
            {rooms.map((r) => (
              <div key={r.code} style={{
                background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 18,
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ color: "var(--ink)", fontSize: 16, fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.name}
                    </h3>
                    <p style={{ color: MUTED, fontSize: 12, margin: "2px 0 0" }}>
                      by {r.ownerName}
                    </p>
                  </div>
                  <span style={{
                    flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5,
                    background: r.isFull ? "var(--line)" : TEAL_BG,
                    border: `1px solid ${r.isFull ? BORDER : TEAL_BD}`,
                    color: r.isFull ? MUTED : TEAL,
                    borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 700,
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: r.isFull ? MUTED : TEAL, display: "inline-block" }} />
                    {r.memberCount}/{r.maxMembers}
                  </span>
                </div>

                {/* Avatars */}
                <div style={{ display: "flex", alignItems: "center", minHeight: 28 }}>
                  {r.avatars.length === 0 && (
                    <span style={{ color: MUTED, fontSize: 12 }}>Empty room</span>
                  )}
                  {r.avatars.map((a, i) => (
                    <div key={i} style={{
                      width: 28, height: 28, borderRadius: 999, marginLeft: i === 0 ? 0 : -8,
                      border: `2px solid ${CARD}`, overflow: "hidden", flexShrink: 0,
                      background: "var(--accent)", color: TEAL,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700,
                    }}>
                      {a.avatarUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={a.avatarUrl} alt={a.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : a.username[0]?.toUpperCase() ?? "?"}
                    </div>
                  ))}
                  {r.memberCount > r.avatars.length && (
                    <span style={{ color: MUTED, fontSize: 12, marginLeft: 8 }}>
                      +{r.memberCount - r.avatars.length}
                    </span>
                  )}
                </div>

                {r.track && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: MUTED, fontSize: 12, overflow: "hidden" }}>
                    <span>🎵</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.track.name} — {r.track.artist}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => enterRoom(r.code, r.code)}
                  disabled={(r.isFull && !r.alreadyIn) || loading === r.code}
                  style={{
                    width: "100%", padding: "11px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                    background: r.alreadyIn ? "var(--line)" : TEAL,
                    color: r.alreadyIn ? "var(--ink)" : "var(--bg)",
                    border: r.alreadyIn ? `1px solid ${BORDER}` : "none",
                    cursor: (r.isFull && !r.alreadyIn) ? "not-allowed" : "pointer",
                    opacity: (r.isFull && !r.alreadyIn) ? 0.5 : (loading === r.code ? 0.6 : 1),
                  }}
                >
                  {loading === r.code ? "Joining…"
                    : r.alreadyIn ? "Rejoin"
                    : r.isFull ? "Full"
                    : "Join Room"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
