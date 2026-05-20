"use client";

import React from "react";

export type MascotExpression =
  | "excited"
  | "obsessed"
  | "anxious"
  | "calm"
  | "sad"
  | "neutral"
  | "send-help";

interface MascotProps {
  expression?: MascotExpression;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Mascot({
  expression = "neutral",
  size = 120,
  color = "#A855F7",
  className = "",
  style,
}: MascotProps) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.38;

  // Blob path (organic shape centered at cx, cy with radius r)
  // Using a blobby path approximation
  const blobPath = `
    M ${cx} ${cy - r * 1.05}
    C ${cx + r * 0.6} ${cy - r * 1.15}, ${cx + r * 1.18} ${cy - r * 0.55}, ${cx + r * 1.12} ${cy + r * 0.1}
    C ${cx + r * 1.05} ${cy + r * 0.7}, ${cx + r * 0.55} ${cy + r * 1.12}, ${cx} ${cy + r * 1.08}
    C ${cx - r * 0.5} ${cy + r * 1.15}, ${cx - r * 1.1} ${cy + r * 0.65}, ${cx - r * 1.08} ${cy}
    C ${cx - r * 1.15} ${cy - r * 0.6}, ${cx - r * 0.55} ${cy - r * 1.1}, ${cx} ${cy - r * 1.05}
    Z
  `;

  // Eye positions
  const eyeOffsetX = r * 0.3;
  const eyeOffsetY = r * 0.1;
  const eyeR = r * 0.14;
  const pupilR = r * 0.07;

  // Left eye
  const lx = cx - eyeOffsetX;
  const ly = cy - eyeOffsetY;
  // Right eye
  const rx = cx + eyeOffsetX;
  const ry = cy - eyeOffsetY;

  function renderEyes() {
    if (expression === "obsessed") {
      // Heart-shaped pupils
      const heartSize = eyeR * 1.2;
      return (
        <>
          {/* Left eye */}
          <circle cx={lx} cy={ly} r={eyeR} fill="white" />
          <text x={lx} y={ly + eyeR * 0.7} textAnchor="middle" fontSize={heartSize * 1.8} fill="#E63946" style={{ dominantBaseline: "auto" }}>❤</text>

          {/* Right eye */}
          <circle cx={rx} cy={ry} r={eyeR} fill="white" />
          <text x={rx} y={ry + eyeR * 0.7} textAnchor="middle" fontSize={heartSize * 1.8} fill="#E63946" style={{ dominantBaseline: "auto" }}>❤</text>
        </>
      );
    }

    if (expression === "send-help") {
      // Spiral pupils
      const spiralR = eyeR * 0.8;
      return (
        <>
          <circle cx={lx} cy={ly} r={eyeR} fill="white" />
          <text x={lx} y={ly + eyeR * 0.5} textAnchor="middle" fontSize={eyeR * 2} fill="#111" style={{ dominantBaseline: "auto" }}>@</text>
          <circle cx={rx} cy={ry} r={eyeR} fill="white" />
          <text x={rx} y={ry + eyeR * 0.5} textAnchor="middle" fontSize={eyeR * 2} fill="#111" style={{ dominantBaseline: "auto" }}>@</text>
          {/* suppress unused var warning */}
          <g style={{ display: "none" }}><circle r={spiralR} /></g>
        </>
      );
    }

    if (expression === "calm") {
      // Half-lidded eyes (smaller)
      return (
        <>
          <circle cx={lx} cy={ly} r={eyeR} fill="white" />
          {/* Eyelid covering top half */}
          <rect x={lx - eyeR} y={ly - eyeR} width={eyeR * 2} height={eyeR} fill={color} rx={eyeR} />
          <circle cx={lx} cy={ly + pupilR * 0.5} r={pupilR} fill="#111" />

          <circle cx={rx} cy={ry} r={eyeR} fill="white" />
          <rect x={rx - eyeR} y={ry - eyeR} width={eyeR * 2} height={eyeR} fill={color} rx={eyeR} />
          <circle cx={rx} cy={ry + pupilR * 0.5} r={pupilR} fill="#111" />
        </>
      );
    }

    if (expression === "sad") {
      // Pupils look down
      return (
        <>
          <circle cx={lx} cy={ly} r={eyeR} fill="white" />
          <circle cx={lx} cy={ly + pupilR * 1.2} r={pupilR} fill="#111" />

          <circle cx={rx} cy={ry} r={eyeR} fill="white" />
          <circle cx={rx} cy={ry + pupilR * 1.2} r={pupilR} fill="#111" />
        </>
      );
    }

    if (expression === "anxious") {
      // Pupils slightly apart / worried
      return (
        <>
          <circle cx={lx} cy={ly} r={eyeR} fill="white" />
          <circle cx={lx - pupilR * 0.5} cy={ly - pupilR * 0.3} r={pupilR} fill="#111" />

          <circle cx={rx} cy={ry} r={eyeR} fill="white" />
          <circle cx={rx + pupilR * 0.5} cy={ry - pupilR * 0.3} r={pupilR} fill="#111" />
        </>
      );
    }

    if (expression === "excited") {
      // Pupils look slightly up
      return (
        <>
          <circle cx={lx} cy={ly} r={eyeR} fill="white" />
          <circle cx={lx} cy={ly - pupilR * 0.8} r={pupilR} fill="#111" />

          <circle cx={rx} cy={ry} r={eyeR} fill="white" />
          <circle cx={rx} cy={ry - pupilR * 0.8} r={pupilR} fill="#111" />
        </>
      );
    }

    // default: neutral
    return (
      <>
        <circle cx={lx} cy={ly} r={eyeR} fill="white" />
        <circle cx={lx} cy={ly} r={pupilR} fill="#111" />

        <circle cx={rx} cy={ry} r={eyeR} fill="white" />
        <circle cx={rx} cy={ry} r={pupilR} fill="#111" />
      </>
    );
  }

  function renderMouth() {
    const mouthY = cy + r * 0.38;
    const mouthW = r * 0.45;

    if (expression === "excited") {
      // Big smile arc
      return (
        <path
          d={`M ${cx - mouthW} ${mouthY - r * 0.05} Q ${cx} ${mouthY + r * 0.32} ${cx + mouthW} ${mouthY - r * 0.05}`}
          fill="none"
          stroke="white"
          strokeWidth={r * 0.09}
          strokeLinecap="round"
        />
      );
    }

    if (expression === "obsessed") {
      // Wide open smile
      return (
        <path
          d={`M ${cx - mouthW * 1.1} ${mouthY - r * 0.08} Q ${cx} ${mouthY + r * 0.42} ${cx + mouthW * 1.1} ${mouthY - r * 0.08}`}
          fill="white"
          stroke="white"
          strokeWidth={r * 0.05}
          strokeLinecap="round"
        />
      );
    }

    if (expression === "anxious") {
      // Wavy/wobbly mouth
      return (
        <path
          d={`M ${cx - mouthW} ${mouthY} Q ${cx - mouthW * 0.5} ${mouthY + r * 0.12} ${cx} ${mouthY} Q ${cx + mouthW * 0.5} ${mouthY - r * 0.12} ${cx + mouthW} ${mouthY}`}
          fill="none"
          stroke="white"
          strokeWidth={r * 0.08}
          strokeLinecap="round"
        />
      );
    }

    if (expression === "calm") {
      // Gentle small smile arc
      return (
        <path
          d={`M ${cx - mouthW * 0.6} ${mouthY} Q ${cx} ${mouthY + r * 0.18} ${cx + mouthW * 0.6} ${mouthY}`}
          fill="none"
          stroke="white"
          strokeWidth={r * 0.08}
          strokeLinecap="round"
        />
      );
    }

    if (expression === "sad") {
      // Downward arc
      return (
        <path
          d={`M ${cx - mouthW} ${mouthY + r * 0.1} Q ${cx} ${mouthY - r * 0.2} ${cx + mouthW} ${mouthY + r * 0.1}`}
          fill="none"
          stroke="white"
          strokeWidth={r * 0.08}
          strokeLinecap="round"
        />
      );
    }

    if (expression === "send-help") {
      // Jagged mouth showing teeth
      const tw = mouthW * 0.9;
      const th = r * 0.12;
      return (
        <>
          <path
            d={`M ${cx - tw} ${mouthY} L ${cx - tw * 0.6} ${mouthY + th} L ${cx - tw * 0.2} ${mouthY} L ${cx + tw * 0.2} ${mouthY + th} L ${cx + tw * 0.6} ${mouthY} L ${cx + tw} ${mouthY + th}`}
            fill="none"
            stroke="white"
            strokeWidth={r * 0.08}
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          {/* Teeth */}
          <rect x={cx - tw * 0.5} y={mouthY - r * 0.04} width={tw * 0.3} height={r * 0.14} fill="white" rx={r * 0.03} />
          <rect x={cx - tw * 0.1} y={mouthY - r * 0.04} width={tw * 0.3} height={r * 0.14} fill="white" rx={r * 0.03} />
        </>
      );
    }

    // neutral: straight line
    return (
      <line
        x1={cx - mouthW * 0.6}
        y1={mouthY}
        x2={cx + mouthW * 0.6}
        y2={mouthY}
        stroke="white"
        strokeWidth={r * 0.08}
        strokeLinecap="round"
      />
    );
  }

  function renderAccessory() {
    if (expression === "obsessed") {
      const sparkSize = r * 0.2;
      return (
        <>
          <text x={cx - r * 1.0} y={cy - r * 0.6} fontSize={sparkSize * 2} fill="#fcd34d" opacity="0.9" textAnchor="middle">✦</text>
          <text x={cx + r * 0.9} y={cy - r * 0.8} fontSize={sparkSize * 1.5} fill="#fcd34d" opacity="0.7" textAnchor="middle">✦</text>
          <text x={cx + r * 1.1} y={cy - r * 0.2} fontSize={sparkSize} fill="#fcd34d" opacity="0.5" textAnchor="middle">✦</text>
        </>
      );
    }

    if (expression === "anxious") {
      // Sweat drop on right side
      const sdx = cx + r * 1.05;
      const sdy = cy - r * 0.2;
      const sdR = r * 0.08;
      return (
        <path
          d={`M ${sdx} ${sdy - sdR * 2.5} Q ${sdx + sdR * 1.5} ${sdy - sdR} ${sdx} ${sdy + sdR * 0.5} Q ${sdx - sdR * 1.5} ${sdy - sdR} ${sdx} ${sdy - sdR * 2.5} Z`}
          fill="rgba(147,197,253,0.85)"
        />
      );
    }

    if (expression === "send-help") {
      // Lightning bolt near head
      const bx = cx + r * 0.85;
      const by = cy - r * 1.0;
      const bs = r * 0.22;
      return (
        <text x={bx} y={by} fontSize={bs * 3} fill="#fcd34d" opacity="0.9" textAnchor="middle">⚡</text>
      );
    }

    return null;
  }

  return (
    <div
      className={className}
      style={{
        display: "inline-block",
        animation: "floatBob 3s ease-in-out infinite",
        ...style,
      }}
    >
      <style>{`
        @keyframes floatBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Blob body */}
        <path d={blobPath} fill={color} />

        {/* Face */}
        {renderEyes()}
        {renderMouth()}

        {/* Accessory */}
        {renderAccessory()}
      </svg>
    </div>
  );
}
