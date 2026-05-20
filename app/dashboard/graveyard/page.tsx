import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FixStatusPill } from "@/components/FixStatusPill";
import Link from "next/link";
import { GraveyardExportButton } from "@/components/GraveyardExportButton";

type GraveyardFix = {
  id: string;
  title: string;
  category: string;
  status: string;
  started_at: string;
  ended_at: string;
  eulogy: string | null;
};

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getDayCount(startedAt: string, endedAt: string): number {
  const start = new Date(startedAt);
  const end = new Date(endedAt);
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function timeAgo(dateStr: string): string {
  const end = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - end.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

function TombstoneCard({ fix, index }: { fix: GraveyardFix; index: number }) {
  const days = getDayCount(fix.started_at, fix.ended_at);
  const rested = timeAgo(fix.ended_at);
  const delay = `${Math.min(index, 6) * 60}ms`;

  return (
    <div
      className="motion-card relative overflow-hidden rounded-3xl p-6 flex flex-col gap-4 anim-fadeUp"
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        animationDelay: delay,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 40% at 50% 110%, rgba(94,234,212,0.08), transparent 70%)",
        }}
      />

      <div className="relative flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center font-sans text-[11px] rounded-full px-2.5 py-0.5"
            style={{
              background: "rgba(94,234,212,0.10)",
              color: TEAL,
              border: "1px solid rgba(94,234,212,0.22)",
            }}
          >
            {fix.category}
          </span>
          <FixStatusPill status="Ended" size="sm" />
        </div>
        <span className="font-sans text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          {rested}
        </span>
      </div>

      <Link href={`/dashboard/fix/${fix.id}`} className="relative">
        <h3
          className="font-display transition-colors hover:text-[#5EEAD4]"
          style={{
            color: "#FFFFFF",
            fontSize: 19,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            lineHeight: 1.18,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {fix.title}
        </h3>
      </Link>

      <div className="relative">
        <div className="flex items-baseline gap-2 mb-1">
          <span
            className="font-display leading-none tabular-nums"
            style={{
              color: TEAL,
              fontSize: 44,
              fontWeight: 600,
              letterSpacing: "-0.04em",
            }}
          >
            {days}
          </span>
          <span className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            days of your life
          </span>
        </div>
        <p className="font-sans text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          {formatDate(fix.started_at)} — {formatDate(fix.ended_at)}
        </p>
      </div>

      {fix.eulogy ? (
        <blockquote
          className="relative font-display text-[14px] leading-relaxed pl-4 m-0"
          style={{
            borderLeft: `2px solid ${TEAL}`,
            color: "rgba(255,255,255,0.7)",
            fontStyle: "italic",
          }}
        >
          &ldquo;{fix.eulogy}&rdquo;
        </blockquote>
      ) : (
        <Link
          href={`/dashboard/fix/${fix.id}`}
          className="motion-link relative inline-flex font-sans text-sm transition-colors"
          style={{ color: TEAL }}
        >
          Write a eulogy →
        </Link>
      )}
    </div>
  );
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {graveyardFixes.map((fix, i) => (
              <TombstoneCard key={fix.id} fix={fix} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
