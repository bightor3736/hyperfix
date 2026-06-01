import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";
import { levelForPoints } from "@/lib/gamification/levels";

/**
 * Bold XP / level HUD. The headline "score" of the game.
 */
export function XpHud({ totalPoints }: { totalPoints: number }) {
  const { level, index, next } = levelForPoints(totalPoints);
  const floor = level.points;
  const ceil = next ? next.points : level.points;
  const pct = next ? Math.min(100, Math.max(0, ((totalPoints - floor) / (ceil - floor)) * 100)) : 100;

  return (
    <Link
      href="/dashboard/points"
      className="group block rounded-[var(--radius-lg)] p-5 transition-all hover:-translate-y-0.5"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{ width: 36, height: 36, background: "var(--xp-soft)" }}
          >
            <Sparkles size={18} strokeWidth={2} style={{ color: "var(--xp)" }} />
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              Level {index + 1}
            </p>
            <p className="font-display text-[18px] leading-tight text-ink">{level.name}</p>
          </div>
        </div>
        <div className="text-right flex items-center gap-1">
          <div>
            <p className="font-display text-[22px] leading-none tabular-nums" style={{ color: "var(--xp)" }}>
              {totalPoints.toLocaleString()}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-ink-faint">XP</p>
          </div>
          <ChevronRight size={16} className="text-ink-faint group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* XP bar */}
      <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, var(--ink-faint), var(--ink))",
            transformOrigin: "left",
            animation: "barFill 0.8s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          <span className="absolute inset-0 anim-shimmer rounded-full" />
        </div>
      </div>

      <p className="mt-2 font-mono text-[10px] text-ink-faint">
        {next ? (
          <>
            <span style={{ color: "var(--xp)" }}>{(next.points - totalPoints).toLocaleString()} XP</span> to {next.name}
          </>
        ) : (
          "Max level. Absolutely feral. We're proud."
        )}
      </p>
    </Link>
  );
}
