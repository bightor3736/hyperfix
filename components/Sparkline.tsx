"use client";

export function Sparkline({ entries }: { entries: { date: string; intensity: number }[] }) {
  const w = 400;
  const h = 60;

  // Use real data if 2+ points, otherwise fall back to fake pattern
  let pts: number[];
  if (entries.length >= 2) {
    const last14 = entries.slice(-14);
    pts = last14.map((e) => Math.max(1, Math.min(10, e.intensity)));
  } else {
    // Fake fallback — same pattern as original
    const intensity = entries.length === 1 ? entries[0].intensity : 5;
    pts = [2, 3, 2, 4, 5, intensity * 0.6, intensity * 0.7, intensity * 0.8, intensity * 0.9, intensity].map(
      (v) => Math.max(1, Math.min(10, v))
    );
  }

  const norm = (v: number) => h - 4 - ((v - 1) / 9) * (h - 8);
  const n = pts.length;

  // Build smooth cubic bezier path
  function smoothPath(points: number[]): string {
    if (points.length < 2) return "";
    const coords = points.map((v, i) => ({
      x: (i / (points.length - 1)) * w,
      y: norm(v),
    }));

    let d = `M${coords[0].x},${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const cp1x = prev.x + (curr.x - prev.x) / 3;
      const cp1y = prev.y;
      const cp2x = curr.x - (curr.x - prev.x) / 3;
      const cp2y = curr.y;
      d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
    }
    return d;
  }

  const linePath = smoothPath(pts);
  const fillPath = `${linePath} L${w},${h} L0,${h} Z`;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-fill-${n}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#spark-fill-${n})`} />
      <path d={linePath} fill="none" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
