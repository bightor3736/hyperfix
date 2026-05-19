"use client";
import { useEffect, useRef } from "react";

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let t = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width  = canvas!.offsetWidth  * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
    }

    function draw() {
      const dpr = window.devicePixelRatio || 1;
      const W = canvas!.offsetWidth;
      const H = canvas!.offsetHeight;

      // Reset transform cleanly every frame (avoids accumulation)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, W, H);

      // ── 1. Near-black background ──────────────────────────────────────
      ctx!.fillStyle = "#010201";
      ctx!.fillRect(0, 0, W, H);

      // ── 2. Animation values ───────────────────────────────────────────
      // Slow drift: whole streak cluster bobs ±14px
      const drift  = Math.sin(t * 0.28) * 14;
      // Pulse: glow intensity breathes between 0.72 and 1.0
      const pulse  = 0.72 + Math.sin(t * 0.52) * 0.28;

      // ── 3. Bezier path helper ─────────────────────────────────────────
      // Reference shape: enter lower-left, sweep up, exit upper-right.
      // All Y values are "base offset from top" (positive = lower).
      // Secondary streaks are shifted vertically relative to the main.
      function path(dy: number) {
        ctx!.beginPath();
        ctx!.moveTo(-60, H * 0.70 + dy + drift);
        ctx!.bezierCurveTo(
          W * 0.30, H * 0.16 + dy + drift,   // cp1 — pull hard upward
          W * 0.68, H * 0.10 + dy + drift,   // cp2 — stays high
          W + 60,   H * 0.20 + dy + drift    // exit upper-right
        );
      }

      // ── 4. Streak layers (back → front) ───────────────────────────────
      // Each layer uses ctx.filter for the wide glow (more authentic than
      // shadowBlur alone which only adds a halo, not a wide area light).

      // 4a. Ultra-wide outer halo (very wide blur)
      ctx!.save();
      ctx!.filter = "blur(55px)";
      ctx!.globalAlpha = 0.30 * pulse;
      ctx!.strokeStyle = "rgba(100,185,12,1)";
      ctx!.lineWidth = 60;
      ctx!.lineCap = "round";
      path(0);
      ctx!.stroke();
      ctx!.restore();

      // 4b. Secondary wider halo (slightly tighter)
      ctx!.save();
      ctx!.filter = "blur(20px)";
      ctx!.globalAlpha = 0.55 * pulse;
      ctx!.strokeStyle = "rgba(130,210,18,1)";
      ctx!.lineWidth = 18;
      ctx!.lineCap = "round";
      path(0);
      ctx!.stroke();
      ctx!.restore();

      // 4c. Bright core — no filter, just shadow glow
      ctx!.save();
      ctx!.filter = "none";
      ctx!.shadowBlur  = 22;
      ctx!.shadowColor = "#a3e635";
      ctx!.globalAlpha = 0.95 * pulse;
      ctx!.strokeStyle = "#a3e635";
      ctx!.lineWidth = 2;
      ctx!.lineCap = "round";
      path(0);
      ctx!.stroke();
      ctx!.restore();

      // 4d. Hot white centre line (makes it feel neon)
      ctx!.save();
      ctx!.filter = "none";
      ctx!.globalAlpha = 0.65 * pulse;
      ctx!.strokeStyle = "rgba(215,255,140,1)";
      ctx!.lineWidth = 0.9;
      ctx!.lineCap = "round";
      path(0);
      ctx!.stroke();
      ctx!.restore();

      // ── 5. Secondary / satellite streaks ──────────────────────────────
      // Thin accent above the main streak
      ctx!.save();
      ctx!.filter = "blur(5px)";
      ctx!.globalAlpha = 0.55 * pulse;
      ctx!.strokeStyle = "rgba(163,230,53,1)";
      ctx!.lineWidth = 0.9;
      ctx!.lineCap = "round";
      path(-28);
      ctx!.stroke();
      ctx!.restore();

      // Thin faint below
      ctx!.save();
      ctx!.filter = "blur(6px)";
      ctx!.globalAlpha = 0.35 * pulse;
      ctx!.strokeStyle = "rgba(130,200,20,1)";
      ctx!.lineWidth = 1.2;
      ctx!.lineCap = "round";
      path(35);
      ctx!.stroke();
      ctx!.restore();

      // Ghost below (extra depth)
      ctx!.save();
      ctx!.filter = "blur(12px)";
      ctx!.globalAlpha = 0.18 * pulse;
      ctx!.strokeStyle = "rgba(100,170,10,1)";
      ctx!.lineWidth = 8;
      ctx!.lineCap = "round";
      path(55);
      ctx!.stroke();
      ctx!.restore();

      // ── 6. Bottom vignette — fades to solid so text reads cleanly ─────
      ctx!.filter = "none";
      const vign = ctx!.createLinearGradient(0, H * 0.52, 0, H);
      vign.addColorStop(0, "transparent");
      vign.addColorStop(1, "#010201");
      ctx!.fillStyle = vign;
      ctx!.fillRect(0, H * 0.52, W, H);
    }

    function loop() {
      draw();
      t += 0.016;
      raf = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener("resize", resize);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
