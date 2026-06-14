import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hyperfix",
    short_name: "Hyperfix",
    description: "Start the task you've been avoiding. Name it, do 5 minutes, get rewarded for starting — the ADHD app that beats task paralysis.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#FBF7F1",
    theme_color: "#FF5A36",
    orientation: "portrait",
    icons: [
      { src: "/icon?size=192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon?size=512", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
    categories: ["lifestyle", "health", "games"],
    shortcuts: [
      {
        name: "Start a task",
        short_name: "Start",
        description: "Beat the freeze — start the thing you're avoiding",
        url: "/dashboard?welcome=1",
      },
      {
        name: "Leaderboard",
        short_name: "Ranks",
        url: "/leaderboard",
      },
    ],
  };
}
