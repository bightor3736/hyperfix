import type { MetadataRoute } from "next";

const SITE = "https://hyperfix.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE}/hyperfixation-tracker`,
      lastModified: new Date("2026-05-17"),
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
}
