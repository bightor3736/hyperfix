import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const runtime = "edge";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function dayCount(startedAt: string, endedAt: string | null): number {
  const start = new Date(startedAt);
  const end = endedAt ? new Date(endedAt) : new Date();
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: fix, error } = await supabase
    .from("fixes")
    .select("id, title, category, status, intensity, started_at, ended_at, is_public, user_id")
    .eq("id", id)
    .single();

  if (error || !fix || !fix.is_public) {
    return new Response("Not found", { status: 404 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("id", fix.user_id)
    .single();

  const days = dayCount(fix.started_at, fix.ended_at);
  const username = profile?.username ?? null;

  // Intensity dots: 10 blocks
  const intensityBlocks = Array.from({ length: 10 }, (_, i) => i < fix.intensity);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "var(--bg)",
          display: "flex",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Left panel — 55% */}
        <div
          style={{
            width: "55%",
            padding: "60px 56px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Category pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(94,234,212,0.12)",
                border: "1px solid rgba(94,234,212,0.3)",
                borderRadius: 999,
                paddingLeft: 14,
                paddingRight: 14,
                paddingTop: 6,
                paddingBottom: 6,
                marginBottom: 24,
                width: "fit-content",
              }}
            >
              <span
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#5EEAD4",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                {fix.category}
              </span>
            </div>

            {/* Title */}
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: fix.title.length > 40 ? 44 : fix.title.length > 25 ? 52 : 60,
                fontWeight: 500,
                color: "#F4F4F4",
                lineHeight: 1.1,
                marginBottom: 32,
                maxWidth: 560,
              }}
            >
              {fix.title}
            </div>

            {/* Status pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(244,244,244,0.06)",
                border: "1px solid rgba(244,244,244,0.14)",
                borderRadius: 999,
                paddingLeft: 14,
                paddingRight: 14,
                paddingTop: 6,
                paddingBottom: 6,
                marginBottom: 32,
                width: "fit-content",
              }}
            >
              <span
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(244,244,244,0.55)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                {fix.status}
              </span>
            </div>
          </div>

          {/* Bottom stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Days */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 72,
                  fontWeight: 500,
                  color: "#5EEAD4",
                  lineHeight: 1,
                }}
              >
                {days}
              </span>
              <span
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 18,
                  color: "#9A9A9A",
                }}
              >
                {days === 1 ? "day" : "days"}
              </span>
            </div>

            {/* Intensity blocks */}
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              {intensityBlocks.map((active, i) => (
                <div
                  key={i}
                  style={{
                    width: 18,
                    height: 28,
                    borderRadius: 4,
                    background: active ? "#5EEAD4" : "rgba(244,244,244,0.08)",
                  }}
                />
              ))}
              <span
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 13,
                  color: "#9A9A9A",
                  marginLeft: 10,
                }}
              >
                {fix.intensity}/10
              </span>
            </div>
          </div>
        </div>

        {/* Right panel — 45% */}
        <div
          style={{
            width: "45%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Lime radial glow */}
          <div
            style={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(94,234,212,0.22) 0%, rgba(94,234,212,0.06) 50%, transparent 70%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Wordmark */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 52,
                fontWeight: 500,
                color: "#F4F4F4",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              hyper
              <span style={{ color: "#5EEAD4", fontStyle: "italic" }}>fix</span>
            </div>
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 14,
                color: "rgba(244,244,244,0.45)",
                letterSpacing: "0.05em",
                textAlign: "center",
              }}
            >
              what are you unwell about?
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "rgba(244,244,244,0.07)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "18px 56px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {username ? (
            <span
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 13,
                color: "rgba(244,244,244,0.4)",
              }}
            >
              @{username}
            </span>
          ) : (
            <span />
          )}
          <span
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 13,
              color: "rgba(244,244,244,0.25)",
            }}
          >
            hyperfix.app
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
