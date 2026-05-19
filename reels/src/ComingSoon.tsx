import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

const fontFamily = "'Helvetica Neue', Liberation Sans, Arial, sans-serif";

const SKY_TOP = "#3FA9F2";
const SKY_MID = "#6FC1F6";
const SKY_LOW = "#B6E0FB";
const WHITE = "#FFFFFF";

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_POP = Easing.bezier(0.2, 1.4, 0.4, 1);

// ─────────────────────────────────────────────────────────────
// Card data — mirrors the Yum Tales reference layout but for Hyperfix categories

type Card = {
  bg: string;
  fg: string;
  label: string;
  sub: string;
  stamp: string;
};

const CARDS: Card[] = [
  { bg: "#F4A93E", fg: "#1A1A1A", stamp: "HYPERFIX", label: "FANFIC", sub: "DAY 47" },
  { bg: "#3FB95A", fg: "#FFFFFF", stamp: "HYPERFIX", label: "K-POP",  sub: "BIAS ERA" },
  { bg: "#E63946", fg: "#FFFFFF", stamp: "HYPERFIX", label: "ANIME",  sub: "EP 05" },
  { bg: "#E2336B", fg: "#FFFFFF", stamp: "HYPERFIX", label: "SHIP",   sub: "DAY 89" },
  { bg: "#F2C744", fg: "#1A1A1A", stamp: "HYPERFIX", label: "FILM",   sub: "LOOP 02" },
  { bg: "#B8E04A", fg: "#1A1A1A", stamp: "HYPERFIX", label: "BOOK",   sub: "CH 17" },
];

// Clouds (pure CSS via radial gradients) — slow drift
const Sky: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame / 30) * 6; // 6px per second
  return (
    <>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${SKY_TOP} 0%, ${SKY_MID} 55%, ${SKY_LOW} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: [
            `radial-gradient(ellipse 520px 130px at ${15 + drift * 0.4}% 18%, rgba(255,255,255,0.55), transparent 60%)`,
            `radial-gradient(ellipse 700px 160px at ${85 - drift * 0.3}% 12%, rgba(255,255,255,0.5), transparent 65%)`,
            `radial-gradient(ellipse 600px 140px at ${55 + drift * 0.5}% 78%, rgba(255,255,255,0.45), transparent 65%)`,
            `radial-gradient(ellipse 480px 110px at ${25 - drift * 0.2}% 88%, rgba(255,255,255,0.4), transparent 65%)`,
          ].join(", "),
          opacity: 0.95,
        }}
      />
    </>
  );
};

// Single product-style card (rectangular, vibrant, like the bottle holders)
const ProductCard: React.FC<{
  card: Card;
  appearAt: number;
  width: number;
  height: number;
}> = ({ card, appearAt, width, height }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [appearAt, appearAt + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_POP,
  });
  const fade = interpolate(frame, [appearAt, appearAt + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // gentle bob after entry
  const bobPhase = Math.max(0, frame - (appearAt + 14));
  const bob = Math.sin(bobPhase * 0.08) * 6;

  // Tiny bottle illustration inside the card (capsule shape)
  const bottleW = width * 0.5;
  const bottleH = height * 0.62;

  return (
    <div
      style={{
        width,
        height,
        background: card.bg,
        color: card.fg,
        borderRadius: 14,
        boxShadow:
          "0 8px 0 rgba(0,0,0,0.18), 0 28px 56px -16px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 10px 14px",
        opacity: fade,
        transform: `translateY(${(1 - pop) * 40 + bob}px) scale(${0.7 + pop * 0.3})`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* top stamp */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: "0.18em",
          opacity: 0.85,
        }}
      >
        {card.stamp}
      </div>

      {/* "bottle" — capsule with a cap, hint of product */}
      <div
        style={{
          width: bottleW,
          height: bottleH,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* bottle cap */}
        <div
          style={{
            position: "absolute",
            top: -2,
            width: bottleW * 0.42,
            height: bottleH * 0.14,
            background: card.fg,
            opacity: 0.9,
            borderRadius: 4,
          }}
        />
        {/* bottle body */}
        <div
          style={{
            position: "absolute",
            top: bottleH * 0.16,
            width: bottleW * 0.78,
            height: bottleH * 0.84,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))",
            border: `2px solid ${card.fg}33`,
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            padding: 4,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: "0.04em",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            {card.label}
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.16em",
              opacity: 0.8,
            }}
          >
            {card.sub}
          </div>
        </div>
      </div>

      {/* bottom label strip */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.22em",
          opacity: 0.75,
        }}
      >
        {card.sub}
      </div>
    </div>
  );
};

// Hyperfix logomark (circle with stylised mark — propeller-ish like ref)
const Logomark: React.FC<{ appearAt: number; size: number }> = ({
  appearAt,
  size,
}) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [appearAt, appearAt + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_POP,
  });
  const bobPhase = Math.max(0, frame - (appearAt + 18));
  const bob = Math.sin(bobPhase * 0.08) * 6;
  // gentle continuous rotation of the inner mark
  const spin = (frame - appearAt) * 1.4;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 9999,
        background: WHITE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "0 8px 0 rgba(0,0,0,0.18), 0 28px 56px -16px rgba(0,0,0,0.4)",
        opacity: pop,
        transform: `translateY(${(1 - pop) * 40 + bob}px) scale(${0.6 + pop * 0.4})`,
      }}
    >
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox="-32 -32 64 64"
        style={{ transform: `rotate(${spin}deg)` }}
      >
        <g fill={SKY_TOP}>
          <ellipse cx="0" cy="-14" rx="9" ry="14" />
          <ellipse cx="0" cy="-14" rx="9" ry="14" transform="rotate(120)" />
          <ellipse cx="0" cy="-14" rx="9" ry="14" transform="rotate(240)" />
        </g>
        <circle cx="0" cy="0" r="4" fill={WHITE} />
      </svg>
    </div>
  );
};

// Headline "COMING SOON"
const ComingSoonHeadline: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [4, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 620,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: t,
        transform: `translateY(${(1 - t) * 24}px)`,
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          color: WHITE,
          fontSize: 124,
          fontWeight: 900,
          letterSpacing: "0.03em",
          lineHeight: 1,
          textShadow: "0 4px 0 rgba(0,0,0,0.08)",
        }}
      >
        COMING SOON
      </div>
    </div>
  );
};

// "LOADING..." with cycling dots
const LoadingLine: React.FC<{ startAt: number }> = ({ startAt }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [startAt, startAt + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  // active dot index cycles 0..3
  const cycle = Math.floor((frame - startAt) / 8) % 4;
  return (
    <div
      style={{
        position: "absolute",
        top: 1200,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: t,
        transform: `translateY(${(1 - t) * 16}px)`,
        color: WHITE,
        fontSize: 86,
        fontWeight: 900,
        letterSpacing: "0.32em",
        textShadow: "0 3px 0 rgba(0,0,0,0.08)",
      }}
    >
      LOADING
      <span style={{ display: "inline-block", width: 110, textAlign: "left" }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ opacity: i < cycle ? 1 : 0.25 }}>
            .
          </span>
        ))}
      </span>
    </div>
  );
};

// Tagline at bottom
const Tagline: React.FC<{ startAt: number }> = ({ startAt }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [startAt, startAt + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 280,
        left: 80,
        right: 80,
        textAlign: "center",
        color: WHITE,
        opacity: t,
        transform: `translateY(${(1 - t) * 16}px)`,
      }}
    >
      <div
        style={{
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: "-0.01em",
          lineHeight: 1.18,
          textShadow: "0 2px 0 rgba(0,0,0,0.08)",
        }}
      >
        a journal for whatever is<br />
        currently running your life.
      </div>
      <div
        style={{
          marginTop: 30,
          fontSize: 30,
          fontWeight: 900,
          letterSpacing: "0.32em",
        }}
      >
        HYPERFIX.APP
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main composition

export const ComingSoon: React.FC = () => {
  // card row layout
  const cardW = 124;
  const cardH = 188;
  const gap = 16;
  const logoSize = 140;
  const rowWidth = CARDS.length * cardW + (CARDS.length - 1) * gap + gap + logoSize;
  const rowTop = 870;
  const startX = (1080 - rowWidth) / 2;

  return (
    <AbsoluteFill style={{ background: SKY_TOP, fontFamily }}>
      <Sky />

      <ComingSoonHeadline />

      {/* card row */}
      <div
        style={{
          position: "absolute",
          top: rowTop,
          left: 0,
          right: 0,
          height: cardH,
        }}
      >
        {CARDS.map((card, i) => (
          <div
            key={card.label}
            style={{
              position: "absolute",
              top: 0,
              left: startX + i * (cardW + gap),
            }}
          >
            <ProductCard
              card={card}
              appearAt={28 + i * 6}
              width={cardW}
              height={cardH}
            />
          </div>
        ))}
        {/* logomark */}
        <div
          style={{
            position: "absolute",
            top: (cardH - logoSize) / 2,
            left: startX + CARDS.length * (cardW + gap),
          }}
        >
          <Logomark appearAt={28 + CARDS.length * 6} size={logoSize} />
        </div>
      </div>

      <LoadingLine startAt={28 + (CARDS.length + 1) * 6 + 10} />
      <Tagline startAt={28 + (CARDS.length + 1) * 6 + 28} />
    </AbsoluteFill>
  );
};
