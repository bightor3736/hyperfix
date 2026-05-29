"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BG      = "#070708";
const CARD    = "#0F1011";
const BORDER  = "rgba(255,255,255,0.07)";
const TEAL    = "#5EEAD4";
const TEAL_BG = "rgba(94,234,212,0.08)";
const TEAL_BD = "rgba(94,234,212,0.20)";
const MUTED   = "rgba(255,255,255,0.45)";

export default function RoomLobbyPage() {
  const router = useRouter();
  const [name,     setName]     = useState("");
  const [code,     setCode]     = useState("");
  const [loading,  setLoading]  = useState<"create"|"join"|null>(null);
  const [error,    setError]    = useState("");

  async function create() {
    if (!name.trim()) { setError("Give your room a name"); return; }
    setLoading("create"); setError("");
    const res = await fetch("/api/rooms/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed"); setLoading(null); return; }
    router.push(`/room/${data.room.code}`);
  }

  async function join() {
    const c = code.trim().toUpperCase();
    if (c.length < 4) { setError("Enter a valid room code"); return; }
    setLoading("join"); setError("");
    const res = await fetch(`/api/rooms/${c}/join`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed"); setLoading(null); return; }
    router.push(`/room/${c}`);
  }

  return (
    <div style={{
      minHeight: "100vh", background: BG, display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px", fontFamily: "inherit",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16,
          background: TEAL_BG, border: `1px solid ${TEAL_BD}`,
          borderRadius: 999, padding: "6px 16px",
        }}>
          <span style={{ fontSize: 18 }}>⚡</span>
          <span style={{ color: TEAL, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em" }}>FOCUS ROOMS</span>
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.1 }}>
          Work better<br />together
        </h1>
        <p style={{ color: MUTED, fontSize: 16, marginTop: 12, lineHeight: 1.6 }}>
          Body-doubling for ADHD brains. Join a room,<br />
          stay accountable, get things done.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 460, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Create */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
          <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>
            Create a room
          </h2>
          <input
            placeholder="Room name (e.g. Late Night Grind)"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && create()}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 15,
              background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`,
              color: "#fff", outline: "none", marginBottom: 12, boxSizing: "border-box",
            }}
          />
          <button
            onClick={create}
            disabled={loading === "create"}
            style={{
              width: "100%", padding: "13px", borderRadius: 10, fontSize: 15, fontWeight: 700,
              background: TEAL, color: "#071610", border: "none", cursor: "pointer",
              opacity: loading === "create" ? 0.6 : 1,
            }}
          >
            {loading === "create" ? "Creating…" : "Create Room"}
          </button>
        </div>

        <div style={{ textAlign: "center", color: MUTED, fontSize: 13 }}>or</div>

        {/* Join */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
          <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>
            Join a room
          </h2>
          <input
            placeholder="Room code (e.g. ABC123)"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === "Enter" && join()}
            maxLength={6}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 15,
              background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`,
              color: "#fff", outline: "none", marginBottom: 12, boxSizing: "border-box",
              letterSpacing: "0.12em", textTransform: "uppercase",
            }}
          />
          <button
            onClick={join}
            disabled={loading === "join"}
            style={{
              width: "100%", padding: "13px", borderRadius: 10, fontSize: 15, fontWeight: 700,
              background: "rgba(255,255,255,0.08)", color: "#fff",
              border: `1px solid ${BORDER}`, cursor: "pointer",
              opacity: loading === "join" ? 0.6 : 1,
            }}
          >
            {loading === "join" ? "Joining…" : "Join Room"}
          </button>
        </div>

        {error && (
          <div style={{ color: "#F87171", fontSize: 14, textAlign: "center" }}>{error}</div>
        )}
      </div>
    </div>
  );
}
