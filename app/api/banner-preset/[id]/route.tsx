import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getBannerPreset } from "@/lib/banner-presets";

export const runtime = "edge";

const W = 1500;
const H = 500;

/**
 * Build the dot-pattern background URL used as subtle texture on top of
 * the gradient. Encoded inline as SVG so the edge worker doesn't need
 * to fetch external assets.
 */
function dotPattern(color: string, opacity: number): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><circle cx='2' cy='2' r='1' fill='${color}' fill-opacity='${opacity}'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const preset = getBannerPreset(id);

  if (!preset) {
    return new Response("Not found", { status: 404 });
  }

  const [dark, mid, accent] = [
    preset.palette[0],
    preset.palette[1] ?? preset.palette[0],
    preset.palette[2] ?? preset.palette[1] ?? preset.palette[0],
  ];

  // Background: diagonal gradient + radial accent glow.
  const gradient = `linear-gradient(135deg, ${dark} 0%, ${mid} 55%, ${accent} 130%)`;
  const radial = `radial-gradient(ellipse 80% 90% at 80% 110%, ${accent}55 0%, transparent 60%)`;
  const dots = dotPattern("#ffffff", 0.18);

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundImage: `${dots}, ${radial}, ${gradient}`,
          backgroundSize: "24px 24px, 100% 100%, 100% 100%",
          backgroundColor: dark,
        }}
      >
        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)",
          }}
        />
        {/* Center wordmark */}
        <div
          style={{
            display: "flex",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
            fontSize: 28,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.18)",
            fontWeight: 600,
          }}
        >
          hyperfix
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      headers: {
        // Public, immutable — preset IDs never change content.
        "Cache-Control":
          "public, max-age=31536000, s-maxage=31536000, immutable",
      },
    },
  );
}
