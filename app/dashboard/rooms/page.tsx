"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Users, Plus, LogIn, Lock, Radio } from "lucide-react";

interface Room {
  id: string;
  code: string;
  name: string;
  member_count: number;
  timer_state: { mode: "focus" | "break"; isRunning: boolean };
}

export default function RoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch("/api/focus/rooms")
      .then((r) => r.json())
      .then((d: { rooms: Room[] }) => setRooms(d.rooms ?? []))
      .finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (creating) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/focus/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || undefined, isPrivate }),
      });
      const d = await res.json();
      if (res.ok && d.code) router.push(`/dashboard/rooms/${d.code}`);
      else setError(d.error ?? "Could not create room");
    } finally {
      setCreating(false);
    }
  }

  async function join(e: React.FormEvent) {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (!code || joining) return;
    setJoining(true);
    setError(null);
    try {
      const res = await fetch(`/api/focus/rooms/${code}/join`, { method: "POST" });
      const d = await res.json();
      if (res.ok) router.push(`/dashboard/rooms/${code}`);
      else setError(d.error ?? "Room not found");
    } finally {
      setJoining(false);
    }
  }

  async function enter(code: string) {
    await fetch(`/api/focus/rooms/${code}/join`, { method: "POST" }).catch(() => {});
    router.push(`/dashboard/rooms/${code}`);
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>
      {/* Dark hero */}
      <header
        className="relative overflow-hidden"
        style={{
          background: [
            "radial-gradient(ellipse 80% 140% at 110% 65%, rgba(139,92,246,0.60) 0%, transparent 55%)",
            "radial-gradient(ellipse 50% 80%  at 85%  -5%, rgba(99,102,241,0.45) 0%, transparent 50%)",
            "linear-gradient(145deg, #1e1880 0%, #0f0d40 100%)",
          ].join(", "),
          padding: "clamp(28px,4.5vw,44px) clamp(20px,5vw,44px) 56px",
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px", opacity: 0.7 }} />
        <div className="relative z-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: "rgba(167,139,250,0.8)" }}>Body doubling</p>
          <h1 style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", fontWeight: 700, letterSpacing: "-0.05em", fontSize: "clamp(36px,5.5vw,54px)", lineHeight: 1, color: "#fff" }}>
            Focus <span style={{ fontFamily: "var(--font-landing-serif), 'Source Serif 4', serif", fontStyle: "italic" }}>together</span>.
          </h1>
          <p className="mt-3 font-sans text-[15px]" style={{ color: "rgba(255,255,255,0.55)" }}>
            Work alongside other people in real time. A shared timer keeps everyone honest.
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 sm:px-8" style={{ marginTop: -24 }}>
        {/* Create + join */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <form onSubmit={create} className="rounded-[var(--radius-xl)] p-5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--ink-faint)" }}>Start a room</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Room name (optional)"
              className="w-full rounded-[var(--radius-lg)] px-3.5 py-2.5 font-sans text-[14px] text-ink outline-none mb-2.5"
              style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
            />
            <label className="flex items-center gap-2 mb-3 cursor-pointer select-none">
              <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="accent-[var(--accent)]" />
              <span className="font-sans text-[12px] text-ink-muted inline-flex items-center gap-1"><Lock size={11} /> Private (invite only)</span>
            </label>
            <button
              type="submit"
              disabled={creating}
              className="press-pop w-full flex items-center justify-center gap-2 py-2.5 rounded-[var(--radius-lg)] font-sans text-[14px] font-bold transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "#fff", boxShadow: "0 6px 24px rgba(79,70,229,0.3)" }}
            >
              {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} strokeWidth={2.5} />}
              Create
            </button>
          </form>

          <form onSubmit={join} className="rounded-[var(--radius-xl)] p-5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--ink-faint)" }}>Join by code</p>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={6}
              className="w-full rounded-[var(--radius-lg)] px-3.5 py-2.5 font-mono text-[16px] tracking-[0.2em] text-ink outline-none mb-2.5 text-center uppercase"
              style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
            />
            <div className="mb-3" style={{ height: 22 }} />
            <button
              type="submit"
              disabled={joining || joinCode.trim().length < 4}
              className="press-pop w-full flex items-center justify-center gap-2 py-2.5 rounded-[var(--radius-lg)] font-sans text-[14px] font-bold transition-all disabled:opacity-50"
              style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
            >
              {joining ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} strokeWidth={2.5} />}
              Join
            </button>
          </form>
        </div>

        {error && (
          <p className="font-sans text-[13px] rounded-xl px-3 py-2.5 mb-4" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "var(--ink)" }}>{error}</p>
        )}

        {/* Open rooms */}
        <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--ink-faint)" }}>Open rooms</p>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={18} className="animate-spin text-ink-muted" /></div>
        ) : rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-[var(--radius-lg)]" style={{ border: "1px dashed var(--line)" }}>
            <Users size={28} strokeWidth={1} style={{ color: "var(--ink-faint)", marginBottom: 12 }} />
            <p className="font-sans text-[16px] font-semibold text-ink mb-1" style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", letterSpacing: "-0.02em" }}>No open rooms right now</p>
            <p className="font-sans text-[13px] text-ink-muted">Start one above and invite a friend with the code.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => enter(room.code)}
                className="press-pop w-full flex items-center gap-3 px-4 py-3.5 rounded-[var(--radius-lg)] text-left transition-all hover:brightness-[0.99]"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
              >
                <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 40, height: 40, background: "var(--accent-soft)", color: "var(--accent)" }}>
                  <Radio size={17} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[14px] font-semibold text-ink truncate">{room.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest mt-0.5" style={{ color: "var(--ink-faint)" }}>
                    {room.timer_state?.mode === "break" ? "On break" : "Focusing"} · {room.code}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] shrink-0" style={{ color: "var(--ink-muted)" }}>
                  <Users size={13} strokeWidth={2} /> {room.member_count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
