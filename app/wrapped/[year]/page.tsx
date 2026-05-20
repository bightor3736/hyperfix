import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { WrappedClient } from "./WrappedClient";

type Props = {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ u?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `Hyperfix Wrapped ${year} — a year of obsessions`,
    description: `Your ${year} in hyperfixations. Logged, counted, and a little unwell.`,
  };
}

type Fix = {
  id: string;
  title: string;
  category: string;
  intensity: number;
  started_at: string;
  ended_at: string | null;
};

function computeStats(fixes: Fix[], year: number) {
  const yearFixes = fixes.filter((f) => {
    const start = new Date(f.started_at).getFullYear();
    const end = f.ended_at ? new Date(f.ended_at).getFullYear() : new Date().getFullYear();
    return start === year || end === year;
  });

  if (yearFixes.length === 0) return null;

  const getDuration = (f: Fix) => {
    const start = new Date(f.started_at);
    const end = f.ended_at ? new Date(f.ended_at) : new Date();
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const longestFix = yearFixes.reduce((a, b) => (getDuration(a) >= getDuration(b) ? a : b));
  const mostIntense = yearFixes.reduce((a, b) => (a.intensity >= b.intensity ? a : b));

  const categoryCount: Record<string, number> = {};
  for (const f of yearFixes) {
    categoryCount[f.category] = (categoryCount[f.category] || 0) + 1;
  }
  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "other";

  const totalDays = yearFixes.reduce((sum, f) => sum + getDuration(f), 0);
  const totalFixes = yearFixes.length;
  const endedCount = yearFixes.filter((f) => !!f.ended_at).length;
  const avgIntensity =
    Math.round((yearFixes.reduce((sum, f) => sum + f.intensity, 0) / totalFixes) * 10) / 10;

  return {
    yearFixes,
    longestFix,
    mostIntense,
    topCategory,
    totalDays,
    totalFixes,
    endedCount,
    avgIntensity,
    getDuration,
  };
}

function generateQuote(stats: NonNullable<ReturnType<typeof computeStats>>): string {
  const { totalDays, topCategory, avgIntensity, totalFixes, endedCount, longestFix } = stats;

  if (totalDays > 300)
    return "You spent more than most of the year unwell. Iconic, honestly.";
  if (totalDays > 200)
    return "You spent more than half the year in a fixation. Fully unwell. We respect it.";
  if (topCategory === "song" || topCategory === "album" || topCategory === "artist") {
    const days = stats.getDuration(longestFix);
    return `A song had your brain in a chokehold for ${days} days. Totally normal behaviour.`;
  }
  if (topCategory === "fanfic" || topCategory === "fandom")
    return "The fanfic pipeline is real and it found you. No notes.";
  if (topCategory === "show" || topCategory === "anime")
    return "You rewatched the same thing until it became part of your personality. Good.";
  if (avgIntensity >= 8.5)
    return `Average intensity of ${avgIntensity}/10. You don't do things halfway. Alarming.`;
  if (totalFixes >= 10)
    return `${totalFixes} fixations in one year. Your brain does not rest. Ever.`;
  if (endedCount === 0)
    return "Not a single fix ended. They're all still running. Commitment issues: inverted.";
  if (endedCount === totalFixes)
    return "You closed every fix you opened. Rare and suspicious.";
  return "Another year of the brain doing brain things. Documented for posterity.";
}

export default async function WrappedYearPage({ params, searchParams }: Props) {
  const { year: yearParam } = await params;
  const { u: username } = await searchParams;
  const year = parseInt(yearParam, 10) || new Date().getFullYear();

  const supabase = await createClient();

  // Determine whose data to show
  let userId: string | null = null;
  let viewerName: string | null = null;
  let isPublicProfile = false;

  if (username) {
    // Public view by username
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, display_name, username, is_public")
      .eq("username", username)
      .single();

    if (profile && profile.is_public) {
      userId = profile.id;
      viewerName = profile.display_name || profile.username || username;
      isPublicProfile = true;
    }
  } else {
    // Session user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userId = user.id;
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", user.id)
        .single();
      viewerName = profile?.display_name || profile?.username || user.email?.split("@")[0] || "you";
    }
  }

  if (!userId) {
    // Not logged in, no username
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
        style={{ background: "#080808" }}
      >
        <div
          className="absolute inset-x-0 top-0 h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(168,85,247,0.12) 0%, transparent 70%)",
          }}
        />
        <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "#A855F7" }}>
          hyperfix wrapped {year}
        </span>
        <h1
          className="font-display text-4xl sm:text-5xl text-center leading-tight"
          style={{ color: "#F4F4F4" }}
        >
          Your year in obsessions.
        </h1>
        <p className="font-sans text-base text-center max-w-sm" style={{ color: "rgba(244,244,244,0.5)" }}>
          Log in to see your Wrapped for {year}.
        </p>
        <a
          href="/auth/login"
          className="px-6 py-3 rounded-xl font-sans text-sm font-bold transition-all hover:opacity-90"
          style={{ background: "#A855F7", color: "#0A0A0A" }}
        >
          Log in →
        </a>
      </div>
    );
  }

  // Fetch all fixes for the user
  const { data: fixes } = await supabase
    .from("fixes")
    .select("id, title, category, intensity, started_at, ended_at")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  const allFixes: Fix[] = fixes || [];
  const stats = computeStats(allFixes, year);

  if (!stats) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
        style={{ background: "#080808" }}
      >
        <div
          className="absolute inset-x-0 top-0 h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(168,85,247,0.08) 0%, transparent 70%)",
          }}
        />
        <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "#A855F7" }}>
          hyperfix wrapped {year}
        </span>
        <h1
          className="font-display text-4xl sm:text-5xl text-center leading-tight"
          style={{ color: "#F4F4F4" }}
        >
          Nothing logged for {year}.
        </h1>
        <p className="font-sans text-base text-center max-w-sm" style={{ color: "rgba(244,244,244,0.5)" }}>
          {isPublicProfile
            ? `${viewerName} hasn't logged any fixes for ${year} yet.`
            : `You haven't logged any fixes for ${year} yet. Start logging and come back.`}
        </p>
        {!isPublicProfile && (
          <a
            href="/dashboard"
            className="px-6 py-3 rounded-xl font-sans text-sm font-bold transition-all hover:opacity-90"
            style={{ background: "#A855F7", color: "#0A0A0A" }}
          >
            Go to dashboard →
          </a>
        )}
      </div>
    );
  }

  const quote = generateQuote(stats);

  const longestDays = stats.getDuration(stats.longestFix);
  const mostIntenseDays = stats.getDuration(stats.mostIntense);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const statCards = [
    { value: String(stats.totalFixes), label: "total fixes" },
    { value: `${stats.totalDays}`, label: "days fixated" },
    { value: stats.topCategory, label: "top category" },
    { value: `${stats.avgIntensity}/10`, label: "avg intensity" },
  ];

  return (
    <WrappedClient
      year={year}
      viewerName={viewerName || "you"}
      statCards={statCards}
      longestFix={{
        title: stats.longestFix.title,
        category: stats.longestFix.category,
        days: longestDays,
        startedAt: formatDate(stats.longestFix.started_at),
        endedAt: stats.longestFix.ended_at ? formatDate(stats.longestFix.ended_at) : "ongoing",
      }}
      mostIntenseFix={{
        title: stats.mostIntense.title,
        category: stats.mostIntense.category,
        days: mostIntenseDays,
        intensity: stats.mostIntense.intensity,
        startedAt: formatDate(stats.mostIntense.started_at),
        endedAt: stats.mostIntense.ended_at ? formatDate(stats.mostIntense.ended_at) : "ongoing",
      }}
      quote={quote}
    />
  );
}
