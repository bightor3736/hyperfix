"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ── Design tokens ─────────────────────────────────────────────────────────────
const BG       = "#070708";
const CARD     = "#0F1011";
const CARD2    = "#141516";
const BORDER   = "rgba(255,255,255,0.07)";
const TEAL     = "#5EEAD4";
const TEAL_BG  = "rgba(94,234,212,0.08)";
const TEAL_BD  = "rgba(94,234,212,0.22)";
const MUTED    = "rgba(255,255,255,0.45)";
const MUTED2   = "rgba(255,255,255,0.22)";
const RED_BG   = "rgba(248,113,113,0.10)";
const RED_BD   = "rgba(248,113,113,0.28)";

// ── Types ─────────────────────────────────────────────────────────────────────

type Profile = { id: string; username: string; avatarUrl: string | null };
type TimerState = { mode: "focus"|"short-break"|"long-break"; remaining: number; isRunning: boolean; round: number };
type SpotifyTrack = { name: string; artist: string; albumArt: string|null; progressMs: number; durationMs: number; isPlaying: boolean; trackUri: string };

type Member = {
  user_id:  string;
  status:   "focusing"|"break"|"away";
  task:     string;
  profile:  { id: string; username: string; avatar_url: string|null };
};

type ChatMsg = {
  id:         string;
  content:    string;
  created_at: string;
  profile:    { username: string; avatar_url: string|null };
};

type Room = {
  id:                   string;
  code:                 string;
  name:                 string;
  owner_id:             string;
  timer_state:          TimerState;
  current_track:        SpotifyTrack | null;
  spotify_access_token: string | null;
  members:              Member[];
  messages:             ChatMsg[];
};

type Presence = { userId: string; username: string; avatarUrl: string|null; status: string; task: string; isMuted: boolean };

// ── Ambient audio (Web Audio API) ─────────────────────────────────────────────

type AmbientMode = "off"|"white"|"brown"|"rain";

function createAmbient(ctx: AudioContext, mode: AmbientMode): { gain: GainNode; stop: () => void } | null {
  if (mode === "off") return null;

  const bufferSize = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const d = buf.getChannelData(0);

  if (mode === "white") {
    for (let i = 0; i < bufferSize; i++) d[i] = Math.random() * 2 - 1;
  } else if (mode === "brown") {
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const w = Math.random() * 2 - 1;
      d[i] = (last + 0.02 * w) / 1.02;
      last = d[i];
      d[i] *= 3.5;
    }
  } else { // rain
    for (let i = 0; i < bufferSize; i++) {
      d[i] = (Math.random() * 2 - 1) * 0.5;
      if (Math.random() < 0.0003) {
        const burst = Math.min(bufferSize - i, 800);
        for (let j = 0; j < burst; j++) {
          d[i + j] += (Math.random() * 2 - 1) * Math.pow(1 - j / burst, 2) * 0.9;
        }
      }
    }
  }

  const src   = ctx.createBufferSource();
  src.buffer  = buf;
  src.loop    = true;
  const gain  = ctx.createGain();
  gain.gain.value = 0.18;
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start();
  return { gain, stop: () => { try { src.stop(); } catch {} } };
}

// ── Timer helpers ─────────────────────────────────────────────────────────────

const TIMER_DURATIONS = { focus: 1500, "short-break": 300, "long-break": 900 } as const;

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ url, name, size = 40 }: { url: string|null; name: string; size?: number }) {
  const initials = name.slice(0, 2).toUpperCase();
  if (url) return (
    <img src={url} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: TEAL_BG,
      border: `1px solid ${TEAL_BD}`, display: "flex", alignItems: "center", justifyContent: "center",
      color: TEAL, fontSize: size * 0.36, fontWeight: 800, flexShrink: 0,
    }}>{initials}</div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function RoomClient({ initialRoom, currentUser }: {
  initialRoom: Room;
  currentUser: Profile;
}) {
  const router     = useRouter();
  const supabase   = createClient();
  const code       = initialRoom.code;
  const isOwner    = currentUser.id === initialRoom.owner_id;

  // ── State ──────────────────────────────────────────────────────────────────

  const [members,    setMembers]    = useState<Member[]>(initialRoom.members);
  const [messages,   setMessages]   = useState<ChatMsg[]>(initialRoom.messages ?? []);
  const [timer,      setTimer]      = useState<TimerState>(initialRoom.timer_state);
  const [track,      setTrack]      = useState<SpotifyTrack|null>(initialRoom.current_track);
  const [presence,   setPresence]   = useState<Map<string, Presence>>(new Map());
  const [myStatus,   setMyStatus]   = useState<"focusing"|"break"|"away">("focusing");
  const [myTask,     setMyTask]     = useState("");
  const [chatInput,  setChatInput]  = useState("");
  const [ambient,    setAmbient]    = useState<AmbientMode>("off");
  const [ambientVol, setAmbientVol] = useState(0.18);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [peerVols,   setPeerVols]   = useState<Record<string, number>>({});
  const [peerMutes,  setPeerMutes]  = useState<Record<string, boolean>>({});
  const [copied,     setCopied]     = useState(false);
  const [tab,        setTab]        = useState<"chat"|"members">("members");
  const [reactions,  setReactions]  = useState<{ id: string; emoji: string; from: string }[]>([]);

  // ── Refs ───────────────────────────────────────────────────────────────────

  const channelRef   = useRef<RealtimeChannel | null>(null);
  const audioCtxRef  = useRef<AudioContext | null>(null);
  const ambientRef   = useRef<{ gain: GainNode; stop: () => void } | null>(null);
  const localStream  = useRef<MediaStream | null>(null);
  const peerConns    = useRef<Map<string, RTCPeerConnection>>(new Map());
  const peerGains    = useRef<Map<string, GainNode>>(new Map());
  const chatEndRef   = useRef<HTMLDivElement | null>(null);
  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerState   = useRef(timer);
  timerState.current = timer;

  // ── Realtime channel setup ─────────────────────────────────────────────────

  useEffect(() => {
    const ch = supabase.channel(`room:${code}`, { config: { presence: { key: currentUser.id } } });

    // Presence
    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState<Presence>();
      const map = new Map<string, Presence>();
      for (const [key, payloads] of Object.entries(state)) {
        const p = (payloads as Presence[])[0];
        if (p) map.set(key, p);
      }
      setPresence(map);
    });

    // Broadcast events from others
    ch.on("broadcast", { event: "chat" }, ({ payload }) => {
      setMessages(prev => [...prev, payload as ChatMsg]);
    });

    ch.on("broadcast", { event: "timer" }, ({ payload }) => {
      setTimer(payload as TimerState);
    });

    ch.on("broadcast", { event: "track" }, ({ payload }) => {
      setTrack(payload as SpotifyTrack | null);
    });

    ch.on("broadcast", { event: "reaction" }, ({ payload }) => {
      const r = { id: Math.random().toString(36).slice(2), ...payload } as { id: string; emoji: string; from: string };
      setReactions(prev => [...prev, r]);
      setTimeout(() => setReactions(p => p.filter(x => x.id !== r.id)), 3000);
    });

    // WebRTC signaling
    ch.on("broadcast", { event: "rtc-offer" },   ({ payload }) => handleOffer(payload));
    ch.on("broadcast", { event: "rtc-answer" },  ({ payload }) => handleAnswer(payload));
    ch.on("broadcast", { event: "rtc-ice" },     ({ payload }) => handleIce(payload));
    ch.on("broadcast", { event: "rtc-leave" },   ({ payload }) => closePeer(payload.from));

    ch.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") return;
      await ch.track({
        userId:   currentUser.id,
        username: currentUser.username,
        avatarUrl: currentUser.avatarUrl,
        status:   myStatus,
        task:     myTask,
        isMuted:  isMicMuted,
      } as Presence);
    });

    channelRef.current = ch;
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // Keep presence updated when my state changes
  useEffect(() => {
    channelRef.current?.track({
      userId:    currentUser.id,
      username:  currentUser.username,
      avatarUrl: currentUser.avatarUrl,
      status:    myStatus,
      task:      myTask,
      isMuted:   isMicMuted,
    } as Presence);
  }, [myStatus, myTask, isMicMuted]);

  // ── Timer tick (client-side countdown) ────────────────────────────────────

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!timer.isRunning) return;

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (!prev.isRunning) return prev;
        if (prev.remaining <= 1) {
          clearInterval(timerRef.current!);
          // Notify via sound
          try { new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAA...").play(); } catch {}
          const next: TimerState = {
            mode:      prev.mode === "focus" ? (prev.round % 4 === 0 ? "long-break" : "short-break") : "focus",
            remaining: TIMER_DURATIONS[prev.mode === "focus" ? (prev.round % 4 === 0 ? "long-break" : "short-break") : "focus"],
            isRunning: false,
            round:     prev.mode === "focus" ? prev.round + 1 : prev.round,
          };
          if (isOwner) syncTimer(next);
          return next;
        }
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [timer.isRunning, timer.mode]);

  async function syncTimer(state: TimerState) {
    setTimer(state);
    channelRef.current?.send({ type: "broadcast", event: "timer", payload: state });
    await fetch(`/api/rooms/${code}/timer`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
  }

  function toggleTimer() {
    if (!isOwner) return;
    syncTimer({ ...timerState.current, isRunning: !timerState.current.isRunning });
  }

  function resetTimer() {
    if (!isOwner) return;
    syncTimer({ ...timerState.current, isRunning: false, remaining: TIMER_DURATIONS[timerState.current.mode] });
  }

  function switchTimerMode(mode: TimerState["mode"]) {
    if (!isOwner) return;
    syncTimer({ mode, remaining: TIMER_DURATIONS[mode], isRunning: false, round: timerState.current.round });
  }

  // ── Ambient audio ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    ambientRef.current?.stop();
    ambientRef.current = createAmbient(audioCtxRef.current, ambient);
    return () => { ambientRef.current?.stop(); };
  }, [ambient]);

  useEffect(() => {
    if (ambientRef.current) ambientRef.current.gain.gain.setTargetAtTime(ambientVol, audioCtxRef.current!.currentTime, 0.1);
  }, [ambientVol]);

  // ── WebRTC ─────────────────────────────────────────────────────────────────

  async function getMicStream() {
    if (localStream.current) return localStream.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStream.current = stream;
      return stream;
    } catch { return null; }
  }

  function closePeer(peerId: string) {
    peerConns.current.get(peerId)?.close();
    peerConns.current.delete(peerId);
    peerGains.current.delete(peerId);
  }

  function createPeerConn(peerId: string): RTCPeerConnection {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

    pc.onicecandidate = ({ candidate }) => {
      if (!candidate) return;
      channelRef.current?.send({ type: "broadcast", event: "rtc-ice", payload: { from: currentUser.id, to: peerId, candidate } });
    };

    pc.ontrack = ({ streams: [stream] }) => {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const src  = audioCtxRef.current.createMediaStreamSource(stream);
      const gain = audioCtxRef.current.createGain();
      gain.gain.value = peerVols[peerId] ?? 1;
      src.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      peerGains.current.set(peerId, gain);
    };

    peerConns.current.set(peerId, pc);
    return pc;
  }

  async function initiateCall(peerId: string) {
    const stream = await getMicStream();
    if (!stream) return;
    const pc = createPeerConn(peerId);
    stream.getTracks().forEach(t => pc.addTrack(t, stream));
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    channelRef.current?.send({ type: "broadcast", event: "rtc-offer", payload: { from: currentUser.id, to: peerId, sdp: offer } });
  }

  async function handleOffer({ from, to, sdp }: { from: string; to: string; sdp: RTCSessionDescriptionInit }) {
    if (to !== currentUser.id) return;
    const stream = await getMicStream();
    const pc = createPeerConn(from);
    if (stream) stream.getTracks().forEach(t => pc.addTrack(t, stream));
    await pc.setRemoteDescription(sdp);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    channelRef.current?.send({ type: "broadcast", event: "rtc-answer", payload: { from: currentUser.id, to: from, sdp: answer } });
  }

  async function handleAnswer({ from, to, sdp }: { from: string; to: string; sdp: RTCSessionDescriptionInit }) {
    if (to !== currentUser.id) return;
    await peerConns.current.get(from)?.setRemoteDescription(sdp);
  }

  async function handleIce({ from, to, candidate }: { from: string; to: string; candidate: RTCIceCandidateInit }) {
    if (to !== currentUser.id) return;
    await peerConns.current.get(from)?.addIceCandidate(candidate);
  }

  async function toggleMic() {
    if (isMicMuted) {
      // Unmute: request mic access + call all peers
      const stream = await getMicStream();
      if (!stream) return;
      setIsMicMuted(false);
      stream.getAudioTracks().forEach(t => (t.enabled = true));
      // Initiate calls with everyone not already connected
      for (const m of members) {
        if (m.user_id !== currentUser.id && !peerConns.current.has(m.user_id)) {
          initiateCall(m.user_id);
        }
      }
    } else {
      setIsMicMuted(true);
      localStream.current?.getAudioTracks().forEach(t => (t.enabled = false));
    }
  }

  // Adjust peer volume
  function setPeerVolume(peerId: string, vol: number) {
    setPeerVols(prev => ({ ...prev, [peerId]: vol }));
    const gain = peerGains.current.get(peerId);
    if (gain) gain.gain.setTargetAtTime(vol, audioCtxRef.current!.currentTime, 0.05);
  }

  function togglePeerMute(peerId: string) {
    const muted = !peerMutes[peerId];
    setPeerMutes(prev => ({ ...prev, [peerId]: muted }));
    setPeerVolume(peerId, muted ? 0 : (peerVols[peerId] ?? 1));
  }

  // ── Chat ───────────────────────────────────────────────────────────────────

  async function sendChat() {
    const content = chatInput.trim();
    if (!content) return;
    setChatInput("");
    const res = await fetch(`/api/rooms/${code}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      const { message } = await res.json();
      // Also broadcast for instant display
      channelRef.current?.send({ type: "broadcast", event: "chat", payload: message });
      setMessages(prev => [...prev, message]);
    }
  }

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // ── Reactions ─────────────────────────────────────────────────────────────

  function sendReaction(emoji: string) {
    channelRef.current?.send({
      type: "broadcast", event: "reaction",
      payload: { emoji, from: currentUser.username },
    });
    setReactions(prev => [...prev, { id: Math.random().toString(36).slice(2), emoji, from: currentUser.username }]);
    setTimeout(() => setReactions(p => p.filter((_, i) => i !== 0)), 3000);
  }

  // ── Status update ──────────────────────────────────────────────────────────

  async function updateStatus(status: typeof myStatus) {
    setMyStatus(status);
    await fetch(`/api/rooms/${code}/member`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, last_seen: new Date().toISOString() }),
    });
  }

  async function updateTask(task: string) {
    setMyTask(task);
    await fetch(`/api/rooms/${code}/member`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task }),
    });
  }

  // ── Leave ──────────────────────────────────────────────────────────────────

  async function leaveRoom() {
    channelRef.current?.send({ type: "broadcast", event: "rtc-leave", payload: { from: currentUser.id } });
    localStream.current?.getTracks().forEach(t => t.stop());
    ambientRef.current?.stop();
    await fetch(`/api/rooms/${code}/leave`, { method: "POST" });
    router.push("/room");
  }

  // ── Copy invite link ───────────────────────────────────────────────────────

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/room/${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Spotify poll (owner only) ──────────────────────────────────────────────

  useEffect(() => {
    if (!isOwner || !initialRoom.spotify_access_token) return;
    const poll = async () => {
      const res = await fetch("/api/spotify/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomCode: code }),
      });
      if (!res.ok) return;
      const { track: t } = await res.json();
      setTrack(t);
      channelRef.current?.send({ type: "broadcast", event: "track", payload: t });
    };
    poll();
    const id = setInterval(poll, 8000);
    return () => clearInterval(id);
  }, [isOwner, code]);

  // ── Merged member list (DB + presence) ────────────────────────────────────

  const allMembers = members.map(m => ({
    ...m,
    presenceData: presence.get(m.user_id),
  }));

  // ── Track progress bar ─────────────────────────────────────────────────────
  const [trackProgress, setTrackProgress] = useState(track?.progressMs ?? 0);
  useEffect(() => {
    if (!track?.isPlaying) return;
    setTrackProgress(track.progressMs);
    const id = setInterval(() => setTrackProgress(p => p + 500), 500);
    return () => clearInterval(id);
  }, [track?.trackUri, track?.isPlaying]);

  // ── Timer progress ─────────────────────────────────────────────────────────
  const timerMax   = TIMER_DURATIONS[timer.mode];
  const timerPct   = ((timerMax - timer.remaining) / timerMax) * 100;
  const timerColor = timer.mode === "focus" ? TEAL : timer.mode === "short-break" ? "#FCD34D" : "#A78BFA";

  // ── Status colours ─────────────────────────────────────────────────────────
  const STATUS_COLOR: Record<string, string> = { focusing: TEAL, break: "#FCD34D", away: MUTED };
  const STATUS_LABEL: Record<string, string> = { focusing: "Focusing", break: "On break", away: "Away" };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "inherit", color: "#fff" }}>

      {/* Floating reactions */}
      <div style={{ position: "fixed", top: 80, right: 24, zIndex: 100, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
        {reactions.map(r => (
          <div key={r.id} style={{
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
            padding: "8px 14px", fontSize: 22, display: "flex", alignItems: "center", gap: 8,
            animation: "fadeUp 3s ease forwards",
          }}>
            {r.emoji}
            <span style={{ fontSize: 13, color: MUTED }}>{r.from}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeUp { 0%{opacity:0;transform:translateY(8px)} 15%{opacity:1;transform:translateY(0)} 80%{opacity:1} 100%{opacity:0;transform:translateY(-12px)} }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(7,7,8,0.90)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${BORDER}`,
        padding: "12px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{initialRoom.name}</div>
            <div style={{ color: MUTED, fontSize: 12 }}>{presence.size || allMembers.length} in room</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {/* Invite */}
          <button onClick={copyLink} style={{
            padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700,
            background: TEAL_BG, border: `1px solid ${TEAL_BD}`, color: TEAL, cursor: "pointer",
          }}>
            {copied ? "✓ Copied!" : `🔗 ${code}`}
          </button>

          {/* Leave */}
          <button onClick={leaveRoom} style={{
            padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700,
            background: RED_BG, border: `1px solid ${RED_BD}`, color: "#F87171", cursor: "pointer",
          }}>
            Leave
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ── Timer ── */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: MUTED, letterSpacing: "0.08em" }}>
                  {timer.mode === "focus" ? "🎯 FOCUS" : timer.mode === "short-break" ? "☕ SHORT BREAK" : "🌙 LONG BREAK"}
                  <span style={{ marginLeft: 8, color: MUTED2 }}>Round {timer.round}</span>
                </div>
              </div>
              {/* Mode tabs */}
              {isOwner && (
                <div style={{ display: "flex", gap: 4 }}>
                  {(["focus","short-break","long-break"] as const).map(m => (
                    <button key={m} onClick={() => switchTimerMode(m)} style={{
                      padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                      background: timer.mode === m ? TEAL_BG : "transparent",
                      border: `1px solid ${timer.mode === m ? TEAL_BD : BORDER}`,
                      color: timer.mode === m ? TEAL : MUTED, cursor: "pointer",
                    }}>
                      {m === "focus" ? "Focus" : m === "short-break" ? "Short" : "Long"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Circular timer */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <div style={{ position: "relative", width: 180, height: 180 }}>
                <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="90" cy="90" r="80" fill="none" stroke={BORDER} strokeWidth="6" />
                  <circle cx="90" cy="90" r="80" fill="none"
                    stroke={timerColor} strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 80}`}
                    strokeDashoffset={`${2 * Math.PI * 80 * (1 - timerPct / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
                  />
                </svg>
                <div style={{
                  position: "absolute", inset: 0, display: "flex",
                  flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-0.02em", color: timer.isRunning ? "#fff" : MUTED }}>
                    {formatTime(timer.remaining)}
                  </div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                    {!isOwner ? "owner controls" : ""}
                  </div>
                </div>
              </div>

              {isOwner && (
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={toggleTimer} style={{
                    padding: "10px 28px", borderRadius: 10, fontSize: 15, fontWeight: 800,
                    background: timer.isRunning ? RED_BG : TEAL,
                    border: timer.isRunning ? `1px solid ${RED_BD}` : "none",
                    color: timer.isRunning ? "#F87171" : "#071610", cursor: "pointer",
                  }}>
                    {timer.isRunning ? "⏸ Pause" : "▶ Start"}
                  </button>
                  <button onClick={resetTimer} style={{
                    padding: "10px 16px", borderRadius: 10, fontSize: 15,
                    background: "transparent", border: `1px solid ${BORDER}`,
                    color: MUTED, cursor: "pointer",
                  }}>⟲</button>
                </div>
              )}
            </div>
          </div>

          {/* ── Music / Spotify ── */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: MUTED, letterSpacing: "0.08em", marginBottom: 16 }}>🎵 MUSIC</div>

            {track ? (
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                {track.albumArt && (
                  <img src={track.albumArt} alt="album" style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{track.name}</div>
                  <div style={{ color: MUTED, fontSize: 13, marginTop: 2 }}>{track.artist}</div>
                  {/* Progress */}
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: MUTED, width: 32, flexShrink: 0 }}>{formatTime(Math.floor(trackProgress / 1000))}</span>
                    <div style={{ flex: 1, height: 4, background: BORDER, borderRadius: 99 }}>
                      <div style={{ height: "100%", borderRadius: 99, background: TEAL, width: `${Math.min(100, (trackProgress / track.durationMs) * 100)}%`, transition: "width 0.5s linear" }} />
                    </div>
                    <span style={{ fontSize: 11, color: MUTED, width: 32, flexShrink: 0, textAlign: "right" }}>{formatTime(Math.floor(track.durationMs / 1000))}</span>
                  </div>
                  <a href={`https://open.spotify.com/track/${track.trackUri?.split(":")[2]}`}
                    target="_blank" rel="noreferrer"
                    style={{ display: "inline-block", marginTop: 8, fontSize: 12, color: "#1DB954", textDecoration: "none", fontWeight: 700 }}>
                    ▶ Open in Spotify
                  </a>
                </div>
              </div>
            ) : isOwner ? (
              <div>
                <p style={{ color: MUTED, fontSize: 14, margin: "0 0 12px" }}>
                  Connect Spotify to share what you&apos;re playing with the room.
                </p>
                <a href={`/api/spotify/connect?room=${code}`} style={{
                  display: "inline-block", padding: "9px 18px", borderRadius: 8,
                  background: "#1DB954", color: "#000", fontWeight: 700, fontSize: 14,
                  textDecoration: "none",
                }}>Connect Spotify</a>
              </div>
            ) : (
              <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>No music playing right now.</p>
            )}

            {/* Ambient sounds */}
            <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 10 }}>Ambient</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {(["off","white","brown","rain"] as AmbientMode[]).map(m => (
                  <button key={m} onClick={() => setAmbient(m)} style={{
                    padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                    background: ambient === m ? TEAL_BG : "transparent",
                    border: `1px solid ${ambient === m ? TEAL_BD : BORDER}`,
                    color: ambient === m ? TEAL : MUTED, cursor: "pointer",
                  }}>
                    {m === "off" ? "🔇 Off" : m === "white" ? "🌫 White" : m === "brown" ? "🤎 Brown" : "🌧 Rain"}
                  </button>
                ))}
              </div>
              {ambient !== "off" && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, color: MUTED, width: 40 }}>Vol</span>
                  <input type="range" min="0" max="0.5" step="0.01" value={ambientVol}
                    onChange={e => setAmbientVol(parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: TEAL, cursor: "pointer" }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Reactions ── */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "14px 18px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, letterSpacing: "0.08em", marginBottom: 10 }}>SEND A REACTION</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["⚡","💪","🔥","🎯","✅","😅"].map(e => (
                <button key={e} onClick={() => sendReaction(e)} style={{
                  fontSize: 22, padding: "6px 10px", borderRadius: 8,
                  background: "transparent", border: `1px solid ${BORDER}`,
                  cursor: "pointer", transition: "transform 0.1s",
                }}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* ── My status ── */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "18px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, letterSpacing: "0.08em", marginBottom: 12 }}>YOUR STATUS</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {(["focusing","break","away"] as const).map(s => (
                <button key={s} onClick={() => updateStatus(s)} style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                  background: myStatus === s ? `${STATUS_COLOR[s]}18` : "transparent",
                  border: `1px solid ${myStatus === s ? STATUS_COLOR[s] : BORDER}`,
                  color: myStatus === s ? STATUS_COLOR[s] : MUTED, cursor: "pointer",
                }}>
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
            <input
              placeholder="What are you working on?"
              value={myTask}
              onChange={e => setMyTask(e.target.value)}
              onBlur={() => updateTask(myTask)}
              onKeyDown={e => e.key === "Enter" && updateTask(myTask)}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14,
                background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`,
                color: "#fff", outline: "none", boxSizing: "border-box",
              }}
            />
            {/* Mic control */}
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={toggleMic} style={{
                padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                background: isMicMuted ? RED_BG : TEAL_BG,
                border: `1px solid ${isMicMuted ? RED_BD : TEAL_BD}`,
                color: isMicMuted ? "#F87171" : TEAL, cursor: "pointer",
              }}>
                {isMicMuted ? "🎤 Unmute mic" : "🎤 Mute mic"}
              </button>
              <span style={{ fontSize: 12, color: MUTED }}>Voice chat</span>
            </div>
          </div>

        </div>

        {/* ── Right column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Tab bar */}
          <div style={{ display: "flex", background: CARD, borderRadius: "16px 16px 0 0", border: `1px solid ${BORDER}`, borderBottom: "none" }}>
            {(["members","chat"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "12px", fontSize: 13, fontWeight: 700,
                background: "transparent", border: "none",
                borderBottom: tab === t ? `2px solid ${TEAL}` : "2px solid transparent",
                color: tab === t ? TEAL : MUTED, cursor: "pointer",
                textTransform: "capitalize",
              }}>
                {t === "members" ? `👥 Members (${allMembers.length})` : "💬 Chat"}
              </button>
            ))}
          </div>

          <div style={{
            background: CARD, border: `1px solid ${BORDER}`, borderTop: "none",
            borderRadius: "0 0 16px 16px", flex: 1,
            display: "flex", flexDirection: "column",
            maxHeight: "calc(100vh - 160px)", overflow: "hidden",
          }}>
            {/* Members tab */}
            {tab === "members" && (
              <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                {allMembers.map(m => {
                  const uname  = m.profile?.username ?? "Unknown";
                  const p      = m.presenceData;
                  const status = p?.status ?? m.status;
                  const task   = p?.task   ?? m.task;
                  const muted  = p?.isMuted ?? false;
                  const isMe   = m.user_id === currentUser.id;
                  const isRoomOwner = m.user_id === initialRoom.owner_id;

                  return (
                    <div key={m.user_id} style={{
                      background: CARD2, borderRadius: 12,
                      border: `1px solid ${isMe ? TEAL_BD : BORDER}`,
                      padding: "12px 14px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: task ? 8 : 0 }}>
                        <div style={{ position: "relative" }}>
                          <Avatar url={m.profile?.avatar_url ?? null} name={uname} size={36} />
                          <div style={{
                            position: "absolute", bottom: 0, right: 0,
                            width: 11, height: 11, borderRadius: "50%",
                            background: STATUS_COLOR[status] ?? MUTED,
                            border: `2px solid ${CARD2}`,
                          }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                            {uname}
                            {isRoomOwner && <span style={{ fontSize: 10, color: TEAL, background: TEAL_BG, borderRadius: 4, padding: "1px 5px" }}>HOST</span>}
                            {isMe && <span style={{ fontSize: 10, color: MUTED, background: BORDER, borderRadius: 4, padding: "1px 5px" }}>you</span>}
                          </div>
                          <div style={{ fontSize: 11, color: STATUS_COLOR[status] ?? MUTED }}>{STATUS_LABEL[status] ?? status}</div>
                        </div>
                        {muted && <span style={{ fontSize: 16 }} title="Muted">🔇</span>}
                      </div>
                      {task && (
                        <div style={{ fontSize: 12, color: MUTED, background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "5px 8px" }}>
                          {task}
                        </div>
                      )}
                      {/* Per-peer volume (not for self) */}
                      {!isMe && (
                        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                          <button onClick={() => togglePeerMute(m.user_id)} style={{
                            fontSize: 14, padding: "2px 6px", borderRadius: 4,
                            background: "transparent", border: `1px solid ${BORDER}`,
                            cursor: "pointer",
                          }}>
                            {peerMutes[m.user_id] ? "🔇" : "🔊"}
                          </button>
                          <input type="range" min="0" max="2" step="0.05"
                            value={peerMutes[m.user_id] ? 0 : (peerVols[m.user_id] ?? 1)}
                            onChange={e => setPeerVolume(m.user_id, parseFloat(e.target.value))}
                            style={{ flex: 1, accentColor: TEAL, cursor: "pointer" }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Chat tab */}
            {tab === "chat" && (
              <>
                <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {messages.length === 0 && (
                    <p style={{ color: MUTED2, fontSize: 13, textAlign: "center", marginTop: 24 }}>No messages yet. Say hi! 👋</p>
                  )}
                  {messages.map(msg => {
                    const isMe = msg.profile?.username === currentUser.username;
                    return (
                      <div key={msg.id} style={{ display: "flex", gap: 8, justifyContent: isMe ? "flex-end" : "flex-start" }}>
                        {!isMe && <Avatar url={msg.profile?.avatar_url ?? null} name={msg.profile?.username ?? "?"} size={28} />}
                        <div style={{
                          maxWidth: "76%", padding: "8px 12px", borderRadius: isMe ? "12px 12px 0 12px" : "12px 12px 12px 0",
                          background: isMe ? TEAL_BG : CARD2,
                          border: `1px solid ${isMe ? TEAL_BD : BORDER}`,
                        }}>
                          {!isMe && <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, marginBottom: 3 }}>{msg.profile?.username}</div>}
                          <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.4 }}>{msg.content}</div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>
                <div style={{ padding: "10px 12px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 8 }}>
                  <input
                    placeholder="Message…"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendChat()}
                    style={{
                      flex: 1, padding: "9px 12px", borderRadius: 8, fontSize: 14,
                      background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`,
                      color: "#fff", outline: "none",
                    }}
                  />
                  <button onClick={sendChat} style={{
                    padding: "9px 14px", borderRadius: 8, background: TEAL, border: "none",
                    color: "#071610", fontWeight: 800, cursor: "pointer", fontSize: 16,
                  }}>↑</button>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
