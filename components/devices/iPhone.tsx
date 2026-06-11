import React from "react";

interface iPhoneProps {
  children?: React.ReactNode;
  className?: string;
  scale?: number;
  color?: "black" | "silver";
}

export function iPhone({ children, className = "", scale = 1, color = "black" }: iPhoneProps) {
  const chassis = color === "black" ? "#1a1a1a" : "#e8e8ed";
  const edge = color === "black" ? "#2a2a2a" : "#d1d1d6";
  const btnColor = color === "black" ? "#2c2c2e" : "#c7c7cc";

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        width: 280 * scale,
        height: 560 * scale,
        flexShrink: 0,
      }}
    >
      {/* Body */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 50 * scale,
          background: chassis,
          border: `${2 * scale}px solid ${edge}`,
          boxShadow: `0 ${40 * scale}px ${100 * scale}px rgba(0,0,0,0.60), 0 ${16 * scale}px ${40 * scale}px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      />

      {/* Volume buttons - left side */}
      {[-80, -40, -20].map((top, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: -4 * scale,
            top: `calc(50% + ${(top - 20) * scale}px)`,
            width: 4 * scale,
            height: (i === 0 ? 28 : 36) * scale,
            borderRadius: `${2 * scale}px 0 0 ${2 * scale}px`,
            background: btnColor,
          }}
        />
      ))}

      {/* Power button - right side */}
      <div
        style={{
          position: "absolute",
          right: -4 * scale,
          top: `calc(50% - ${20 * scale}px)`,
          width: 4 * scale,
          height: 60 * scale,
          borderRadius: `0 ${2 * scale}px ${2 * scale}px 0`,
          background: btnColor,
        }}
      />

      {/* Screen area */}
      <div
        style={{
          position: "absolute",
          top: 10 * scale,
          left: 10 * scale,
          right: 10 * scale,
          bottom: 10 * scale,
          borderRadius: 42 * scale,
          overflow: "hidden",
          background: "#000",
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: 12 * scale,
            left: "50%",
            transform: "translateX(-50%)",
            width: 90 * scale,
            height: 26 * scale,
            borderRadius: 20 * scale,
            background: "#000",
            zIndex: 10,
            border: "1.5px solid rgba(255,255,255,0.06)",
          }}
        />

        {/* Screen content */}
        <div style={{ width: "100%", height: "100%", overflowY: "auto", scrollbarWidth: "none" }}>
          {children || (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg, #1c1c1e 0%, #000 100%)" }} />
          )}
        </div>
      </div>
    </div>
  );
}
