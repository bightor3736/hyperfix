import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hyperfix",
    short_name: "Hyperfix",
    description: "What are you unwell about?",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#A3E635",
    orientation: "portrait",
    icons: [
      { src: "/icon?size=192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon?size=512", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
    categories: ["lifestyle", "social"],
    shortcuts: [
      {
        name: "New fix",
        short_name: "New fix",
        description: "Log a new hyperfixation",
        url: "/dashboard/new",
      },
      {
        name: "Dashboard",
        short_name: "Dashboard",
        url: "/dashboard",
      },
    ],
  };
}
