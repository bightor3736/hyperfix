import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { loadInterFont } from "./font";

loadInterFont();

const FF = "Inter, 'Helvetica Neue', Arial, sans-serif";
const BG = "#080808";
const INK = "#F4F4F4";
const DIM = "rgba(244,244,244,0.38)";
const TEAL = "#5EEAD4";
const TEAL_DARK = "#0D9488";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const slideIn = (frame: number, delay = 0) => {
  const t = interpolate(frame - delay, [0, 16], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
  });
  return { opacity: t, transform: `translateX(${(1 - t) * -40}px)` };
};

const signs = [
  "you opened 20 tabs in the last hour",
  "you've explained it to someone who didn't ask",
  "you stayed up past 2am doing research",
  "you bought something for it already",
  "you feel weirdly emotional about it",
  "your search history is all one topic",
  "you keep thinking about it mid-conversation",
];

// 360f = 12s
// 0-30: header
// 30+ : signs appear every 40f

export const Signs: React.FC = () => {
  const frame = useCurrentFrame();

  const headerT = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
  });
  const subT = interpolate(frame, [14, 28], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
  });

  const visibleSigns = signs.filter((_, i) => frame >= 38 + i * 40);

  return (
    <AbsoluteFill style={{ background: BG, display: "flex", flexDirection: "column", fontFamily: FF, padding: "100px 80px" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(94,234,212,0.08) 0%, transparent 55%)" }} />

      {/* header */}
      <div style={{ display: "flex", flexDirection: "column", marginBottom: 60 }}>
        <span style={{
          fontSize: 22, fontWeight: 700, letterSpacing: "0.22em",
          textTransform: "uppercase", color: TEAL,
          opacity: headerT, marginBottom: 16,
        }}>
          signs you're in one
        </span>
        <span style={{
          fontSize: 72, fontWeight: 900, letterSpacing: -4, lineHeight: 0.9, color: INK,
          opacity: subT, transform: `translateY(${(1 - subT) * 20}px)`,
        }}>
          you're hyperfixating.
        </span>
      </div>

      {/* signs list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
        {signs.map((sign, i) => {
          if (frame < 38 + i * 40) return null;
          const st = slideIn(frame, 38 + i * 40);
          const isLast = i === signs.length - 1;

          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 24,
              opacity: st.opacity,
              transform: st.transform,
            }}>
              <div style={{
                display: "flex", width: 44, height: 44, borderRadius: 22,
                background: isLast ? TEAL : "rgba(94,234,212,0.1)",
                border: `1px solid ${isLast ? "transparent" : "rgba(94,234,212,0.2)"}`,
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: isLast ? BG : TEAL }}>{i + 1}</span>
              </div>
              <span style={{
                fontSize: 34, fontWeight: isLast ? 700 : 600,
                color: isLast ? INK : DIM,
                letterSpacing: -0.5, lineHeight: 1.2,
              }}>
                {sign}
              </span>
            </div>
          );
        })}
      </div>

      {/* footer cta */}
      {frame >= 340 && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: interpolate(frame, [340, 356], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }),
        }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: TEAL, letterSpacing: -0.5 }}>
            tag someone who relates
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
