"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Play, Pause, RotateCcw, Brain, Coffee, LogOut, Users, Copy, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { VoiceChat } from "@/components/focus/VoiceChat";
import SpotifyPanel from "@/components/focus/SpotifyPanel";

type Mode = "focus" | "break";
interface TimerState { mode: Mode; round: number; isRunning: boolean; remaining: number; startedAt: string | null; }
interface MemberProfile { display_name: string | null; username: string | null; avatar_url: string | null; }
interface Member { user_id: string; status: string; task: string; profiles: MemberProfile | null; }
interface RoomMeta { id: string; code: string; name: string; ownerId: string; isOwner: boolean; isMember: boolean; timer: TimerState; }

const DURATION: Record<Mode, number> = { focus: 1500, break: 300 };
const STATUS_CFG: Record<string, { label: string; color: string }> = {
  focusing: { label: "Focusing", color: "var(--accent)" },
  break:    { label: "On break", color: "var(--energy)" },
  away:     { label: "Away",     color: "var(--ink-faint)" },
};

function fmt(sec: number) {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

// Effective remaining seconds, accounting for elapsed time while running.
function displayRemaining(t: TimerState): number {
  if (t.isRunning && t.startedAt) {
    const elapsed = (Date.now() - new Date(t.startedAt).getTime()) / 1000;
    return Math.max(0, t.remaining - elapsed);
  }
  return t.remaining;
}

export default function RoomPage() {
  const router = useRouter();
  const params = useParams<{ code: string }>();
  const code = (params.code ?? "").toUpperCase();

  const [room, setRoom] = useState<RoomMeta | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [me, setMe] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [task, setTask] = useState("");
  const [, forceTick] = useState(0);
  const [copied, setCopied] = useState(false);
  const taskFocused = useRef(false);

  // Poll room state.
  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/focus/rooms/${code}`);
      if (res.status === 404) { setNotFound(true); return; }
      const d = await res.json();
      setRoom(d.room);
      setMembers(d.members ?? []);
      setMe(d.me);
      // Sync local task field from server unless the user is editing it.
      if (!taskFocused.current) {
        const mine = (d.members ?? []).find((m: Member) => m.user_id === d.me);
        if (mine && mine.task !== task) setTask(mine.task ?? "");
      }
    } catch { /* keep last state */ } finally {
      setLoading(false);
    }
  }, [code, task]);

  // Join on mount, then poll every 8s as a resilience fallback (Realtime below
  // handles instant updates; this also refreshes the joined member profiles).
  useEffect(() => {
    fetch(`/api/focus/rooms/${code}/join`, { method: "POST" }).catch(() => {}).finally(poll);
    const id = setInterval(poll, 8000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // Realtime: push timer changes + member join/leave instantly.
  useEffect(() => {
    if (!room?.id) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`room:${room.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "focus_rooms", filter: `id=eq.${room.id}` },
        (payload) => {
          const next = (payload.new as { timer_state?: TimerState })?.timer_state;
          if (next) setRoom((prev) => (prev ? { ...prev, timer: next } : prev));
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_members", filter: `room_id=eq.${room.id}` },
        () => { poll(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id]);

  // Heartbeat every 15s so presence stays fresh.
  useEffect(() => {
    const id = setInterval(() => {
      fetch(`/api/focus/rooms/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "presence" }),
      }).catch(() => {});
    }, 15000);
    return () => clearInterval(id);
  }, [code]);

  // Local 1s tick so the countdown animates smoothly between polls.
  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  async function controlTimer(next: Partial<TimerState>) {
    if (!room) return;
    const optimistic = { ...room.timer, ...next } as TimerState;
    setRoom({ ...room, timer: optimistic });
    await fetch(`/api/focus/rooms/${code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "timer", timer: next }),
    }).catch(() => {});
    poll();
  }

  function toggleRun() {
    if (!room) return;
    const t = room.timer;
    if (t.isRunning) {
      controlTimer({ isRunning: false, startedAt: null, remaining: displayRemaining(t) });
    } else {
      controlTimer({ isRunning: true, startedAt: new Date().toISOString(), remaining: displayRemaining(t) });
    }
  }
  function resetTimer() {
    if (!room) return;
    controlTimer({ isRunning: false, startedAt: null, remaining: DURATION[room.timer.mode] });
  }
  function switchMode(mode: Mode) {
    controlTimer({ mode, isRunning: false, startedAt: null, remaining: DURATION[mode] });
  }

  async function setStatus(status: string) {
    if (!room) return;
    setMembers((prev) => prev.map((m) => (m.user_id === me ? { ...m, status } : m)));
    await fetch(`/api/focus/rooms/${code}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "presence", status }),
    }).catch(() => {});
  }

  async function saveTask() {
    taskFocused.current = false;
    await fetch(`/api/focus/rooms/${code}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "presence", task }),
    }).catch(() => {});
  }

  async function leave() {
    await fetch(`/api/focus/rooms/${code}`, { method: "DELETE" }).catch(() => {});
    router.push("/dashboard/rooms");
  }

  function copyCode() {
    navigator.clipboard?.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }).catch(() => {});
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <Users size={32} strokeWidth={1} style={{ color: "var(--ink-faint)", marginBottom: 14 }} />
        <p className="font-sans text-[18px] font-semibold text-ink mb-1" style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif" }}>This room is closed</p>
        <p className="font-sans text-[14px] text-ink-muted mb-5">It may have ended or never existed.</p>
        <button onClick={() => router.push("/dashboard/rooms")} className="press-pop px-5 py-2.5 rounded-full font-sans text-[14px] font-bold" style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}>
          Back to rooms
        </button>
      </div>
    );
  }

  if (loading || !room) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}><Loader2 size={20} className="animate-spin text-ink-muted" /></div>;
  }

  const t = room.timer;
  const remaining = displayRemaining(t);
  const total = DURATION[t.mode];
  const pct = total > 0 ? ((total - remaining) / total) * 100 : 0;
  const accent = t.mode === "focus" ? "#a78bfa" : "#5eead4";
  const R = 110, C = 2 * Math.PI * R;
  const myStatus = members.find((m) => m.user_id === me)?.status ?? "focusing";

  return (
    <div className="min-h-screen pb-24" style={{
      background: [
        "radial-gradient(ellipse 80% 100% at 50% 120%, rgba(139,92,246,0.30) 0%, transparent 60%)",
        "linear-gradient(160deg, #1e1880 0%, #0f0d40 100%)",
      ].join(", "),
    }}>
      <div className="relative z-10 max-w-2xl mx-auto px-5 pt-7">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="min-w-0">
            <h1 className="font-sans text-[20px] font-bold truncate" style={{ color: "#fff", fontFamily: "var(--font-landing-sans), Inter, sans-serif", letterSpacing: "-0.02em" }}>{room.name}</h1>
            <button onClick={copyCode} className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest mt-0.5 transition-opacity hover:opacity-80" style={{ color: "rgba(167,139,250,0.85)" }}>
              {copied ? <Check size={11} /> : <Copy size={11} />} {code}
            </button>
          </div>
          <button onClick={leave} className="press-pop inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-sans text-[13px] font-semibold shrink-0" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}>
            <LogOut size={14} strokeWidth={2} /> Leave
          </button>
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center mb-7">
          {/* Mode (owner can switch) */}
          <div className="flex gap-1 p-1 rounded-2xl mb-5" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.10)" }}>
            {(["focus", "break"] as const).map((m) => (
              <button
                key={m}
                onClick={() => room.isOwner && switchMode(m)}
                disabled={!room.isOwner}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-sans text-[13px] font-semibold transition-all disabled:cursor-default"
                style={{ background: t.mode === m ? "rgba(255,255,255,0.14)" : "transparent", color: t.mode === m ? "#fff" : "rgba(255,255,255,0.5)" }}
              >
                {m === "focus" ? <Brain size={14} strokeWidth={2} /> : <Coffee size={14} strokeWidth={2} />}
                {m === "focus" ? "Focus" : "Break"}
              </button>
            ))}
          </div>

          <div className="relative" style={{ width: 252, height: 252 }}>
            <svg width={252} height={252} className="-rotate-90">
              <circle cx={126} cy={126} r={R} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={12} />
              <circle cx={126} cy={126} r={R} fill="none" stroke={accent} strokeWidth={12} strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={C - (pct / 100) * C}
                style={{ transition: "stroke-dashoffset 0.5s linear", filter: `drop-shadow(0 0 10px ${accent}88)` }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="tabular-nums" style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", fontWeight: 700, fontSize: 54, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>{fmt(remaining)}</span>
              <p className="font-mono text-[10px] uppercase tracking-widest mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                {remaining <= 0 ? "Time's up" : t.isRunning ? (t.mode === "focus" ? "Deep work" : "Recharge") : "Paused"}
              </p>
            </div>
          </div>

          {/* Owner controls */}
          {room.isOwner ? (
            <div className="flex items-center gap-3 mt-6">
              <button onClick={toggleRun} className="press-pop flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-sans text-[15px] font-bold transition-all"
                style={{ background: t.isRunning ? "rgba(255,255,255,0.14)" : "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", color: "#fff", boxShadow: t.isRunning ? "none" : "0 8px 32px rgba(139,92,246,0.5)", minWidth: 150 }}>
                {t.isRunning ? <Pause size={18} strokeWidth={2.5} fill="currentColor" /> : <Play size={18} strokeWidth={2.5} fill="currentColor" />}
                {t.isRunning ? "Pause" : "Start"}
              </button>
              <button onClick={resetTimer} className="press-pop flex items-center justify-center rounded-2xl" style={{ width: 52, height: 52, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>
                <RotateCcw size={18} strokeWidth={2} />
              </button>
            </div>
          ) : (
            <p className="mt-6 font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>The host controls the timer</p>
          )}
        </div>

        {/* Spotify now-playing */}
        <SpotifyPanel roomCode={code} isOwner={room.isOwner} />

        {/* Voice & video */}
        <VoiceChat roomCode={code} me={me} name={members.find((m) => m.user_id === me)?.profiles?.display_name ?? ""} members={members} />

        {/* My presence */}
        <div className="rounded-2xl p-4 mb-5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
          <p className="font-mono text-[10px] uppercase tracking-widest mb-2.5" style={{ color: "rgba(255,255,255,0.45)" }}>You</p>
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onFocus={() => { taskFocused.current = true; }}
            onBlur={saveTask}
            placeholder="What are you working on?"
            className="w-full rounded-xl px-3.5 py-2.5 font-sans text-[14px] outline-none mb-3"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
          />
          <div className="flex gap-2">
            {(["focusing", "break", "away"] as const).map((s) => (
              <button key={s} onClick={() => setStatus(s)}
                className="flex-1 py-2 rounded-xl font-sans text-[12px] font-semibold transition-all"
                style={{
                  background: myStatus === s ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.05)",
                  color: myStatus === s ? "#fff" : "rgba(255,255,255,0.5)",
                  border: `1px solid ${myStatus === s ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)"}`,
                }}>
                {STATUS_CFG[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* Members */}
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} strokeWidth={2} style={{ color: "rgba(255,255,255,0.5)" }} />
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>In the room · {members.length}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {members.map((m) => {
            const cfg = STATUS_CFG[m.status] ?? STATUS_CFG.focusing;
            const name = m.profiles?.display_name || m.profiles?.username || "Someone";
            return (
              <div key={m.user_id} className="flex items-center gap-3 px-3.5 py-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 overflow-hidden" style={{ background: "rgba(255,255,255,0.10)", color: "#a78bfa" }}>
                  {m.profiles?.avatar_url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={m.profiles.avatar_url} alt={name} className="w-full h-full object-cover" />
                    : name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[13px] font-semibold truncate" style={{ color: "#fff" }}>
                    {name}{m.user_id === room.ownerId && <span className="ml-1.5 font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(167,139,250,0.85)" }}>host</span>}
                  </p>
                  <p className="font-sans text-[11px] truncate" style={{ color: m.task ? "rgba(255,255,255,0.5)" : cfg.color }}>
                    {m.task || cfg.label}
                  </p>
                </div>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.color }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
