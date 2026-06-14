"use client";

// A lightweight coded backdrop for sections where text overlays the visual
// (hero, final CTA). No video, no external media — just soft drifting glows
// on black. The global prefers-reduced-motion rule freezes the drift.
export function AmbientBackdrop({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background:
          "radial-gradient(120% 90% at 50% -10%, #161616 0%, #050505 55%, #000 100%)",
        ...style,
      }}
    >
      <div
        className="demo-glow demo-glow-a"
        style={{
          position: "absolute",
          width: "60vw",
          height: "60vw",
          left: "8%",
          top: "-12%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="demo-glow demo-glow-b"
        style={{
          position: "absolute",
          width: "55vw",
          height: "55vw",
          right: "4%",
          bottom: "-18%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />
      {/* fine grid for subtle texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(120% 80% at 50% 0%, #000 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(120% 80% at 50% 0%, #000 0%, transparent 75%)",
        }}
      />
    </div>
  );
}
