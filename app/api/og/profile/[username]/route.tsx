import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const runtime = "edge";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function dayCount(startedAt: string): number {
  const start = new Date(startedAt);
  const now = new Date();
  return Math.max(1, Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return ((parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")).toUpperCase();
  }
  return (name[0] ?? "").toUpperCase();
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name, username, bio, avatar_url")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    return new Response("Not found", { status: 404 });
  }

  // Fetch fix count (active)
  const { count: fixCount } = await supabase
    .from("fixes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .is("ended_at", null);

  // Fetch graveyard count (ended)
  const { count: graveyardCount } = await supabase
    .from("fixes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .not("ended_at", "is", null);

  // Fetch top (longest active) fix
  const { data: topFixRows } = await supabase
    .from("fixes")
    .select("id, title, started_at")
    .eq("user_id", profile.id)
    .is("ended_at", null)
    .order("started_at", { ascending: true })
    .limit(1);

  const topFix = topFixRows?.[0] ?? null;

  const displayName = profile.display_name ?? profile.username ?? username;
  const initials = getInitials(displayName);
  const activeFixes = fixCount ?? 0;
  const endedFixes = graveyardCount ?? 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#070708",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Teal radial glow at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: "50%",
            transform: "translateX(-50%)",
            width: 900,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(94,234,212,0.18) 0%, rgba(94,234,212,0.07) 40%, transparent 70%)",
          }}
        />

        {/* Main content row */}
        <div
          style={{
            display: "flex",
            flex: 1,
            padding: "64px 72px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Left side — 60% */}
          <div
            style={{
              width: "60%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingRight: 48,
            }}
          >
            {/* Avatar */}
            <div style={{ display: "flex", marginBottom: 28 }}>
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  width={64}
                  height={64}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid rgba(94,234,212,0.3)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "rgba(94,234,212,0.12)",
                    border: "2px solid rgba(94,234,212,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#5EEAD4",
                    fontSize: 22,
                    fontWeight: 700,
                    fontFamily: "ui-sans-serif, system-ui, sans-serif",
                  }}
                >
                  {initials}
                </div>
              )}
            </div>

            {/* Display name */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: "#F4F4F4",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: 10,
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
              }}
            >
              {displayName}
            </div>

            {/* @username */}
            <div
              style={{
                fontSize: 20,
                color: "rgba(94,234,212,0.7)",
                marginBottom: profile.bio ? 20 : 28,
                fontFamily: "ui-monospace, monospace",
              }}
            >
              @{profile.username ?? username}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div
                style={{
                  fontSize: 16,
                  color: "rgba(244,244,244,0.5)",
                  lineHeight: 1.5,
                  marginBottom: 28,
                  maxWidth: 560,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontFamily: "ui-sans-serif, system-ui, sans-serif",
                }}
              >
                {profile.bio}
              </div>
            )}

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "ui-monospace, monospace",
                fontSize: 13,
                color: "rgba(244,244,244,0.4)",
              }}
            >
              <span style={{ color: "rgba(94,234,212,0.8)" }}>{activeFixes}</span>
              <span> active</span>
              <span style={{ color: "rgba(244,244,244,0.2)", margin: "0 4px" }}>·</span>
              <span style={{ color: "rgba(244,244,244,0.6)" }}>{endedFixes}</span>
              <span> in graveyard</span>
            </div>
          </div>

          {/* Right side — 40% */}
          <div
            style={{
              width: "40%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              position: "relative",
            }}
          >
            {/* Subtle glow behind the right panel */}
            <div
              style={{
                position: "absolute",
                width: 320,
                height: 320,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(94,234,212,0.1) 0%, transparent 70%)",
              }}
            />

            {/* Wordmark */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#5EEAD4",
                  letterSpacing: "-0.02em",
                  fontFamily: "ui-sans-serif, system-ui, sans-serif",
                }}
              >
                hyperfix
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(244,244,244,0.4)",
                  fontFamily: "ui-sans-serif, system-ui, sans-serif",
                  textAlign: "center",
                }}
              >
                what are you obsessed with?
              </div>
            </div>

            {/* Top fix mini card */}
            {topFix && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  background: "rgba(94,234,212,0.06)",
                  border: "1px solid rgba(94,234,212,0.2)",
                  borderRadius: 14,
                  padding: "16px 20px",
                  width: "80%",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 10,
                    color: "rgba(94,234,212,0.6)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                  }}
                >
                  longest active
                </div>
                <div
                  style={{
                    fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#F4F4F4",
                    lineHeight: 1.3,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {topFix.title}
                </div>
                <div
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 13,
                    color: "#5EEAD4",
                  }}
                >
                  day {dayCount(topFix.started_at)}
                </div>
              </div>
            )}
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
            padding: "14px 72px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
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
