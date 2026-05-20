"use client";
import { useEffect, useRef } from "react";

export function PricingOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function draw() {
      if (!canvas || !ctx) return;
      const W = window.innerWidth;
      const H = window.innerHeight;
      ctx.clearRect(0, 0, W, H);

      // ── orb centre: orbits slowly around its anchor ──
      const anchorX = W * 0.68;
      const anchorY = H * 0.38;
      const cx = anchorX + Math.cos(t * 0.4) * 70 + Math.sin(t * 0.25) * 30;
      const cy = anchorY + Math.sin(t * 0.4) * 50 + Math.cos(t * 0.3) * 25;
      const r = Math.min(W, H) * 0.38 + Math.sin(t * 0.6) * 20;

      // ── outer halo ──
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.6);
      halo.addColorStop(0, "rgba(100,170,10,0.12)");
      halo.addColorStop(1, "transparent");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // ── main orb ──
      const pulse = 0.8 + Math.sin(t * 0.7) * 0.2;
      const grad = ctx.createRadialGradient(
        cx - r * 0.2, cy - r * 0.2, 0,
        cx, cy, r
      );
      grad.addColorStop(0,   `rgba(94,234,212,${0.55 * pulse})`);
      grad.addColorStop(0.25, `rgba(130,205,30,${0.38 * pulse})`);
      grad.addColorStop(0.55, `rgba(80,150,10,${0.16 * pulse})`);
      grad.addColorStop(1,    "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      t += 0.012;
      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", () => { resize(); });

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, width: "100vw", height: "100vh" }}
      aria-hidden="true"
    />
  );
}
