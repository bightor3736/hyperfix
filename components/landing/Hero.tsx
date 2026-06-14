"use client";
import { useState } from "react";
import { AmbientBackdrop } from "./demo/AmbientBackdrop";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#2a2a2a 0%,#111 100%)",
  "linear-gradient(135deg,#3a3a3a 0%,#1a1a1a 100%)",
  "linear-gradient(135deg,#484848 0%,#282828 100%)",
];

function AvatarGroup() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ display: "flex" }}>
        {AVATAR_GRADIENTS.map((bg, i) => (
          <div
            key={i}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              border: "2px solid #000", background: bg,
              marginLeft: i === 0 ? 0 : -8, zIndex: AVATAR_GRADIENTS.length - i,
              position: "relative",
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
        Join people beating task paralysis
      </span>
    </div>
  );
}

export function Hero() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.location.href = `/auth/signup?email=${encodeURIComponent(email)}`;
  }

  return (
    <section
      style={{
        position: "relative", width: "100%", height: "100vh",
        overflow: "hidden", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}
    >
      {/* Ambient coded backdrop */}
      <AmbientBackdrop style={{ zIndex: 0 }} />
      {/* Bottom fade */}
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 256, zIndex: 1,
          background: "linear-gradient(to top, #000 0%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative", zIndex: 10, display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
          padding: "112px 24px 0",
          maxWidth: 900, margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <AvatarGroup />
        </div>

        <h1
          style={{
            fontSize: "clamp(40px, 8vw, 88px)",
            fontWeight: 500,
            letterSpacing: "-2px",
            color: "#ffffff",
            lineHeight: 1.05,
            marginBottom: 24,
          }}
        >
          Start the task{" "}
          <br className="hidden md:block" />
          you&apos;ve been{" "}
          <span
            style={{
              fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            avoiding.
          </span>
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "hsl(210 17% 95%)",
            maxWidth: 480,
            marginBottom: 40,
            lineHeight: 1.6,
          }}
        >
          Name it. Do 5 minutes. Earn XP for starting — not for finishing.
          Forgiving streaks that survive the hard weeks.
        </p>

        {/* Email form */}
        <form
          onSubmit={handleSubmit}
          className="liquid-glass"
          style={{
            borderRadius: 9999, padding: 8,
            display: "flex", alignItems: "center", gap: 8,
            width: "100%", maxWidth: 480,
          }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              flex: 1, minWidth: 0, background: "transparent",
              fontSize: 14, color: "#ffffff",
              padding: "10px 16px", outline: "none", border: "none",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#ffffff", color: "#000000",
              fontSize: 13, fontWeight: 700, letterSpacing: "0.05em",
              borderRadius: 9999, padding: "12px 28px",
              border: "none", cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            START FREE
          </button>
        </form>
      </div>
    </section>
  );
}
