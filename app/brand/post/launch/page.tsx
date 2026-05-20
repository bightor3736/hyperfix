import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["500", "700", "900"], display: "swap" });

export const metadata: Metadata = {
  title: "Hyperfix — launch posts",
  robots: { index: false, follow: false },
};

const LIME = "#A855F7";
const LIME_DEEP = "#7CB205";
const INK = "#0A0A0A";
const PAPER = "#F4F4F4";
const DIM = "#9CA3AF";
const FAINT_INK = "#1F1F22";

function Mark({ size, fg = LIME, accent = LIME_DEEP, bg = INK }: {
  size: number; fg?: string; accent?: string; bg?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill={bg} />
      <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill={fg} />
      <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill={accent} />
    </svg>
  );
}

// ─── A · LIME · centered brand intro ─────────────────────────
function PostA() {
  return (
    <div
      id="postA"
      className={inter.className}
      style={{
        width: 1080, height: 1080, background: LIME, position: "relative",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}
    >
      <Mark size={300} bg={INK} fg={LIME} accent={LIME_DEEP} />
      <div style={{
        marginTop: 56, fontSize: 156, fontWeight: 900,
        letterSpacing: -7, lineHeight: 1, color: INK,
      }}>
        Hyperfix
      </div>
      <div style={{
        position: "absolute", bottom: 64, left: 0, right: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 64px",
      }}>
        <span style={{
          fontSize: 18, fontWeight: 800, letterSpacing: 4,
          textTransform: "uppercase", color: INK, opacity: 0.6,
        }}>
          day 01 · now open
        </span>
        <span style={{
          fontSize: 18, fontWeight: 800, letterSpacing: 4,
          textTransform: "uppercase", color: INK, opacity: 0.6,
        }}>
          hyperfix.app
        </span>
      </div>
    </div>
  );
}

// ─── B · DARK · editorial statement ──────────────────────────
function PostB() {
  return (
    <div
      id="postB"
      className={inter.className}
      style={{
        width: 1080, height: 1080, background: INK, position: "relative",
        color: PAPER,
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 80px",
      }}>
        <div style={{
          fontSize: 22, fontWeight: 800, letterSpacing: 5,
          textTransform: "uppercase", color: LIME, marginBottom: 36,
        }}>
          day 01
        </div>
        <div style={{
          fontSize: 196, fontWeight: 900, letterSpacing: -11,
          lineHeight: 0.9, color: PAPER,
        }}>
          it<br />begins.
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 56, left: 80, right: 80,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: 28, borderTop: `1px solid ${FAINT_INK}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Mark size={36} />
          <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.8, color: PAPER }}>
            Hyperfix
          </span>
        </div>
        <span style={{
          fontSize: 16, fontWeight: 800, letterSpacing: 4,
          textTransform: "uppercase", color: DIM,
        }}>
          waitlist · hyperfix.app
        </span>
      </div>
    </div>
  );
}

// ─── C · LIME · big quote ────────────────────────────────────
function PostC() {
  return (
    <div
      id="postC"
      className={inter.className}
      style={{
        width: 1080, height: 1080, background: LIME, position: "relative",
        color: INK,
      }}
    >
      <div style={{ position: "absolute", inset: 0, padding: "0 80px",
        display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{
          fontSize: 32, fontWeight: 800, letterSpacing: 5,
          textTransform: "uppercase", color: INK, opacity: 0.6, marginBottom: 28,
        }}>
          for everyone who's
        </div>
        <div style={{
          fontSize: 200, fontWeight: 900, letterSpacing: -10,
          lineHeight: 0.92, color: INK,
        }}>
          unwell<br/>about<br/>something.
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 56, left: 80, right: 80,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Mark size={36} bg={INK} fg={LIME} accent={LIME_DEEP} />
          <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.8, color: INK }}>
            Hyperfix
          </span>
        </div>
        <span style={{
          fontSize: 16, fontWeight: 800, letterSpacing: 4,
          textTransform: "uppercase", color: INK, opacity: 0.6,
        }}>
          now open · hyperfix.app
        </span>
      </div>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────
export default function LaunchPosts() {
  return (
    <main className="min-h-screen flex items-center justify-center"
      style={{ background: "#3F3F46", padding: 40 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <PostA />
        <PostB />
        <PostC />
      </div>
    </main>
  );
}
