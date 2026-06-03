"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mic, MicOff, Video, VideoOff, Headphones, PhoneOff, Loader2 } from "lucide-react";
import type { RealtimeChannel } from "@supabase/supabase-js";

// Peer-to-peer voice + webcam for body-doubling rooms. Uses a Supabase Realtime
// channel purely as the signalling transport (broadcast of SDP offers/answers +
// ICE candidates) and builds a WebRTC mesh between participants.
//
// Camera can be toggled on/off at any point mid-call — handled by the "perfect
// negotiation" pattern below, which tolerates simultaneous renegotiation from
// both sides without offer glare.
//
// NOTE: public STUN only. Connects on most home/office networks, but
// symmetric-NAT / strict-firewall users need a TURN server for reliable
// connectivity — add one to ICE_SERVERS in production.

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

interface MemberLite {
  user_id: string;
  profiles: { display_name: string | null; username: string | null; avatar_url: string | null } | null;
}

// Per-peer negotiation bookkeeping for the perfect-negotiation algorithm.
interface PeerState {
  pc: RTCPeerConnection;
  polite: boolean;
  makingOffer: boolean;
  ignoreOffer: boolean;
}

export function VoiceChat({
  roomCode,
  me,
  name,
  members = [],
}: {
  roomCode: string;
  me: string;
  name: string;
  members?: MemberLite[];
}) {
  const [joined, setJoined] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [muted, setMuted] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // peerId -> remote MediaStream (drives the video/audio tiles).
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());

  const channelRef = useRef<RealtimeChannel | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const localVideoEl = useRef<HTMLVideoElement | null>(null);
  const peers = useRef<Map<string, PeerState>>(new Map());

  const send = useCallback((payload: SignalPayload) => {
    channelRef.current?.send({ type: "broadcast", event: "signal", payload });
  }, []);

  const setRemote = useCallback((id: string, stream: MediaStream | null) => {
    setRemoteStreams((prev) => {
      const next = new Map(prev);
      if (stream) next.set(id, stream);
      else next.delete(id);
      return next;
    });
  }, []);

  const cleanupPeer = useCallback((id: string) => {
    peers.current.get(id)?.pc.close();
    peers.current.delete(id);
    setRemote(id, null);
  }, [setRemote]);

  // Build (or reuse) a peer connection using the perfect-negotiation pattern.
  const createPeer = useCallback((peerId: string): PeerState => {
    const existing = peers.current.get(peerId);
    if (existing) return existing;

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    // Deterministic role so the two sides agree who yields on glare.
    const state: PeerState = { pc, polite: me < peerId, makingOffer: false, ignoreOffer: false };
    peers.current.set(peerId, state);

    localStream.current?.getTracks().forEach((track) => pc.addTrack(track, localStream.current!));

    pc.onicecandidate = (e) => {
      if (e.candidate) send({ type: "ice", from: me, to: peerId, candidate: e.candidate.toJSON() });
    };
    pc.ontrack = (e) => {
      setRemote(peerId, e.streams[0] ?? null);
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" || pc.connectionState === "closed") cleanupPeer(peerId);
    };
    pc.onnegotiationneeded = async () => {
      try {
        state.makingOffer = true;
        await pc.setLocalDescription();
        send({ type: "offer", from: me, to: peerId, sdp: pc.localDescription!.toJSON() });
      } catch { /* ignore */ } finally {
        state.makingOffer = false;
      }
    };
    return state;
  }, [me, send, cleanupPeer, setRemote]);

  const handleSignal = useCallback(async (payload: SignalPayload) => {
    if (!("from" in payload) || payload.from === me) return;
    if ("to" in payload && payload.to !== me) return;

    if (payload.type === "hello") { createPeer(payload.from); return; }
    if (payload.type === "bye") { cleanupPeer(payload.from); return; }

    const state = createPeer(payload.from);
    const { pc } = state;
    try {
      if (payload.type === "offer" || payload.type === "answer") {
        const description = payload.sdp;
        const offerCollision = description.type === "offer" && (state.makingOffer || pc.signalingState !== "stable");
        state.ignoreOffer = !state.polite && offerCollision;
        if (state.ignoreOffer) return;

        await pc.setRemoteDescription(new RTCSessionDescription(description));
        if (description.type === "offer") {
          await pc.setLocalDescription();
          send({ type: "answer", from: me, to: payload.from, sdp: pc.localDescription!.toJSON() });
        }
      } else if (payload.type === "ice") {
        try { await pc.addIceCandidate(new RTCIceCandidate(payload.candidate)); }
        catch (err) { if (!state.ignoreOffer) throw err; }
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
    setCamOn(false);
    setMuted(false);
    setRemoteStreams(new Map());
  }, [me, send, cleanupPeer]);

  async function join(withVideo: boolean) {
    if (connecting || joined) return;
    setConnecting(true);
    setError(null);
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: withVideo });
      setCamOn(withVideo);
      const supabase = createClient();
      const channel = supabase.channel(`voice:${roomCode}`, { config: { broadcast: { self: false } } });
      channel.on("broadcast", { event: "signal" }, ({ payload }) => handleSignal(payload as SignalPayload));
      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") send({ type: "hello", from: me });
      });
      channelRef.current = channel;
      setJoined(true);
    } catch {
      setError(withVideo ? "Camera/mic access denied. Check your browser permissions." : "Mic access denied. Check your browser permissions.");
    } finally {
      setConnecting(false);
    }
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    localStream.current?.getAudioTracks().forEach((t) => { t.enabled = !next; });
  }

  // Turn the camera on/off mid-call. Adding a track triggers renegotiation on
  // every peer (handled by onnegotiationneeded + perfect negotiation).
  async function toggleCamera() {
    if (!localStream.current) return;
    if (camOn) {
      localStream.current.getVideoTracks().forEach((t) => { t.stop(); localStream.current!.removeTrack(t); });
      peers.current.forEach(({ pc }) => {
        pc.getSenders().filter((s) => s.track?.kind === "video").forEach((s) => pc.removeTrack(s));
      });
      setCamOn(false);
    } else {
      try {
        const cam = await navigator.mediaDevices.getUserMedia({ video: true });
        const track = cam.getVideoTracks()[0];
        if (!track) return;
        localStream.current.addTrack(track);
        peers.current.forEach(({ pc }) => pc.addTrack(track, localStream.current!));
        setCamOn(true);
      } catch {
        setError("Couldn't start the camera.");
      }
    }
  }

  // Keep the local self-view wired to the local stream.
  useEffect(() => {
    if (localVideoEl.current && localStream.current) {
      localVideoEl.current.srcObject = localStream.current;
    }
  }, [camOn, joined]);

  // Clean up on unmount.
  useEffect(() => () => { if (joined) leave(); }, [joined, leave]);

  const nameFor = (id: string) => {
    const p = members.find((m) => m.user_id === id)?.profiles;
    return p?.display_name || p?.username || "Someone";
  };
  const avatarFor = (id: string) => members.find((m) => m.user_id === id)?.profiles?.avatar_url ?? null;

  const tiles = Array.from(remoteStreams.entries());
  const showStage = joined && (camOn || tiles.some(([, s]) => s.getVideoTracks().length > 0));

  return (
    <div className="rounded-2xl p-4 mb-5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
      <div className="flex items-center justify-between mb-1">
        <p className="font-mono text-[10px] uppercase tracking-widest inline-flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
          <Headphones size={12} strokeWidth={2} /> Voice &amp; video
        </p>
        {joined && (
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#5eead4" }}>
            live · {peers.current.size} connected
          </span>
        )}
      </div>

      {error && <p className="font-sans text-[12px] mb-2" style={{ color: "#fca5a5" }}>{error}</p>}

      {/* Video stage */}
      {showStage && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-3">
          {/* Self */}
          <VideoTile
            stream={localStream.current}
            self
            videoRef={localVideoEl}
            label={`${name || "You"} (you)`}
            avatar={avatarFor(me)}
            showVideo={camOn}
          />
          {tiles.map(([id, stream]) => (
            <VideoTile
              key={id}
              stream={stream}
              label={nameFor(id)}
              avatar={avatarFor(id)}
              showVideo={stream.getVideoTracks().length > 0}
            />
          ))}
        </div>
      )}

      {!joined ? (
        <>
          <p className="font-sans text-[12px] mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
            Body-double out loud, or turn on your camera to work side by side.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => join(false)}
              disabled={connecting}
              className="press-pop flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-sans text-[14px] font-bold transition-all disabled:opacity-60"
              style={{ background: "#5eead4", color: "#0f0d40" }}
            >
              {connecting ? <Loader2 size={16} className="animate-spin" /> : <Mic size={16} strokeWidth={2.5} />}
              {connecting ? "Connecting…" : "Join voice"}
            </button>
            <button
              onClick={() => join(true)}
              disabled={connecting}
              className="press-pop flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-sans text-[14px] font-bold transition-all disabled:opacity-60"
              style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "1px solid rgba(255,255,255,0.14)" }}
            >
              <Video size={16} strokeWidth={2.5} /> Camera
            </button>
          </div>
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
            onClick={toggleCamera}
            className="press-pop flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-sans text-[13px] font-semibold transition-all"
            style={{
              background: camOn ? "rgba(94,234,212,0.16)" : "rgba(255,255,255,0.10)",
              color: camOn ? "#5eead4" : "#fff",
              border: `1px solid ${camOn ? "rgba(94,234,212,0.3)" : "rgba(255,255,255,0.14)"}`,
            }}
          >
            {camOn ? <Video size={15} strokeWidth={2} /> : <VideoOff size={15} strokeWidth={2} />}
            {camOn ? "Camera on" : "Camera"}
          </button>
          <button
            onClick={leave}
            className="press-pop flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-sans text-[13px] font-semibold transition-all"
            style={{ background: "rgba(248,113,113,0.18)", color: "#fca5a5", border: "1px solid rgba(248,113,113,0.3)" }}
          >
            <PhoneOff size={15} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

function VideoTile({
  stream,
  label,
  avatar,
  showVideo,
  self = false,
  videoRef,
}: {
  stream: MediaStream | null;
  label: string;
  avatar: string | null;
  showVideo: boolean;
  self?: boolean;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}) {
  const innerRef = useRef<HTMLVideoElement | null>(null);
  const ref = videoRef ?? innerRef;

  useEffect(() => {
    if (ref.current && stream) ref.current.srcObject = stream;
  }, [ref, stream, showVideo]);

  return (
    <div className="relative rounded-xl overflow-hidden aspect-video" style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.10)" }}>
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={self}
        className="w-full h-full object-cover"
        style={{ display: showVideo ? "block" : "none", transform: self ? "scaleX(-1)" : undefined }}
      />
      {!showVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-[16px] font-bold overflow-hidden" style={{ background: "rgba(255,255,255,0.10)", color: "#a78bfa" }}>
            {avatar
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={avatar} alt={label} className="w-full h-full object-cover" />
              : label[0]?.toUpperCase()}
          </div>
        </div>
      )}
      <span className="absolute bottom-1 left-1.5 right-1.5 truncate font-sans text-[10px] font-semibold" style={{ color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}>
        {label}
      </span>
    </div>
  );
}
