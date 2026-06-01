import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hyperfix",
    short_name: "Hyperfix",
    description: "Your daily dopamine, on tap. The anti-doomscroll game for ADHD brains.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0c0a16",
    theme_color: "#7c5cff",
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
