"use client";

import { useEffect, useState } from "react";

// Celebratory reward palette — blue, mint, amber, coral, pink.
const COLORS = ["#5b7fff", "#34d399", "#ffc857", "#ff7a59", "#ffb2da"];

/**
 * Lightweight confetti burst. Bump `fireKey` to re-trigger (e.g. a counter).
 */
export function Confetti({ fireKey }: { fireKey: number }) {
  const [pieces, setPieces] = useState<
    { id: number; left: number; delay: number; color: string; size: number; rot: number }[]
  >([]);

  useEffect(() => {
    if (fireKey === 0) return;
    const next = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.15,
      color: COLORS[i % COLORS.length],
      size: 5 + Math.random() * 6,
      rot: Math.random() * 360,
    }));
    setPieces(next);
    const t = setTimeout(() => setPieces([]), 1200);
    return () => clearTimeout(t);
  }, [fireKey]);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-2 anim-confetti"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: 2,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}
