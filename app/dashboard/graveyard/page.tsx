import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GraveyardExportButton } from "@/components/GraveyardExportButton";
import { GraveyardGrid, type GraveyardFix } from "./GraveyardGrid";

const TEAL = "var(--accent)";
const CARD_BG = "var(--bg)";
const CARD_BORDER = "var(--line)";

function getDayCount(startedAt: string, endedAt: string): number {
  const start = new Date(startedAt);
  const end = new Date(endedAt);
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div
      className="rounded-3xl p-5 anim-fadeUp"
      style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
    >
      <p
        className="font-mono text-[10px] uppercase tracking-widest mb-3"
        style={{ color: "var(--ink-muted)" }}
      >
        {label}
      </p>
      <p
        className="font-display tabular-nums"
        style={{
          color: "var(--ink)",
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      {sub && (
        <p
          className="font-sans text-xs mt-2"
          style={{ color: "var(--ink-muted)" }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function EmptyGraveyard() {
  return (
    <div
      className="rounded-3xl p-12 sm:p-16 text-center anim-fadeUp"
      style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
    >
      <h2
        className="font-display"
        style={{
          color: "var(--ink)",
          fontSize: "clamp(24px, 4vw, 32px)",
          letterSpacing: "-0.02em",
          fontWeight: 600,
          lineHeight: 1.1,
        }}
      >
        Nothing buried yet.
      </h2>
      <p
        className="mt-3 font-sans text-base max-w-md mx-auto"
        style={{ color: "var(--ink-muted)" }}
      >
        When a fixation fades, this is where it goes.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex mt-6 font-sans text-sm transition-colors"
        style={{ color: TEAL }}
      >
        End an active fix → see it here
      </Link>
    </div>
  );
}

export default async function GraveyardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    0,
  );
  const longest = graveyardFixes.reduce(
    (max, f) => {
      const d = getDayCount(f.started_at, f.ended_at);
      return d > max.days ? { days: d, title: f.title } : max;
    },
    { days: 0, title: "" },
  );

  return (
    <div
      className="min-h-screen px-4 sm:px-6 lg:px-8 pt-10 pb-16"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="mb-10 anim-fadeUp">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.18em] mb-4"
            style={{ color: TEAL }}
          >
            The Graveyard
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1
                className="font-display"
                style={{
                  color: "var(--ink)",
                  fontSize: "clamp(32px, 5.5vw, 48px)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.02em",
                  fontWeight: 600,
                }}
              >
                In loving memory.
              </h1>
              <p
                className="mt-4 font-sans text-base max-w-lg"
                style={{ color: "var(--ink-muted)" }}
              >
                Every obsession that ran its course. Click any to read the eulogy you wrote.
              </p>
            </div>
            {total > 0 && (
              <div className="shrink-0">
                <GraveyardExportButton />
              </div>
            )}
          </div>
        </div>

        {/* Stats strip */}
        {total > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            <StatCard
              label="Total buried"
              value={total.toLocaleString()}
              sub={total === 1 ? "fixation" : "fixations"}
            />
            <StatCard
              label="Longest run"
              value={`${longest.days.toLocaleString()}d`}
              sub={longest.title || undefined}
            />
            <StatCard
              label="Days lost"
              value={totalDays.toLocaleString()}
              sub="lifetime hours, gone"
            />
          </div>
        )}

        {/* Grid or empty state */}
        {total === 0 ? <EmptyGraveyard /> : <GraveyardGrid fixes={graveyardFixes} />}
      </div>
    </div>
  );
}
