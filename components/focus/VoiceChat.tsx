"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mic, MicOff, Headphones, PhoneOff, Loader2 } from "lucide-react";
import type { RealtimeChannel } from "@supabase/supabase-js";

// Peer-to-peer voice for body-doubling rooms. Uses a Supabase Realtime channel
// purely as the signalling transport (broadcast of SDP offers/answers + ICE
// candidates) and builds a WebRTC mesh between participants.
//
// NOTE: This uses public STUN only. It will connect on most home/office
// networks, but symmetric-NAT / strict-firewall users need a TURN server for
// reliable connectivity — add one to ICE_SERVERS in production.

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

type SignalPayload =
  | { type: "offer"; from: string; to: string; sdp: RTCSessionDescriptionInit }
  | { type: "answer"; from: string; to: string; sdp: RTCSessionDescriptionInit }
  | { type: "ice"; from: string; to: string; candidate: RTCIceCandidateInit }
  | { type: "hello"; from: string }
  | { type: "bye"; from: string };

export function VoiceChat({ roomCode, me, name }: { roomCode: string; me: string; name: string }) {
  const [joined, setJoined] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [muted, setMuted] = useState(false);
  const [peerCount, setPeerCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const peers = useRef<Map<string, RTCPeerConnection>>(new Map());
  const audioEls = useRef<Map<string, HTMLAudioElement>>(new Map());

  const updateCount = useCallback(() => setPeerCount(peers.current.size), []);

  const cleanupPeer = useCallback((id: string) => {
    peers.current.get(id)?.close();
    peers.current.delete(id);
    const el = audioEls.current.get(id);
    if (el) { el.srcObject = null; el.remove(); audioEls.current.delete(id); }
    updateCount();
  }, [updateCount]);

  const send = useCallback((payload: SignalPayload) => {
    channelRef.current?.send({ type: "broadcast", event: "signal", payload });
  }, []);

  // Build (or reuse) a peer connection to a given participant.
  const createPeer = useCallback((peerId: string, polite: boolean) => {
    let pc = peers.current.get(peerId);
    if (pc) return pc;

    pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    peers.current.set(peerId, pc);
    updateCount();

    localStream.current?.getTracks().forEach((track) => pc!.addTrack(track, localStream.current!));

    pc.onicecandidate = (e) => {
      if (e.candidate) send({ type: "ice", from: me, to: peerId, candidate: e.candidate.toJSON() });
    };
    pc.ontrack = (e) => {
      let el = audioEls.current.get(peerId);
      if (!el) {
        el = document.createElement("audio");
        el.autoplay = true;
        audioEls.current.set(peerId, el);
        document.body.appendChild(el);
      }
      el.srcObject = e.streams[0];
    };
    pc.onconnectionstatechange = () => {
      if (pc!.connectionState === "failed" || pc!.connectionState === "closed") cleanupPeer(peerId);
    };

    // The "polite" peer initiates the offer to avoid glare.
    if (polite) {
      pc.onnegotiationneeded = async () => {
        try {
          const offer = await pc!.createOffer();
          await pc!.setLocalDescription(offer);
          send({ type: "offer", from: me, to: peerId, sdp: offer });
        } catch { /* ignore */ }
      };
    }
    return pc;
  }, [me, send, cleanupPeer, updateCount]);

  const handleSignal = useCallback(async (payload: SignalPayload) => {
    if (!("from" in payload) || payload.from === me) return;
    if ("to" in payload && payload.to !== me) return;

    if (payload.type === "hello") {
      // New participant announced — the lower id initiates to keep it deterministic.
      const polite = me < payload.from;
      createPeer(payload.from, polite);
      return;
    }
    if (payload.type === "bye") { cleanupPeer(payload.from); return; }

    const pc = createPeer(payload.from, false);
    try {
      if (payload.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        send({ type: "answer", from: me, to: payload.from, sdp: answer });
      } else if (payload.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      } else if (payload.type === "ice") {
        await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
      }
    } catch { /* ignore transient signalling races */ }
  }, [me, createPeer, cleanupPeer, send]);

  const leave = useCallback(() => {
    send({ type: "bye", from: me });
    peers.current.forEach((_, id) => cleanupPeer(id));
    localStream.current?.getTracks().forEach((t) => t.stop());
    localStream.current = null;
    if (channelRef.current) { createClient().removeChannel(channelRef.current); channelRef.current = null; }
    setJoined(false);
    setPeerCount(0);
  }, [me, send, cleanupPeer]);

  async function join() {
    if (connecting || joined) return;
    setConnecting(true);
    setError(null);
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const supabase = createClient();
      const channel = supabase.channel(`voice:${roomCode}`, { config: { broadcast: { self: false } } });
      channel.on("broadcast", { event: "signal" }, ({ payload }) => handleSignal(payload as SignalPayload));
      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          send({ type: "hello", from: me });
        }
      });
      channelRef.current = channel;
      setJoined(true);
    } catch {
      setError("Mic access denied. Check your browser permissions.");
    } finally {
      setConnecting(false);
    }
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    localStream.current?.getAudioTracks().forEach((t) => { t.enabled = !next; });
  }

  // Clean up on unmount.
  useEffect(() => () => { if (joined) leave(); }, [joined, leave]);

  return (
    <div className="rounded-2xl p-4 mb-5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
      <div className="flex items-center justify-between mb-1">
        <p className="font-mono text-[10px] uppercase tracking-widest inline-flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
          <Headphones size={12} strokeWidth={2} /> Voice
        </p>
        {joined && (
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#5eead4" }}>
            live · {peerCount} connected
          </span>
        )}
      </div>

      {error && <p className="font-sans text-[12px] mb-2" style={{ color: "#fca5a5" }}>{error}</p>}

      {!joined ? (
        <>
          <p className="font-sans text-[12px] mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
            Hop on the mic to body-double out loud. {name ? "" : ""}
          </p>
          <button
            onClick={join}
            disabled={connecting}
            className="press-pop w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-sans text-[14px] font-bold transition-all disabled:opacity-60"
            style={{ background: "#5eead4", color: "#0f0d40" }}
          >
            {connecting ? <Loader2 size={16} className="animate-spin" /> : <Mic size={16} strokeWidth={2.5} />}
            {connecting ? "Connecting…" : "Join voice"}
          </button>
        </>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={toggleMute}
            className="press-pop flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-sans text-[13px] font-semibold transition-all"
            style={{
              background: muted ? "rgba(248,113,113,0.18)" : "rgba(255,255,255,0.10)",
              color: muted ? "#fca5a5" : "#fff",
              border: `1px solid ${muted ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.14)"}`,
            }}
          >
            {muted ? <MicOff size={15} strokeWidth={2} /> : <Mic size={15} strokeWidth={2} />}
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            onClick={leave}
            className="press-pop flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-sans text-[13px] font-semibold transition-all"
            style={{ background: "rgba(248,113,113,0.18)", color: "#fca5a5", border: "1px solid rgba(248,113,113,0.3)" }}
          >
            <PhoneOff size={15} strokeWidth={2} /> Leave
          </button>
        </div>
      )}
    </div>
  );
}
