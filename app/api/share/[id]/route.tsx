import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

export const runtime = "edge";

const W = 1080;
const H = 1920;

const PAPER = "#F4EFE6";
const INK = "#111111";
const INK_MUTED = "rgba(17,17,17,0.42)";
const INK_FAINT = "rgba(17,17,17,0.22)";
const RED = "#D72638";
const TEAL = "#0D9488";

// ─── Font cache (per edge worker instance) ────────────────────────────
let frauncesFont: ArrayBuffer | null = null;
let monoFont: ArrayBuffer | null = null;
let sansFont: ArrayBuffer | null = null;

const FONT_BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3200" : "https://hyperfix.app");

async function tryFetch(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    return res.ok ? res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

async function getFonts() {
  if (frauncesFont && monoFont && sansFont) return { frauncesFont, monoFont, sansFont };

  [frauncesFont, monoFont, sansFont] = await Promise.all([
    tryFetch(`${FONT_BASE}/fonts/Fraunces-600.ttf`),
    tryFetch(`${FONT_BASE}/fonts/JetBrainsMono-700.ttf`),
    tryFetch(`${FONT_BASE}/fonts/InstrumentSans-500.ttf`),
  ]);

  return { frauncesFont, monoFont, sansFont };
}

// ─── Helpers ─────────────────────────────────────────────────────────
function dayCount(startedAt: string, endedAt: string | null): number {
  const start = new Date(startedAt);
  const end = endedAt ? new Date(endedAt) : new Date();
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function titleFontSize(title: string): number {
  if (title.length > 50) return 80;
  if (title.length > 35) return 100;
  if (title.length > 20) return 120;
  return 140;
}

// ─── Gem mark (inline SVG for Satori) ────────────────────────────────
function GemMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="15" fill="#0A0B0D" />
      <path d="M58,32 L50,14 L32,32 Z" fill="#3CCFBA" />
      <path d="M32,58 L14,50 L32,32 Z" fill="#3CCFBA" />
      <path d="M6,32 L14,14 L32,32 Z" fill="#3CCFBA" />
      <path d="M32,6 L50,14 L32,32 Z" fill="#5EEAD4" />
      <path d="M58,32 L50,50 L32,32 Z" fill="#0D9488" />
      <path d="M50,50 L32,58 L32,32 Z" fill="#0A7A70" />
      <path d="M14,50 L6,32 L32,32 Z" fill="#0D9488" />
      <path d="M14,14 L32,6 L32,32 Z" fill="#0A7A70" />
      <path d="M43,32 L39,39 L32,43 L25,39 L21,32 L25,25 L32,21 L39,25 Z" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

// ─── Card layout ──────────────────────────────────────────────────────
function ShareCard({
  title,
  days,
  startedAt,
  intensity,
  category,
  frauncesFamily,
  monoFamily,
  sansFamily,
}: {
  title: string;
  days: number;
  startedAt: string;
  intensity: number;
  category: string;
  frauncesFamily: string;
  monoFamily: string;
  sansFamily: string;
}) {
  const fs = titleFontSize(title);
  const daysStr = String(days);
  const daysFontSize = daysStr.length >= 4 ? 280 : daysStr.length === 3 ? 320 : 360;

  return (
    <div
      style={{
        width: W,
        height: H,
        background: PAPER,
        display: "flex",
        flexDirection: "column",
        padding: "120px 96px",
        position: "relative",
      }}
    >
      {/* Subtle dot-grid texture simulation */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(17,17,17,0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          display: "flex",
        }}
      />

      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: RED,
          display: "flex",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          position: "relative",
        }}
      >
        {/* Category label */}
        <div
          style={{
            display: "flex",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              fontFamily: monoFamily,
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: INK_MUTED,
            }}
          >
            {category}
          </span>
        </div>

        {/* Label */}
        <span
          style={{
            fontFamily: monoFamily,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: INK_FAINT,
            marginBottom: 28,
          }}
        >
          currently unwell about
        </span>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 80,
          }}
        >
          <span
            style={{
              fontFamily: frauncesFamily,
              fontSize: fs,
              fontWeight: 600,
              color: INK,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            height: 1,
            background: "rgba(17,17,17,0.12)",
            marginBottom: 80,
          }}
        />

        {/* Day counter */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginBottom: 48,
          }}
        >
          <span
            style={{
              fontFamily: monoFamily,
              fontSize: daysFontSize,
              fontWeight: 700,
              color: RED,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
            }}
          >
            {daysStr}
          </span>
          <span
            style={{
              fontFamily: monoFamily,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: INK_MUTED,
              marginTop: 20,
            }}
          >
            {days === 1 ? "day" : "days"}
          </span>
        </div>

        {/* Since date */}
        <span
          style={{
            fontFamily: sansFamily,
            fontSize: 28,
            fontWeight: 500,
            color: INK_MUTED,
            letterSpacing: "-0.01em",
            marginBottom: 64,
          }}
        >
          since {formatDate(startedAt)}
        </span>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            height: 1,
            background: "rgba(17,17,17,0.12)",
            marginBottom: 48,
          }}
        />

        {/* Intensity */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: "auto",
          }}
        >
          <span
            style={{
              fontFamily: monoFamily,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: INK_FAINT,
            }}
          >
            intensity
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 56,
                  height: 20,
                  borderRadius: 4,
                  background: i < intensity ? TEAL : "rgba(17,17,17,0.12)",
                }}
              />
            ))}
            <span
              style={{
                fontFamily: monoFamily,
                fontSize: 22,
                fontWeight: 700,
                color: INK_MUTED,
                marginLeft: 16,
              }}
            >
              {intensity}/10
            </span>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 12,
          paddingTop: 48,
          borderTop: "1px solid rgba(17,17,17,0.1)",
        }}
      >
        <GemMark size={36} />
        <span
          style={{
            fontFamily: sansFamily,
            fontSize: 28,
            fontWeight: 500,
            color: INK_MUTED,
            letterSpacing: "-0.01em",
          }}
        >
          hyperfix.app
        </span>
      </div>
    </div>
  );
}

// ─── Route ───────────────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Dev test stub — renders a preview card without DB
  if (id === "_test") {
    const { frauncesFont, monoFont, sansFont } = await getFonts();
    const frauncesFamily = frauncesFont ? "Fraunces" : "Georgia, serif";
    const monoFamily = monoFont ? "JetBrains Mono" : "monospace";
    const sansFamily = sansFont ? "Instrument Sans" : "ui-sans-serif, system-ui, sans-serif";
    const fonts: ConstructorParameters<typeof ImageResponse>[1]["fonts"] = [];
    if (frauncesFont) fonts.push({ name: "Fraunces", data: frauncesFont, weight: 600, style: "normal" });
    if (monoFont) fonts.push({ name: "JetBrains Mono", data: monoFont, weight: 700, style: "normal" });
    if (sansFont) fonts.push({ name: "Instrument Sans", data: sansFont, weight: 500, style: "normal" });
    return new ImageResponse(
      <ShareCard
        title="Severance (the show)"
        days={47}
        startedAt={new Date(Date.now() - 47 * 86400000).toISOString()}
        intensity={9}
        category="TV show"
        frauncesFamily={frauncesFamily}
        monoFamily={monoFamily}
        sansFamily={sansFamily}
      />,
      { width: W, height: H, fonts }
    );
  }

  // Admin client for DB fetch (bypasses RLS)
  const admin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: fix, error } = await admin
    .from("fixes")
    .select("id, title, category, intensity, started_at, ended_at, is_public, user_id")
    .eq("id", id)
    .single();

  if (error || !fix) {
    return new Response("Not found", { status: 404 });
  }

  // Auth: public fix OR authenticated owner
  if (!fix.is_public) {
    const serverClient = await createServerClient();
    const {
      data: { user },
    } = await serverClient.auth.getUser();

    if (!user || user.id !== fix.user_id) {
      return new Response("Forbidden", { status: 403 });
    }
  }

  const days = dayCount(fix.started_at, fix.ended_at);
  const { frauncesFont, monoFont, sansFont } = await getFonts();

  const frauncesFamily = frauncesFont ? "Fraunces" : "Georgia, serif";
  const monoFamily = monoFont ? "JetBrains Mono" : "monospace";
  const sansFamily = sansFont ? "Instrument Sans" : "ui-sans-serif, system-ui, sans-serif";

  const fonts: ConstructorParameters<typeof ImageResponse>[1]["fonts"] = [];
  if (frauncesFont) fonts.push({ name: "Fraunces", data: frauncesFont, weight: 600, style: "normal" });
  if (monoFont) fonts.push({ name: "JetBrains Mono", data: monoFont, weight: 700, style: "normal" });
  if (sansFont) fonts.push({ name: "Instrument Sans", data: sansFont, weight: 500, style: "normal" });

  return new ImageResponse(
    <ShareCard
      title={fix.title}
      days={days}
      startedAt={fix.started_at}
      intensity={fix.intensity}
      category={fix.category}
      frauncesFamily={frauncesFamily}
      monoFamily={monoFamily}
      sansFamily={sansFamily}
    />,
    {
      width: W,
      height: H,
      fonts,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=3600",
      },
    }
  );
}
