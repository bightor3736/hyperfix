"use client";

import { useState, useEffect } from "react";

type MilestoneFix = {
  id: string;
  title: string;
  days: number;
};

const STORAGE_KEY = "hyperfix_dismissed_milestones";
const MILESTONES = [7, 30, 100, 365] as const;

const MILESTONE_COPY: Record<number, { icon: string; headline: string; sub: string }> = {
  7:   { icon: "🔥", headline: "one week in.",   sub: "still going. this is becoming something." },
  30:  { icon: "⚡", headline: "one month in.",  sub: "this fix has officially outlasted most diets." },
  100: { icon: "💀", headline: "100 days.",      sub: "that's dedication. or a cry for help. respect." },
  365: { icon: "🏆", headline: "one year.",      sub: "you spent a full year on this. legendary status." },
};

type Props = {
  milestones: MilestoneFix[];
};

export function MilestoneBanner({ milestones }: Props) {
  const [visible, setVisible] = useState<MilestoneFix[]>([]);
  const [exporting, setExporting] = useState<string | null>(null);
  const [exported, setExported] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const dismissed: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      const keys = milestones.map((m) => `${m.id}-${m.days}`);
      const toShow = milestones.filter((m) => !dismissed.includes(`${m.id}-${m.days}`));
      setVisible(toShow);
    } catch {
      setVisible(milestones);
    }
  }, [milestones]);

  function dismiss(fix: MilestoneFix) {
    const key = `${fix.id}-${fix.days}`;
    try {
      const prev: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...prev, key]));
    } catch {}
    setVisible((v) => v.filter((f) => !(f.id === fix.id && f.days === fix.days)));
  }

  async function handleShare(fix: MilestoneFix) {
    setExporting(fix.id);
    try {
      const res = await fetch(`/api/share/${fix.id}`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const filename = `hyperfix-${fix.days}days-${fix.title.slice(0, 24).replace(/\s+/g, "-").toLowerCase()}.png`;

      if (
        navigator.share &&
        navigator.canShare?.({ files: [new File([blob], filename, { type: "image/png" })] })
      ) {
        await navigator.share({
          files: [new File([blob], filename, { type: "image/png" })],
          title: `Day ${fix.days} of ${fix.title}`,
          text: `${fix.days} days of being unwell about ${fix.title}. not okay. tracked on hyperfix.app`,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
      setExported((s) => new Set(s).add(fix.id));
    } catch {}
    setExporting(null);
  }

  if (visible.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mb-6">
      {visible.map((fix) => {
        const milestone = MILESTONES.find((m) => m === fix.days) ?? fix.days;
        const copy = MILESTONE_COPY[milestone] ?? {
          icon: "✦",
          headline: `day ${fix.days}.`,
          sub: "still going.",
        };
        const isDone = exported.has(fix.id);

        return (
          <div
            key={`${fix.id}-${fix.days}`}
            className="relative overflow-hidden rounded-3xl p-5 sm:p-6 anim-fadeUp"
            style={{
              background:
                fix.days >= 100
                  ? "radial-gradient(ellipse 100% 200% at 50% 120%, rgba(215,38,56,0.22) 0%, rgba(215,38,56,0.06) 40%, #0F1011 80%)"
                  : "radial-gradient(ellipse 100% 200% at 50% 120%, rgba(94,234,212,0.20) 0%, rgba(94,234,212,0.05) 40%, #0F1011 80%)",
              border:
                fix.days >= 100
                  ? "1px solid rgba(215,38,56,0.28)"
                  : "1px solid rgba(94,234,212,0.22)",
            }}
          >
            {/* dismiss */}
            <button
              onClick={() => dismiss(fix)}
              className="absolute top-3 right-3 p-1.5 rounded-lg transition-opacity hover:opacity-70"
              style={{ color: "rgba(255,255,255,0.3)" }}
              aria-label="Dismiss"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-start gap-4 pr-6">
              <span style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>{copy.icon}</span>

              <div className="flex-1 min-w-0">
                <p
                  className="font-display font-semibold leading-tight mb-0.5"
                  style={{
                    color: "#FFFFFF",
                    fontSize: "clamp(20px, 4vw, 26px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {copy.headline}
                </p>
                <p className="font-sans text-sm mb-1 truncate" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {fix.title}
                </p>
                <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {copy.sub}
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 mt-4">
              <button
                onClick={() => handleShare(fix)}
                disabled={!!exporting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm font-bold transition-all duration-150 active:scale-[0.97]"
                style={{
                  background: isDone
                    ? "rgba(13,148,136,0.15)"
                    : fix.days >= 100
                    ? "#D72638"
                    : "#5EEAD4",
                  color: isDone ? "#0D9488" : fix.days >= 100 ? "#fff" : "#0A1F1C",
                  border: isDone ? "1px solid rgba(13,148,136,0.3)" : "none",
                  cursor: exporting ? "wait" : "pointer",
                  opacity: exporting && exporting !== fix.id ? 0.5 : 1,
                }}
              >
                {exporting === fix.id ? (
                  <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                ) : isDone ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                )}
                {exporting === fix.id ? "Generating…" : isDone ? "Shared!" : "Share this milestone"}
              </button>
              <button
                onClick={() => dismiss(fix)}
                className="px-4 py-2.5 rounded-xl font-mono text-sm transition-all hover:opacity-80"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Later
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
