import type { Metadata } from "next";
import { LogoMark, LogoTile, LogoWordmark, LogoLockup } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Hyperfix Brand Guidelines",
  description: "Internal brand reference — colors, typography, voice, and logo marks.",
  robots: { index: false, follow: false },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono text-[11px] uppercase tracking-[0.18em]"
      style={{ color: "var(--ink-faint)" }}
    >
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-display mt-2 text-[28px] font-medium leading-tight tracking-tight"
      style={{ color: "var(--ink)" }}
    >
      {children}
    </h2>
  );
}

function Divider() {
  return <hr style={{ borderColor: "var(--line)", marginTop: "80px", marginBottom: "80px" }} />;
}

// ─── Color Swatch ─────────────────────────────────────────────────────────────

interface SwatchProps {
  hex: string;
  token: string;
  label: string;
  textColor?: string;
}

function Swatch({ hex, token, label, textColor = "#fff" }: SwatchProps) {
  return (
    <div
      className="overflow-hidden rounded-[14px]"
      style={{ border: "1px solid var(--line)" }}
    >
      <div
        className="flex h-20 items-end p-3"
        style={{ background: hex }}
      >
        <span
          className="font-mono text-[10px] font-medium leading-none tracking-wide opacity-80"
          style={{ color: textColor }}
        >
          {hex}
        </span>
      </div>
      <div className="px-3 py-2.5" style={{ background: "var(--bg-elevated)" }}>
        <p className="text-[12px] font-semibold" style={{ color: "var(--ink)" }}>{label}</p>
        <p className="font-mono text-[10px] mt-0.5" style={{ color: "var(--ink-faint)" }}>{token}</p>
      </div>
    </div>
  );
}

function SwatchGroup({ title, swatches }: { title: string; swatches: SwatchProps[] }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: "var(--ink-faint)" }}>
        {title}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {swatches.map((s) => (
          <Swatch key={s.token} {...s} />
        ))}
      </div>
    </div>
  );
}

// ─── Voice Principle Card ────────────────────────────────────────────────────

interface VoiceCardProps {
  principle: string;
  description: string;
  example: string;
}

function VoiceCard({ principle, description, example }: VoiceCardProps) {
  return (
    <div
      className="rounded-[16px] p-5"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
    >
      <p
        className="font-display text-[15px] font-medium leading-tight"
        style={{ color: "var(--accent)" }}
      >
        {principle}
      </p>
      <p className="mt-1.5 text-[12px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
        {description}
      </p>
      <div
        className="mt-3 rounded-[8px] px-3 py-2"
        style={{ background: "var(--bg-soft)", border: "1px solid var(--line)" }}
      >
        <p className="font-mono text-[11px] leading-relaxed" style={{ color: "var(--ink-faint)" }}>
          &ldquo;{example}&rdquo;
        </p>
      </div>
    </div>
  );
}

// ─── Level Badge ─────────────────────────────────────────────────────────────

interface LevelBadgeProps {
  number: number;
  name: string;
  xp: string;
  color: string;
  isLast?: boolean;
}

function LevelBadge({ number, name, xp, color, isLast }: LevelBadgeProps) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-bold"
        style={{ background: color + "22", color, border: `1.5px solid ${color}55` }}
      >
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-display text-[15px] font-medium" style={{ color: "var(--ink)" }}>
            {name}
          </span>
          <span className="font-mono text-[11px]" style={{ color: "var(--ink-faint)" }}>{xp}</span>
        </div>
        {!isLast && (
          <div
            className="mt-1.5 h-[2px] w-full rounded-full"
            style={{ background: `linear-gradient(to right, ${color}55, transparent)` }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BrandPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      {/* ── Header ── */}
      <div
        className="border-b px-6 py-5 sm:px-10"
        style={{ borderColor: "var(--line)", background: "var(--bg-elevated)" }}
      >
        <div className="mx-auto flex max-w-[1100px] items-center justify-between">
          <LogoLockup size="sm" />
          <span
            className="font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "var(--ink-faint)" }}
          >
            Brand Guidelines · Internal
          </span>
        </div>
      </div>

      {/* ── Hero ── */}
      <div
        className="border-b px-6 py-20 sm:px-10"
        style={{ borderColor: "var(--line)", background: "var(--bg-soft)" }}
      >
        <div className="mx-auto max-w-[1100px]">
          <SectionEyebrow>Hyperfix · Brand System</SectionEyebrow>
          <h1
            className="font-display mt-3 text-[48px] font-medium leading-[1.05] tracking-tight sm:text-[64px]"
            style={{ color: "var(--ink)" }}
          >
            Design language<br />
            <span className="text-game-gradient">for brains that run hot.</span>
          </h1>
          <p
            className="mt-5 max-w-[520px] text-[16px] leading-relaxed"
            style={{ color: "var(--ink-muted)" }}
          >
            Warm, forgiving, a little obsessive. This page is the single source of truth
            for the Hyperfix visual identity — colors, type, voice, and marks.
          </p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-[1100px] px-6 py-20 sm:px-10">

        {/* ══ Section 1: Logomark ════════════════════════════════════════════ */}
        <section id="logo">
          <SectionEyebrow>01 — Logo</SectionEyebrow>
          <SectionTitle>The Bloom Mark</SectionTitle>
          <p className="mt-3 max-w-[540px] text-[14px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
            Four petals radiating outward from a dominant focal-point center. The larger center
            represents hyperfixation — intense focus — while petals radiate the energy outward.
            Single colour, legible from 16 px favicon to hero.
          </p>

          {/* Mark at sizes */}
          <div
            className="mt-10 rounded-[20px] p-8"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
          >
            <p className="font-mono text-[11px] uppercase tracking-widest mb-6" style={{ color: "var(--ink-faint)" }}>
              LogoMark — teal energy accent
            </p>
            <div className="flex flex-wrap items-end gap-8">
              {([16, 24, 32, 48, 64] as const).map((sz) => (
                <div key={sz} className="flex flex-col items-center gap-2">
                  <LogoMark size={sz} color="var(--accent)" />
                  <span className="font-mono text-[10px]" style={{ color: "var(--ink-faint)" }}>{sz}px</span>
                </div>
              ))}
            </div>
          </div>

          {/* LogoTile */}
          <div
            className="mt-4 rounded-[20px] p-8"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
          >
            <p className="font-mono text-[11px] uppercase tracking-widest mb-6" style={{ color: "var(--ink-faint)" }}>
              LogoTile — rounded app icon
            </p>
            <div className="flex flex-wrap items-end gap-8">
              {([40, 64] as const).map((sz) => (
                <div key={sz} className="flex flex-col items-center gap-2">
                  <LogoTile size={sz} />
                  <span className="font-mono text-[10px]" style={{ color: "var(--ink-faint)" }}>{sz}px</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wordmark + Lockup */}
          <div
            className="mt-4 rounded-[20px] p-8"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
          >
            <p className="font-mono text-[11px] uppercase tracking-widest mb-6" style={{ color: "var(--ink-faint)" }}>
              LogoWordmark + LogoLockup
            </p>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px]" style={{ color: "var(--ink-faint)" }}>Wordmark only</span>
                <LogoWordmark />
              </div>
              <div className="flex flex-wrap items-end gap-10">
                {(["sm", "md", "lg"] as const).map((sz) => (
                  <div key={sz} className="flex flex-col gap-1.5">
                    <span className="font-mono text-[10px]" style={{ color: "var(--ink-faint)" }}>Lockup — {sz}</span>
                    <LogoLockup size={sz} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ══ Section 2: Color Palette ══════════════════════════════════════ */}
        <section id="colors">
          <SectionEyebrow>02 — Colors</SectionEyebrow>
          <SectionTitle>Warm organic palette</SectionTitle>
          <p className="mt-3 max-w-[540px] text-[14px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
            Warm near-white canvas, deep warm-brown ink, earthy hairlines. Teal accent from the green direction.
            Violet for XP and achievements — special, distinct, elevated.
          </p>

          <div className="mt-10 flex flex-col gap-10">
            <SwatchGroup
              title="Canvas"
              swatches={[
                { hex: "#f9f8f7", token: "--bg", label: "Background", textColor: "#453f3d" },
                { hex: "#f4f0eb", token: "--bg-soft", label: "Background Soft", textColor: "#453f3d" },
                { hex: "#ffffff", token: "--bg-elevated", label: "Background Elevated", textColor: "#453f3d" },
              ]}
            />
            <SwatchGroup
              title="Ink"
              swatches={[
                { hex: "#1a1615", token: "--ink", label: "Ink", textColor: "#f9f8f7" },
                { hex: "#453f3d", token: "--ink-muted", label: "Ink Muted", textColor: "#f9f8f7" },
                { hex: "#757170", token: "--ink-faint", label: "Ink Faint", textColor: "#f9f8f7" },
              ]}
            />
            <SwatchGroup
              title="Brand"
              swatches={[
                { hex: "#14b8a6", token: "--accent", label: "Teal (primary)", textColor: "#fff" },
                { hex: "#e4f7f5", token: "--accent-soft", label: "Teal Soft", textColor: "#453f3d" },
                { hex: "#7c3aed", token: "--xp / --violet", label: "Violet (XP)", textColor: "#fff" },
                { hex: "#ede9ff", token: "--xp-soft / --violet-soft", label: "Violet Soft", textColor: "#453f3d" },
                { hex: "#c9502e", token: "--flame", label: "Flame (streaks)", textColor: "#fff" },
                { hex: "#fbe9e4", token: "--flame-soft", label: "Flame Soft", textColor: "#453f3d" },
              ]}
            />
            <SwatchGroup
              title="Reward Accents"
              swatches={[
                { hex: "#1cb87c", token: "--reward-mint", label: "Mint", textColor: "#fff" },
                { hex: "#d6f7ec", token: "--reward-mint-soft", label: "Mint Soft", textColor: "#453f3d" },
                { hex: "#d6a314", token: "--reward-amber", label: "Amber", textColor: "#fff" },
                { hex: "#fdf2d0", token: "--reward-amber-soft", label: "Amber Soft", textColor: "#453f3d" },
              ]}
            />
            <SwatchGroup
              title="Warm Pastels"
              swatches={[
                { hex: "#ede9ff", token: "--pastel-purple", label: "Pastel Purple", textColor: "#453f3d" },
                { hex: "#fde8ee", token: "--pastel-pink", label: "Pastel Pink", textColor: "#453f3d" },
                { hex: "#e2ecf7", token: "--pastel-blue", label: "Pastel Blue", textColor: "#453f3d" },
                { hex: "#d8f3e8", token: "--pastel-green", label: "Pastel Green", textColor: "#453f3d" },
                { hex: "#fde8da", token: "--pastel-orange", label: "Pastel Orange", textColor: "#453f3d" },
                { hex: "#fdf2d0", token: "--pastel-yellow", label: "Pastel Yellow", textColor: "#453f3d" },
              ]}
            />
          </div>
        </section>

        <Divider />

        {/* ══ Section 3: Typography ═════════════════════════════════════════ */}
        <section id="typography">
          <SectionEyebrow>03 — Typography</SectionEyebrow>
          <SectionTitle>Type system</SectionTitle>
          <p className="mt-3 max-w-[540px] text-[14px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
            Fraunces for display — warm, optical, slightly literary. Lexend for body — engineered
            for reading ease, excellent for ADHD legibility. JetBrains Mono for labels and tokens.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {/* Display / Fraunces */}
            <div
              className="rounded-[20px] p-8"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
            >
              <p className="font-mono text-[11px] uppercase tracking-widest mb-5" style={{ color: "var(--ink-faint)" }}>
                Display — Fraunces · font-display
              </p>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-mono text-[10px] mb-1" style={{ color: "var(--ink-faint)" }}>64px / leading-tight / medium</p>
                  <p className="font-display font-medium leading-tight tracking-tight" style={{ fontSize: 64, color: "var(--ink)" }}>
                    Track the fix.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] mb-1" style={{ color: "var(--ink-faint)" }}>40px / heading-1</p>
                  <p className="font-display font-medium leading-tight tracking-tight text-[40px]" style={{ color: "var(--ink)" }}>
                    Your brain on a quest
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] mb-1" style={{ color: "var(--ink-faint)" }}>28px / heading-2</p>
                  <p className="font-display font-medium leading-snug text-[28px]" style={{ color: "var(--ink)" }}>
                    Hyperfixation isn&rsquo;t a flaw
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] mb-1" style={{ color: "var(--ink-faint)" }}>20px / heading-3</p>
                  <p className="font-display font-medium text-[20px]" style={{ color: "var(--ink)" }}>
                    It&rsquo;s a superpower with a focus problem
                  </p>
                </div>
              </div>
            </div>

            {/* Body / Lexend */}
            <div
              className="rounded-[20px] p-8"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
            >
              <p className="font-mono text-[11px] uppercase tracking-widest mb-5" style={{ color: "var(--ink-faint)" }}>
                Body — Lexend · font-sans
              </p>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-mono text-[10px] mb-1" style={{ color: "var(--ink-faint)" }}>16px / body-lg</p>
                  <p className="text-[16px] leading-relaxed" style={{ color: "var(--ink)" }}>
                    ADHD accountability that actually works. Track your hyperfixations, earn XP, keep a streak that forgives you.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] mb-1" style={{ color: "var(--ink-faint)" }}>14px / body (default)</p>
                  <p className="text-[14px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                    Log what you&rsquo;re obsessed with right now. Deep dives earn XP. Streaks are forgiven. No judgment,
                    just accountability that fits how your brain actually runs.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] mb-1" style={{ color: "var(--ink-faint)" }}>12px / caption</p>
                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--ink-faint)" }}>
                    Free to start · no credit card · 60 seconds to your first quest
                  </p>
                </div>
              </div>
            </div>

            {/* Mono */}
            <div
              className="rounded-[20px] p-8"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
            >
              <p className="font-mono text-[11px] uppercase tracking-widest mb-5" style={{ color: "var(--ink-faint)" }}>
                Mono — JetBrains Mono · font-mono
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { size: "13px", label: "label / badge", text: "LEVEL 4 · DEEPLY INVESTED" },
                  { size: "11px", label: "eyebrow / token", text: "01 — BRAND COLORS · CSS VARIABLES" },
                  { size: "10px", label: "micro / data", text: "--accent: #14b8a6 · teal primary" },
                ].map(({ size, label, text }) => (
                  <div key={label}>
                    <p className="font-mono text-[10px] mb-1" style={{ color: "var(--ink-faint)" }}>{size} / {label}</p>
                    <p className="font-mono uppercase tracking-wider" style={{ fontSize: size, color: "var(--ink)" }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ══ Section 4: Voice & Tone ═══════════════════════════════════════ */}
        <section id="voice">
          <SectionEyebrow>04 — Voice & Tone</SectionEyebrow>
          <SectionTitle>How Hyperfix speaks</SectionTitle>
          <p className="mt-3 max-w-[540px] text-[14px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
            Hyperfix is your most enthusiastic friend who also has ADHD. We celebrate the obsession,
            forgive the drift, and never make you feel broken. Warm, playful, honest — never clinical.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <VoiceCard
              principle="Warm, never cold"
              description="Avoid clinical language. We're a friend, not a therapist or a productivity guru."
              example="Your brain runs hot. That's not a bug."
            />
            <VoiceCard
              principle="Celebratory, not performative"
              description="Genuine excitement for progress — even tiny progress. Avoid hollow hype."
              example="+40 XP. That deep dive actually counted."
            />
            <VoiceCard
              principle="Forgiving by design"
              description="Streaks freeze. Resets happen. The app never shames — it picks you back up."
              example="Streak frozen. You're still in the game."
            />
            <VoiceCard
              principle="Playful but precise"
              description="Game language (quests, XP, levels) but always grounded in real benefit."
              example="Your first quest is waiting. No credit card, 60 seconds."
            />
            <VoiceCard
              principle="Short and punchy"
              description="ADHD brains scan — they don't read walls. One idea per sentence. Active verbs."
              example="Track the fix. Earn the XP. Beat the drift."
            />
            <VoiceCard
              principle="Never condescending"
              description="Hyperfixation isn't a symptom to manage, it's a superpower to channel. We mean it."
              example="You don't need fixing. Your focus just needs direction."
            />
          </div>
        </section>

        <Divider />

        {/* ══ Section 5: Level Names ═════════════════════════════════════════ */}
        <section id="levels">
          <SectionEyebrow>05 — Progression</SectionEyebrow>
          <SectionTitle>Level names</SectionTitle>
          <p className="mt-3 max-w-[540px] text-[14px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
            Seven levels from curious newcomer to full obsession. Each name escalates in a way
            that makes &ldquo;Clinically Obsessed&rdquo; feel like a badge of honour, not a diagnosis.
          </p>

          <div
            className="mt-10 rounded-[20px] p-8"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
          >
            <div className="flex flex-col gap-5">
              <LevelBadge number={1} name="Mildly Curious" xp="0 – 99 XP" color="#757170" />
              <LevelBadge number={2} name="Getting Hooked" xp="100 – 299 XP" color="#14b8a6" />
              <LevelBadge number={3} name="Deeply Invested" xp="300 – 699 XP" color="#1cb87c" />
              <LevelBadge number={4} name="Fully Committed" xp="700 – 1 499 XP" color="#d6a314" />
              <LevelBadge number={5} name="Can&rsquo;t Stop Won&rsquo;t Stop" xp="1 500 – 2 999 XP" color="#c9502e" />
              <LevelBadge number={6} name="Send Help" xp="3 000 – 5 999 XP" color="#7c3aed" />
              <LevelBadge number={7} name="Clinically Obsessed" xp="6 000+ XP" color="#a78bfa" isLast />
            </div>
          </div>
        </section>

      </div>

      {/* ── Footer ── */}
      <div
        className="border-t px-6 py-8 sm:px-10"
        style={{ borderColor: "var(--line)", background: "var(--bg-soft)" }}
      >
        <div className="mx-auto flex max-w-[1100px] items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <LogoMark size={16} color="var(--accent)" />
            <span className="font-mono text-[11px]" style={{ color: "var(--ink-faint)" }}>
              Hyperfix Brand System · Internal use only
            </span>
          </div>
          <span className="font-mono text-[11px]" style={{ color: "var(--ink-faint)" }}>
            Not linked from nav · /brand
          </span>
        </div>
      </div>
    </div>
  );
}
