import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { levelForPoints } from "@/lib/gamification/levels";

export const runtime = "edge";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return ((parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")).toUpperCase();
  }
  return (name[0] ?? "").toUpperCase();
}

// Satori does NOT resolve CSS custom properties (var(--…)) — every colour here
// must be a literal. Palette mirrors the dark-indigo focus-room profile.
const INK = "#ffffff";
const TEAL = "#5eead4";
const PURPLE = "#a78bfa";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name, username, bio, avatar_url, total_points, current_streak, is_pro")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    return new Response("Not found", { status: 404 });
  }

  // Active hyperfixation count — the live obsessions.
  const { count: fixCount } = await supabase
    .from("hyperfixations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .eq("status", "active");

  const displayName = profile.display_name ?? profile.username ?? username;
  const initials = getInitials(displayName);
  const totalPoints = profile.total_points ?? 0;
  const streak = profile.current_streak ?? 0;
  const activeFixes = fixCount ?? 0;
  const { level, index, next } = levelForPoints(totalPoints);
  const levelNum = index + 1;
  const progressPct = next
    ? Math.min(100, Math.max(6, ((totalPoints - level.points) / (next.points - level.points)) * 100))
    : 100;

  const stats: { value: string; label: string; color: string }[] = [
    { value: totalPoints.toLocaleString(), label: "total XP", color: TEAL },
    { value: String(streak), label: "day streak", color: "#ff7a59" },
    { value: String(activeFixes), label: "fixations", color: PURPLE },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(160deg, #1e1880 0%, #0f0d40 100%)",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        {/* Purple glow top, teal glow bottom — the focus-room atmosphere */}
        <div style={{ position: "absolute", top: -220, left: 320, width: 760, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.45) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", bottom: -260, left: -120, width: 720, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(94,234,212,0.30) 0%, transparent 65%)" }} />

        {/* Body */}
        <div style={{ display: "flex", flex: 1, padding: "70px 80px", position: "relative", zIndex: 1 }}>
          {/* LEFT — identity + the level story */}
          <div style={{ width: "62%", display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: 40 }}>
            {/* Avatar + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 40 }}>
              <div style={{ display: "flex", padding: 3, borderRadius: "50%", background: "linear-gradient(135deg, #5eead4, #818cf8)" }}>
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} width={84} height={84} style={{ width: 84, height: 84, borderRadius: "50%", objectFit: "cover", border: "3px solid #0f0d40" }} />
                ) : (
                  <div style={{ width: 84, height: 84, borderRadius: "50%", background: "#0f0d40", display: "flex", alignItems: "center", justifyContent: "center", color: TEAL, fontSize: 30, fontWeight: 700 }}>
                    {initials}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 46, fontWeight: 700, color: INK, letterSpacing: "-0.03em", lineHeight: 1 }}>{displayName}</span>
                  {profile.is_pro && (
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#0f0d40", background: TEAL, padding: "3px 10px", borderRadius: 8, letterSpacing: "0.04em" }}>PRO</span>
                  )}
                </div>
                <span style={{ fontSize: 22, color: "rgba(167,139,250,0.9)", fontFamily: "ui-monospace, monospace", marginTop: 8 }}>@{profile.username ?? username}</span>
              </div>
            </div>

            {/* Level badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: TEAL, fontFamily: "ui-monospace, monospace", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                Level {levelNum}
              </span>
            </div>
            {/* Level name — the line people screenshot */}
            <div style={{ fontSize: 68, fontWeight: 700, color: INK, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 26 }}>
              {level.name}
            </div>

            {/* Progress bar */}
            <div style={{ display: "flex", width: 520, height: 12, borderRadius: 999, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
              <div style={{ display: "flex", width: `${progressPct}%`, height: 12, borderRadius: 999, background: "linear-gradient(90deg, #6366f1, #a855f7)" }} />
            </div>
            {next && (
              <span style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", fontFamily: "ui-monospace, monospace", marginTop: 12 }}>
                {(next.points - totalPoints).toLocaleString()} XP to {next.name}
              </span>
            )}
          </div>

          {/* RIGHT — stats stack */}
          <div style={{ width: "38%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
            {stats.map((s) => (
              <div key={s.label} style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "22px 26px" }}>
                <span style={{ fontSize: 52, fontWeight: 700, color: s.color, letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</span>
                <span style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", fontFamily: "ui-monospace, monospace", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 8 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 80px", borderTop: "1px solid rgba(255,255,255,0.10)", position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: TEAL, letterSpacing: "-0.02em" }}>hyperfix</span>
          <span style={{ fontSize: 17, color: "rgba(255,255,255,0.5)" }}>track your hyperfixations · hyperfix.app</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
