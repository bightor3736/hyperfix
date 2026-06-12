import type { Metadata } from "next";
import { LogoMark, LogoTile, LogoWordmark, LogoLockup } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Hyperfix Brand Guidelines",
  description: "Internal brand reference — dark monochrome system: colors, type, voice, marks.",
  robots: { index: false, follow: false },
};

const BW = "1px solid rgba(255,255,255,0.08)";
const CARD_BG = "rgba(255,255,255,0.03)";
const MUTED = "rgba(255,255,255,0.55)";
const FAINT = "rgba(255,255,255,0.35)";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="uppercase"
      style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: FAINT }}
    >
      {children}
    </span>
  );
}

function Box({ children, color = CARD_BG, className = "" }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <div className={className} style={{ background: color, border: BW, borderRadius: 16 }}>
      {children}
    </div>
  );
}

// ── Color swatch ──
function Swatch({ hex, token, label, dark }: { hex: string; token: string; label: string; dark?: boolean }) {
  return (
    <div style={{ border: BW, borderRadius: 16, overflow: "hidden" }}>
      <div className="flex h-20 items-end p-2" style={{ background: hex }}>
        <span className="font-mono text-[10px] font-bold" style={{ color: dark ? "#fff" : "#000" }}>{hex}</span>
      </div>
      <div className="px-3 py-2" style={{ background: CARD_BG, borderTop: BW }}>
        <p className="text-[13px] font-bold" style={{ color: "#ffffff" }}>{label}</p>
        <p className="font-mono text-[10px]" style={{ color: FAINT }}>{token}</p>
      </div>
    </div>
  );
}

const LEVELS = [
  { n: 1, name: "Mildly Curious", xp: "0 XP", color: "rgba(255,255,255,0.15)" },
  { n: 2, name: "Interested", xp: "50 XP", color: "rgba(255,255,255,0.25)" },
  { n: 3, name: "Invested", xp: "150 XP", color: "rgba(255,255,255,0.35)" },
  { n: 4, name: "Hooked", xp: "400 XP", color: "rgba(255,255,255,0.5)" },
  { n: 5, name: "Unwell", xp: "900 XP", color: "rgba(255,255,255,0.65)" },
  { n: 6, name: "Feral", xp: "2 000 XP", color: "rgba(255,255,255,0.8)" },
  { n: 7, name: "Clinically Obsessed", xp: "5 000 XP", color: "#A78BFA" },
];

const VOICE = [
  { p: "Direct", d: "Short, punchy, no padding. ADHD brains don't read fluff.", ex: "Log it — +10 XP" },
  { p: "Non-judgmental", d: "Celebrate showing up, not perfection. Never shame.", ex: "Day 4 missed — freeze used. Streak intact." },
  { p: "Celebrates obsession", d: "Hyperfixation is a feature, not a bug.", ex: "Named him Gerald, obviously." },
  { p: "Irreverent", d: "Level names are unapologetically specific.", ex: "Clinically Obsessed · Made for brains that run hot." },
  { p: "Forgiving", d: "Streak freezes, no reset to zero, no guilt.", ex: "ADHD isn't linear, so your streak shouldn't snap." },
  { p: "Proof-first", d: "XP only drops when you've done something real.", ex: "Claim +8 XP (after the timer)" },
];

export default function BrandPage() {
  return (
    <div style={{ background: "#000000", color: "#ffffff" }}>
      <div className="mx-auto max-w-[1100px] px-6 py-16 sm:px-10">

        {/* Header */}
        <div className="mb-20">
          <Eyebrow>Brand guidelines · internal</Eyebrow>
          <h1 className="mt-5 leading-[0.95]" style={{ fontSize: "clamp(48px,8vw,96px)", fontWeight: 500, letterSpacing: "-0.03em", color: "#ffffff" }}>
            hyperfix
            <span className="inline-block ml-3 align-middle"><LogoMark size={64} color="#ffffff" /></span>
          </h1>
          <p className="mt-5 max-w-[560px] text-[18px] font-medium leading-[1.5]" style={{ color: MUTED }}>
            Dark monochrome design system. Pure black canvas, hairline borders,
            white type, one{" "}
            <span style={{ fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)", fontStyle: "italic", fontWeight: 400, color: "#ffffff" }}>
              serif italic
            </span>{" "}
            accent. Color is reserved for gamification only.
          </p>
        </div>

        {/* 1. LOGO */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: FAINT }}>01</p>
          <h2 className="mb-8 text-[34px] font-bold tracking-tight" style={{ color: "#ffffff" }}>Logo — the focus-lock mark</h2>

          <Box className="mb-4 p-8">
            <p className="font-mono text-[11px] font-bold uppercase tracking-widest mb-6" style={{ color: FAINT }}>Mark · corner brackets clamping a locked-on center</p>
            <div className="flex flex-wrap items-end gap-8">
              {[16, 24, 32, 48, 64, 88].map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <LogoMark size={s} color="#ffffff" />
                  <span className="font-mono text-[10px]" style={{ color: FAINT }}>{s}px</span>
                </div>
              ))}
            </div>
          </Box>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Box className="p-8">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest mb-6" style={{ color: FAINT }}>App tile · monochrome variants</p>
              <div className="flex flex-wrap items-end gap-4">
                <LogoTile size={56} tile="#ffffff" />
                <LogoTile size={56} tile="rgba(255,255,255,0.15)" />
                <LogoTile size={56} tile="rgba(255,255,255,0.06)" />
                <LogoTile size={56} tile="#000000" />
              </div>
            </Box>
            <Box className="p-8">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest mb-6" style={{ color: FAINT }}>Wordmark + lockup</p>
              <div className="flex flex-col gap-5">
                <LogoWordmark size="lg" />
                <LogoLockup size="md" />
              </div>
            </Box>
          </div>
        </section>

        {/* 2. COLORS */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: FAINT }}>02</p>
          <h2 className="mb-8 text-[34px] font-bold tracking-tight" style={{ color: "#ffffff" }}>Color — monochrome first</h2>

          <p className="font-mono text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: FAINT }}>Canvas + ink</p>
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            <Swatch hex="#000000" token="--bg" label="Black" dark />
            <Swatch hex="#0a0a0a" token="--bg-2" label="Soft" dark />
            <Swatch hex="#1a1a1a" token="--bg-elevated" label="Card" dark />
            <Swatch hex="#FFFFFF" token="--ink" label="Ink" />
            <Swatch hex="rgba(255,255,255,0.55)" token="--ink-muted" label="Muted" dark />
            <Swatch hex="rgba(255,255,255,0.35)" token="--ink-faint" label="Faint" dark />
          </div>

          <p className="font-mono text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: FAINT }}>Gamification — the only color allowed</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            <Swatch hex="#A78BFA" token="--xp" label="Violet · XP" dark />
            <Swatch hex="#F97316" token="--flame" label="Orange · streak" dark />
          </div>
        </section>

        {/* 3. SURFACES & DIVIDERS */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: FAINT }}>03</p>
          <h2 className="mb-8 text-[34px] font-bold tracking-tight" style={{ color: "#ffffff" }}>Surfaces, borders & dividers</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="p-6" style={{ background: CARD_BG, border: BW, borderRadius: 16 }}>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: FAINT }}>Card</p>
              <p className="text-[15px] font-bold" style={{ color: "#ffffff" }}>rgba(255,255,255,0.03) · 1px border 0.08 · radius 16</p>
            </div>
            <div className="liquid-glass p-6" style={{ borderRadius: 16 }}>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: FAINT }}>.liquid-glass</p>
              <p className="text-[15px] font-bold" style={{ color: "#ffffff" }}>Secondary buttons & chips</p>
            </div>
            <button className="p-6 text-[15px]" style={{ background: "#ffffff", color: "#000000", fontWeight: 600, border: "none", borderRadius: 16, cursor: "pointer" }}>
              Primary button (white on black)
            </button>
          </div>
        </section>

        {/* 4. TYPE */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: FAINT }}>04</p>
          <h2 className="mb-8 text-[34px] font-bold tracking-tight" style={{ color: "#ffffff" }}>Typography</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Box className="p-8">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: FAINT }}>Display + body — Space Grotesk</p>
              <p style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.04em", color: "#ffffff" }}>Aa</p>
              <p className="mt-2 text-[32px] font-bold tracking-tight" style={{ color: "#ffffff" }}>
                Clinically{" "}
                <span style={{ fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)", fontStyle: "italic", fontWeight: 400 }}>Obsessed</span>
              </p>
              <p className="mt-3 text-[15px] font-medium leading-[1.6]" style={{ color: MUTED }}>
                Used for everything — headlines, body, buttons, the wordmark. One serif italic accent word per big heading.
              </p>
            </Box>
            <Box className="p-8">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: FAINT }}>Mono — JetBrains Mono</p>
              <p className="font-mono" style={{ fontSize: 44, fontWeight: 600, color: "#ffffff" }}>01:24</p>
              <p className="mt-2 font-mono text-[13px] font-bold uppercase tracking-widest" style={{ color: "#ffffff" }}>DEEP DIVE · +8 XP · STREAK</p>
              <p className="mt-3 text-[15px] font-medium leading-[1.6]" style={{ color: MUTED }}>
                Used for: labels, eyebrows, stats, pill tags, counters, timers.
              </p>
            </Box>
          </div>
        </section>

        {/* 5. VOICE */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: FAINT }}>05</p>
          <h2 className="mb-2 text-[34px] font-bold tracking-tight" style={{ color: "#ffffff" }}>Voice &amp; tone</h2>
          <p className="mb-8 max-w-[560px] text-[15px] font-medium" style={{ color: MUTED }}>
            Sounds like a friend who has ADHD, gets ADHD, and isn&apos;t precious about it.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VOICE.map((v) => (
              <Box key={v.p} className="p-5">
                <p className="text-[16px] font-bold" style={{ color: "#ffffff" }}>{v.p}</p>
                <p className="mt-1 text-[13px] font-medium leading-[1.5]" style={{ color: MUTED }}>{v.d}</p>
                <p className="mt-3 px-3 py-2 font-mono text-[12px]" style={{ background: "rgba(255,255,255,0.06)", border: BW, borderRadius: 10, color: "rgba(255,255,255,0.75)" }}>
                  &ldquo;{v.ex}&rdquo;
                </p>
              </Box>
            ))}
          </div>
        </section>

        {/* 6. LEVELS */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: FAINT }}>06</p>
          <h2 className="mb-8 text-[34px] font-bold tracking-tight" style={{ color: "#ffffff" }}>Level names · 7 tiers</h2>
          <div className="flex flex-col gap-3">
            {LEVELS.map((l) => (
              <div key={l.n} className="flex items-center gap-4 p-4" style={{ background: CARD_BG, border: BW, borderRadius: 16 }}>
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center font-mono text-[14px] font-bold"
                  style={{ background: l.color, color: l.n >= 5 ? "#000000" : "#ffffff", border: BW, borderRadius: 9999 }}
                >
                  {l.n}
                </span>
                <span className="flex-1 text-[18px] font-bold tracking-tight" style={{ color: "#ffffff" }}>{l.name}</span>
                <span className="font-mono text-[12px] font-bold uppercase" style={{ color: l.n === 7 ? "#A78BFA" : FAINT }}>{l.xp}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-8" style={{ borderTop: BW }}>
          <p className="font-mono text-[12px] uppercase tracking-wider" style={{ color: FAINT }}>© 2026 Hyperfix · Made for brains that run hot.</p>
        </div>
      </div>
    </div>
  );
}
