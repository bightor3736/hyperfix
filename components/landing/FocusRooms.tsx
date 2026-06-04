"use client";

import { Users, Video, Mic, Music, Brain } from "lucide-react";
import { Reveal } from "./Reveal";

// Authentic-looking dark room mock that mirrors the real /dashboard/rooms UI —
// shared timer, webcam tiles, live voice, and Spotify now-playing.

const TILES = [
  { name: "maya", initial: "M", cam: true, tint: "linear-gradient(135deg, #6d5bd0, #3b2f7a)", muted: false },
  { name: "theo", initial: "T", cam: true, tint: "linear-gradient(135deg, #2f6f6a, #1c3b3a)", muted: true },
  { name: "elise", initial: "E", cam: false, tint: "", muted: false },
  { name: "you", initial: "Y", cam: false, tint: "", muted: false },
];

export function FocusRooms() {
  return (
    <section id="rooms" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10 py-20 sm:py-28">
        <Reveal>
          <div className="max-w-[640px] mb-12">
            <span className="inline-block rounded-full px-4 py-1.5 mb-5 font-mono text-[11px] uppercase tracking-widest text-ink-muted" style={{ border: "1px solid var(--line)" }}>
              Focus rooms · body doubling
            </span>
            <h2 className="font-display leading-[1.05] tracking-tight text-ink" style={{ fontSize: "clamp(32px,5vw,52px)" }}>
              You focus better when you&apos;re <span className="text-game-gradient">not alone.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-[1.6] text-ink-muted">
              Drop into a focus room and work alongside people who get it. One shared timer keeps
              everyone on the same Pomodoro. Turn on your <strong className="text-ink">mic</strong> or
              <strong className="text-ink"> webcam</strong> to body-double for real — or just sit in
              silence together with the same playlist going.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5">
              {[
                { icon: Users, label: "Shared Pomodoro timer" },
                { icon: Video, label: "Live voice + webcam" },
                { icon: Music, label: "Synced Spotify" },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-2 text-[14px] text-ink-muted">
                  <Icon size={15} strokeWidth={2} style={{ color: "var(--accent)" }} />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Room mock */}
        <Reveal delay={100}>
          <div
            className="relative overflow-hidden rounded-[var(--radius-xl)] mx-auto max-w-[760px] p-6 sm:p-8"
            style={{
              background: [
                "radial-gradient(ellipse 80% 100% at 50% 120%, rgba(139,92,246,0.30) 0%, transparent 60%)",
                "linear-gradient(160deg, #1e1880 0%, #0f0d40 100%)",
              ].join(", "),
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 32px 80px -24px rgba(15,13,64,0.6)",
            }}
          >
            {/* header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-sans text-[18px] font-bold" style={{ color: "#fff", letterSpacing: "-0.02em" }}>Deep Work</h3>
                <p className="font-mono text-[11px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(167,139,250,0.85)" }}>4 here</p>
              </div>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest" style={{ color: "#5eead4" }}>
                <span className="h-2 w-2 rounded-full anim-pulseDot" style={{ background: "#5eead4" }} /> live
              </span>
            </div>

            {/* shared timer */}
            <div className="flex flex-col items-center mb-6">
              <span className="tabular-nums" style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", fontWeight: 700, fontSize: 52, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>24:13</span>
              <p className="font-mono text-[10px] uppercase tracking-widest mt-2 inline-flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                <Brain size={11} strokeWidth={2} /> Deep work · everyone in sync
              </p>
              <div className="h-1.5 w-48 rounded-full overflow-hidden mt-3" style={{ background: "rgba(255,255,255,0.12)" }}>
                <div className="h-full rounded-full" style={{ width: "52%", background: "linear-gradient(90deg, #6366f1, #a855f7)" }} />
              </div>
            </div>

            {/* video tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
              {TILES.map((t) => (
                <div key={t.name} className="relative rounded-xl overflow-hidden aspect-video" style={{ background: t.cam ? t.tint : "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  {!t.cam && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold" style={{ background: "rgba(255,255,255,0.12)", color: "#a78bfa" }}>{t.initial}</div>
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1.5 font-sans text-[10px] font-semibold" style={{ color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}>{t.name}</span>
                  <span className="absolute bottom-1 right-1.5" style={{ color: t.muted ? "rgba(255,255,255,0.45)" : "#5eead4" }}>
                    <Mic size={11} strokeWidth={2} />
                  </span>
                </div>
              ))}
            </div>

            {/* now playing */}
            <div className="flex items-center gap-3 rounded-xl px-3.5 py-2.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
              <span className="flex h-8 w-8 items-center justify-center rounded-md shrink-0" style={{ background: "#1DB954" }}>
                <Music size={15} strokeWidth={2.5} style={{ color: "#000" }} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-[12px] font-semibold truncate" style={{ color: "#fff" }}>lofi beats to focus / study to</p>
                <p className="font-mono text-[10px] truncate" style={{ color: "rgba(255,255,255,0.5)" }}>now playing for everyone</p>
              </div>
              <div className="flex items-end gap-0.5 h-4">
                {[0.5, 0.9, 0.4, 0.7].map((h, i) => (
                  <span key={i} className="w-1 rounded-full anim-pulseDot" style={{ height: `${h * 100}%`, background: "#5eead4", animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
