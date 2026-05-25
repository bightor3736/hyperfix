import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

type Archetype = {
  slug: string;
  name: string;
  zinger: string;
  color: string;
};

const ARCHETYPES: Record<string, Archetype> = {
  spiraler: {
    slug: "spiraler",
    name: "The Spiraler",
    zinger:
      "You don't have a hyperfixation. You have an emotional crisis with a name and a ship tag.",
    color: "#EC4899",
  },
  "lore-goblin": {
    slug: "lore-goblin",
    name: "The Lore Goblin",
    zinger:
      "Three hours into a video essay. Two tabs into the wiki. You will explain this tonight, unprompted.",
    color: "#A78BFA",
  },
  "loop-witch": {
    slug: "loop-witch",
    name: "The Loop Witch",
    zinger:
      "One song. Forty-seven listens. You're not okay, but the bridge is doing something to you.",
    color: "#5EEAD4",
  },
  rewatcher: {
    slug: "rewatcher",
    name: "The Rewatcher",
    zinger:
      "You know the lines before they say them. You watch anyway. It's a comfort. It's a personality.",
    color: "#F59E0B",
  },
  collector: {
    slug: "collector",
    name: "The Collector",
    zinger:
      "Every book on the shelf. Every achievement in the game. The list is the love language.",
    color: "#10B981",
  },
  "real-person-enjoyer": {
    slug: "real-person-enjoyer",
    name: "The Real Person Enjoyer",
    zinger:
      "You know their tour dates, their interview tics, their childhood best friend's name. You are normal about this.",
    color: "#D72638",
  },
};

const PAPER = "#F4EFE6";
const INK = "#111111";
const TEAL = "#5EEAD4";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ archetype: string }> }
) {
  const { archetype } = await params;
  const a = ARCHETYPES[archetype];

  if (!a) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1350,
          background: PAPER,
          color: INK,
          display: "flex",
          flexDirection: "column",
          padding: "72px 72px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 20,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.55)",
            }}
          >
            hyperfix.app/quiz
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: a.color,
              }}
            />
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 18,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.55)",
              }}
            >
              archetype
            </div>
          </div>
        </div>

        {/* Center block */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.5)",
              marginBottom: 28,
            }}
          >
            you are
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: a.name.length > 22 ? 110 : 132,
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              color: INK,
              maxWidth: 920,
            }}
          >
            {a.name}
          </div>
          <div
            style={{
              marginTop: 44,
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontSize: 32,
              lineHeight: 1.35,
              color: "rgba(0,0,0,0.72)",
              maxWidth: 880,
            }}
          >
            {a.zinger}
          </div>
        </div>

        {/* Accent stripe */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              height: 8,
              width: 120,
              background: a.color,
              borderRadius: 999,
            }}
          />
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 16,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.45)",
            }}
          >
            6 questions · 1 archetype
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(0,0,0,0.1)",
            paddingTop: 28,
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 40,
              fontWeight: 500,
              letterSpacing: "-0.03em",
              color: INK,
              display: "flex",
            }}
          >
            hyper
            <span style={{ color: TEAL, fontStyle: "italic" }}>fix</span>
          </div>
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 18,
              color: "rgba(0,0,0,0.5)",
              letterSpacing: "0.04em",
            }}
          >
            what kind of hyperfixer are you?
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
    }
  );
}
