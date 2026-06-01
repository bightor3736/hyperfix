import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hyperfix",
    short_name: "Hyperfix",
    description: "ADHD accountability that actually works. Track hyperfixations, earn real XP, beat the wall.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f6f8fb",
    theme_color: "#5b7fff",
    orientation: "portrait",
    icons: [
      { src: "/icon?size=192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon?size=512", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
    categories: ["lifestyle", "health", "games"],
    shortcuts: [
      {
        name: "Roll a dopamine hit",
        short_name: "Play",
        description: "Get a dopamine hit right now",
        url: "/dashboard",
      },
      {
        name: "Leaderboard",
        short_name: "Ranks",
        url: "/leaderboard",
      },
    ],
  };
}
