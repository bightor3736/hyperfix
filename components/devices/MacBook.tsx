"use client";
import React from "react";

interface MacBookProps {
  children?: React.ReactNode;
  className?: string;
  scale?: number;
}

export function MacBook({ children, className = "", scale = 1 }: MacBookProps) {
  const W = 760 * scale;
  const screenH = W * 0.625; // 16:10
  const baseH = 28 * scale;

  return (
    <div className={`relative select-none ${className}`} style={{ width: W, flexShrink: 0 }}>
      {/* Screen */}
      <div
        style={{
          width: W,
          height: screenH,
          borderRadius: `${14 * scale}px ${14 * scale}px ${4 * scale}px ${4 * scale}px`,
          background: "#1a1a1a",
          border: `${2 * scale}px solid #2c2c2e`,
          boxShadow: `0 ${40 * scale}px ${80 * scale}px rgba(0,0,0,0.5), 0 ${8 * scale}px ${24 * scale}px rgba(0,0,0,0.3)`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Menu bar */}
        <div
          style={{
            height: 28 * scale,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            padding: `0 ${12 * scale}px`,
            gap: 6 * scale,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ width: 10 * scale, height: 10 * scale, borderRadius: "50%", background: c }} />
          ))}
        </div>

        {/* Content */}
        <div style={{ width: "100%", height: `calc(100% - ${28 * scale}px)`, overflow: "hidden" }}>
          {children || (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg, #1c1c1e 0%, #0d0d0d 100%)" }} />
          )}
        </div>
      </div>

      {/* Hinge stripe */}
      <div
        style={{
          width: W,
          height: 4 * scale,
          background: "#141414",
          borderRadius: `0 0 ${2 * scale}px ${2 * scale}px`,
        }}
      />

      {/* Base */}
      <div
        style={{
          width: W * 1.08,
          marginLeft: `-${W * 0.04}px`,
          height: baseH,
          borderRadius: `0 0 ${10 * scale}px ${10 * scale}px`,
          background: "linear-gradient(180deg, #1e1e1e 0%, #141414 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 ${4 * scale}px ${16 * scale}px rgba(0,0,0,0.4)`,
        }}
      >
        {/* Touchpad hint */}
        <div style={{ width: 100 * scale, height: 12 * scale, borderRadius: 4 * scale, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
      </div>
    </div>
  );
}
