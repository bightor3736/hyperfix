import type { MetadataRoute } from "next";
import { TRACK_SLUGS } from "@/lib/track-data";

const SITE = "https://hyperfix.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE,
      lastModified: new Date("2026-05-25"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE}/adhd`,
      lastModified: new Date("2026-05-25"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE}/explore`,
      lastModified: new Date("2026-05-25"),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SITE}/hyperfixation-tracker`,
      lastModified: new Date("2026-05-25"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE}/fanfic-tracker`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE}/booktok-tracker`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE}/vs/notion`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/vs/letterboxd`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/vs/shelf`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/vs/goodreads`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/vs/obsidian`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/vs/spotify`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/vs/discord`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/vs/spreadsheet`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/vs/airtable`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/vs/daylio`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/book-tracker`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE}/kpop-tracker`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE}/anime-tracker`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE}/rewatch-tracker`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE}/pricing`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/wrapped`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${SITE}/blog/signs-youre-in-a-hyperfixation`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE}/blog/how-to-explain-hyperfixation`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE}/blog`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE}/blog/what-is-hyperfixation`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${SITE}/blog/adhd-hyperfixation`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${SITE}/blog/how-to-track-your-hyperfixations`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE}/blog/hyperfixation-ending`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE}/blog/hyperfixation-vs-obsession`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE}/manifesto`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${SITE}/privacy`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic routes from Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let profileRoutes: MetadataRoute.Sitemap = [];
  let fixRoutes: MetadataRoute.Sitemap = [];

  if (supabaseUrl && serviceKey) {
    try {
      // Fetch public usernames
      const profilesRes = await fetch(
        `${supabaseUrl}/rest/v1/profiles?select=username&is_public=eq.true&username=not.is.null&limit=500`,
        {
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
          next: { revalidate: 3600 },
        }
      );
      if (profilesRes.ok) {
        const profiles = (await profilesRes.json()) as { username: string }[];
        profileRoutes = profiles
          .filter((p) => p.username)
          .map((p) => ({
            url: `${SITE}/u/${p.username}`,
            changeFrequency: "weekly" as const,
            priority: 0.6,
          }));
      }
    } catch {
      // Non-fatal
    }

    try {
      // Fetch recent public fix IDs
      const fixesRes = await fetch(
        `${supabaseUrl}/rest/v1/fixes?select=id&is_public=eq.true&order=created_at.desc&limit=500`,
        {
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
          next: { revalidate: 3600 },
        }
      );
      if (fixesRes.ok) {
        const fixes = (await fixesRes.json()) as { id: string }[];
        fixRoutes = fixes.map((f) => ({
          url: `${SITE}/fix/${f.id}`,
          changeFrequency: "weekly" as const,
          priority: 0.5,
        }));
      }
    } catch {
      // Non-fatal
    }
  }

  const trackRoutes: MetadataRoute.Sitemap = TRACK_SLUGS.map((slug) => ({
    url: `${SITE}/track/${slug}`,
    lastModified: new Date("2026-05-25"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...trackRoutes, ...profileRoutes, ...fixRoutes];
}
