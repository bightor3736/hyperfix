import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { WrappedClient } from "./WrappedClient";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

type Props = {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ u?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { year: yearParam } = await params;
  const { u: username } = await searchParams;
  const year = parseInt(yearParam, 10) || new Date().getFullYear();
  const SITE_URL = "https://hyperfix.app";

  const title = `Hyperfix Wrapped ${year} — a year of obsessions`;
  const description = `Your ${year} in hyperfixations. Logged, counted, and a little unwell.`;

  // Build OG image URL — public username gets a rich preview, otherwise generic
  let ogImage = `${SITE_URL}/api/og?title=Hyperfix+Wrapped+${year}&sub=a+year+of+obsessions%2C+counted&accent=Wrapped`;

  if (username) {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, is_public")
      .eq("username", username)
      .single();

    if (profile?.is_public) {
      const { data: fixesRaw } = await supabase
        .from("fixes")
        .select("id, title, category, intensity, started_at, ended_at")
        .eq("user_id", profile.id);

      const stats = computeStats((fixesRaw as Fix[]) ?? [], year);
      if (stats) {
        const params = new URLSearchParams({
          year: String(year),
          totalFixes: String(stats.totalFixes),
          totalDays: String(stats.totalDays),
          topCategory: stats.topCategory,
          avgIntensity: String(stats.avgIntensity),
          longestTitle: stats.longestFix.title,
          longestDays: String(stats.getDuration(stats.longestFix)),
          quote: generateQuote(stats),
          name: username,
        });
        ogImage = `${SITE_URL}/api/wrapped/image?${params.toString()}`;
      }
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1080, height: 1920, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
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
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative" style={{ background: "var(--bg)" }}>
        <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }} />
        <div className="relative max-w-2xl w-full">
          <div className="relative overflow-hidden rounded-3xl p-8 sm:p-14 text-center anim-fadeUp" style={{ background: "radial-gradient(ellipse 80% 120% at 50% 130%, var(--accent) 0%, var(--accent) 14%, #0E4F47 34%, #08231F 55%, var(--bg) 78%)", border: "1px solid var(--line)" }}>
            <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55 }} />
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, var(--bg) 0%, rgba(7,7,8,0.45) 30%, transparent 100%)" }} />
            <div className="relative">
              <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5" style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--accent)" }}>
                hyperfix wrapped {year}
              </span>
              <h1 className="font-display" style={{ color: "var(--ink)", fontSize: "clamp(36px, 6vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}>
                Your year in obsessions.
              </h1>
              <p className="mt-5 font-sans text-base sm:text-lg max-w-md mx-auto" style={{ color: "var(--line)" }}>
                Log in to see your Wrapped for {year}.
              </p>
              <div className="mt-7">
                <a
                  href="/auth/login"
                  className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-3.5 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
                  style={{
                    background: "var(--ink)",
                    color: "var(--bg)",
                    borderRadius: 999,
                    boxShadow: "0 1px 0 0 var(--ink-muted) inset, 0 12px 36px rgba(0,0,0,0.4), 0 0 40px var(--accent)",
                  }}
                >
                  Log in →
                </a>
              </div>
            </div>
          </div>
        </div>
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
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative" style={{ background: "var(--bg)" }}>
        <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }} />
        <div className="relative max-w-2xl w-full">
          <div className="relative overflow-hidden rounded-3xl p-8 sm:p-14 text-center anim-fadeUp" style={{ background: "radial-gradient(ellipse 80% 120% at 50% 130%, var(--accent) 0%, var(--accent) 14%, #0E4F47 34%, #08231F 55%, var(--bg) 78%)", border: "1px solid var(--line)" }}>
            <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55 }} />
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, var(--bg) 0%, rgba(7,7,8,0.45) 30%, transparent 100%)" }} />
            <div className="relative">
              <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5" style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--accent)" }}>
                hyperfix wrapped {year}
              </span>
              <h1 className="font-display" style={{ color: "var(--ink)", fontSize: "clamp(36px, 6vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}>
                Nothing logged for {year}.
              </h1>
              <p className="mt-5 font-sans text-base sm:text-lg max-w-md mx-auto" style={{ color: "var(--line)" }}>
                {isPublicProfile
                  ? `${viewerName} hasn't logged any fixes for ${year} yet.`
                  : `You haven't logged any fixes for ${year} yet. Start logging and come back.`}
              </p>
              {!isPublicProfile && (
                <div className="mt-7">
                  <a
                    href="/dashboard"
                    className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-3.5 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
                    style={{
                      background: "var(--ink)",
                      color: "var(--bg)",
                      borderRadius: 999,
                      boxShadow: "0 1px 0 0 var(--ink-muted) inset, 0 12px 36px rgba(0,0,0,0.4), 0 0 40px var(--accent)",
                    }}
                  >
                    Go to dashboard →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
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
