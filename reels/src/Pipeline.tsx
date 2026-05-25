import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadInterFont } from "./font";

loadInterFont();

const FF = "Inter, 'Helvetica Neue', Arial, sans-serif";
const BG = "#080808";
const INK = "#F4F4F4";
const DIM = "rgba(244,244,244,0.35)";
const TEAL = "#5EEAD4";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const pop = (frame: number, delay = 0) => {
  const t = interpolate(frame - delay, [0, 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
  });
  const scale = interpolate(t, [0, 1], [0.82, 1]);
  return { opacity: t, transform: `scale(${scale})` };
};

const slideUp = (frame: number, delay = 0) => {
  const t = interpolate(frame - delay, [0, 14], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
  });
  return { opacity: t, transform: `translateY(${(1 - t) * 28}px)` };
};

// 270 frames = 9s @ 30fps
// Beat: new text every ~18-22 frames

export const Pipeline: React.FC = () => {
  const frame = useCurrentFrame();

  const steps = [
    { f: 0,   text: "discover something.", color: INK, size: 88 },
    { f: 22,  text: "research for 6 hours.", color: INK, size: 88 },
    { f: 44,  text: "tell everyone.", color: INK, size: 88 },
    { f: 62,  text: "cancel plans for it.", color: TEAL, size: 88 },
    { f: 82,  text: "feel electric.", color: TEAL, size: 88 },
    { f: 102, text: "then one day.", color: INK, size: 80 },
    { f: 118, text: "nothing.", color: DIM, size: 104 },
    { f: 138, text: "completely gone.", color: DIM, size: 80 },
    { f: 160, text: "and you can't even", color: INK, size: 76 },
    { f: 176, text: "remember the name.", color: INK, size: 76 },
    { f: 200, text: "every time.", color: TEAL, size: 104 },
    { f: 228, text: "comment yours", color: INK, size: 72 },
    { f: 244, text: "below.", color: TEAL, size: 104 },
  ];

  // find which step is currently active
  const active = [...steps].reverse().find(s => frame >= s.f);
  const prev = active ? steps[steps.indexOf(active) - 1] : null;

  const glowPulse = interpolate(frame, [0, 270], [0.5, 1.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FF }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(94,234,212,0.07) 0%, transparent 65%)" }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", padding: "0 80px" }}>
        {steps.map((step, i) => {
          if (frame < step.f) return null;
          const isActive = step === active;
          const isPrev = step === prev;
          if (!isActive && !isPrev) return null;

          const elapsed = frame - step.f;
          const fadeOut = isPrev
            ? interpolate(elapsed < 0 ? 0 : frame - (active?.f ?? 0), [0, 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 1;

          const st = pop(frame, step.f);

          return (
            <div key={i} style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: st.opacity * fadeOut,
              transform: st.transform,
            }}>
              <span style={{
                fontSize: step.size,
                fontWeight: 900,
                color: step.color,
                letterSpacing: -4,
                lineHeight: 1,
                textAlign: "center",
              }}>
                {step.text}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
