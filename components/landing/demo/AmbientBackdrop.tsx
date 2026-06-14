"use client";

// Warm coded backdrop for sections that sit on the cream paper.
// Soft coral + violet glows drifting on warm white. The global
// prefers-reduced-motion rule freezes the drift.
export function AmbientBackdrop({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background:
          "radial-gradient(120% 90% at 50% -10%, #FFFFFF 0%, #FBF7F1 55%, #F5EFE5 100%)",
        ...style,
      }}
    >
      <div
        className="demo-glow demo-glow-a"
        style={{
          position: "absolute",
          width: "62vw",
          height: "62vw",
          left: "6%",
          top: "-14%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,90,54,0.16) 0%, transparent 62%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="demo-glow demo-glow-b"
        style={{
          position: "absolute",
          width: "55vw",
          height: "55vw",
          right: "2%",
          bottom: "-20%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(109,90,230,0.12) 0%, transparent 62%)",
          filter: "blur(50px)",
        }}
      />
      {/* faint warm grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(24,20,16,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(24,20,16,0.03) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          maskImage:
            "radial-gradient(120% 80% at 50% 0%, #000 0%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(120% 80% at 50% 0%, #000 0%, transparent 72%)",
        }}
      />
    </div>
  );
}
