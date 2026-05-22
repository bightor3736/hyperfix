import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GraveyardExportButton } from "@/components/GraveyardExportButton";
import { GraveyardGrid, type GraveyardFix } from "./GraveyardGrid";

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function getDayCount(startedAt: string, endedAt: string): number {
  const start = new Date(startedAt);
  const end = new Date(endedAt);
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function EmptyGraveyard() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-12 sm:p-16 text-center anim-fadeUp"
      style={{
        background:
          "radial-gradient(ellipse 80% 120% at 50% 130%, #2DD4BF 0%, #0E4F47 26%, #08231F 50%, #0F1011 80%)",
        border: `1px solid ${CARD_BORDER}`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "220px 220px", opacity: 0.5 }}
      />
      <div className="relative">
        <span
          className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-6"
          style={{
            background: "rgba(94,234,212,0.12)",
            color: TEAL,
            border: "1px solid rgba(94,234,212,0.25)",
          }}
        >
          the graveyard
        </span>
        <h2
          className="font-display"
          style={{
            color: "#FFFFFF",
            fontSize: "clamp(28px, 5vw, 40px)",
            letterSpacing: "-0.02em",
            fontWeight: 600,
            lineHeight: 1.05,
          }}
        >
          Nothing here yet.
        </h2>
        <p className="mt-4 font-sans text-base" style={{ color: "rgba(255,255,255,0.65)" }}>
          When a fix fades, it gets buried here. With a eulogy, if you loved it.
        </p>
      </div>
    </div>
  );
}

export default async function GraveyardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: fixes } = await supabase
    .from("fixes")
    .select("*")
    .eq("user_id", user.id)
    .not("ended_at", "is", null)
    .order("ended_at", { ascending: false });

  const graveyardFixes: GraveyardFix[] = (fixes ?? []).map((f) => ({
    id: f.id,
    title: f.title,
    category: f.category ?? "other",
    status: f.status ?? "Ended",
    started_at: f.started_at,
    ended_at: f.ended_at,
    eulogy: f.eulogy ?? null,
  }));

  const total = graveyardFixes.length;
  const totalDays = graveyardFixes.reduce(
    (sum, f) => sum + getDayCount(f.started_at, f.ended_at),
    0
  );
  const eulogyCount = graveyardFixes.filter((f) => f.eulogy).length;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative" style={{ background: "#070708" }}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
      />
      <div className="relative max-w-5xl mx-auto">
        {/* Hero header card */}
        <div
          className="relative overflow-hidden rounded-3xl mb-6 p-6 sm:p-10 anim-fadeUp"
          style={{
            background:
              "radial-gradient(ellipse 80% 120% at 50% 130%, #5EEAD4 0%, #2DD4BF 14%, #0E4F47 34%, #08231F 55%, #070708 78%)",
            border: `1px solid ${CARD_BORDER}`,
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55 }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, #070708 0%, rgba(7,7,8,0.45) 30%, transparent 100%)",
            }}
          />
          <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span
                className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5"
                style={{
                  background: "rgba(94,234,212,0.12)",
                  color: TEAL,
                  border: "1px solid rgba(94,234,212,0.25)",
                }}
              >
                graveyard
              </span>
              <h1
                className="font-display"
                style={{
                  color: "#FFFFFF",
                  fontSize: "clamp(36px, 6vw, 60px)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.02em",
                  fontWeight: 600,
                }}
              >
                The things that
                <br />
                used to run your life.
              </h1>
              <div className="mt-5 flex items-center gap-4 flex-wrap font-sans text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                <span>RIP · {total} {total === 1 ? "fix" : "fixes"}</span>
                {totalDays > 0 && (
                  <span style={{ color: TEAL }}>· {totalDays.toLocaleString()} days lived</span>
                )}
                {eulogyCount > 0 && (
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>
                    · {eulogyCount} {eulogyCount === 1 ? "eulogy" : "eulogies"} written
                  </span>
                )}
              </div>
            </div>
            {total > 0 && (
              <div className="shrink-0">
                <GraveyardExportButton />
              </div>
            )}
          </div>
        </div>

        {/* Grid or empty state */}
        {total === 0 ? (
          <EmptyGraveyard />
        ) : (
          <GraveyardGrid fixes={graveyardFixes} />
        )}
      </div>
    </div>
  );
}
