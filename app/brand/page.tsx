import type { Metadata } from "next";
import { LogoMark, LogoTile, LogoWordmark, LogoLockup } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Hyperfix Brand Guidelines",
  description: "Internal brand reference — neo-brutalist system: colors, type, voice, marks.",
  robots: { index: false, follow: false },
};

const BW = "2.5px solid var(--ink)";
const SHADOW = "4px 4px 0 0 var(--ink)";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="brutal-tag"
      style={{ background: "var(--yellow)", color: "var(--ink)" }}
    >
      {children}
    </span>
  );
}

function Box({ children, color = "var(--bg-elevated)", className = "" }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <div className={className} style={{ background: color, border: BW, borderRadius: 8, boxShadow: SHADOW }}>
      {children}
    </div>
  );
}

// ── Color swatch ──
function Swatch({ hex, token, label, dark }: { hex: string; token: string; label: string; dark?: boolean }) {
  return (
    <div style={{ border: BW, borderRadius: 6, overflow: "hidden", boxShadow: "3px 3px 0 0 var(--ink)" }}>
      <div className="flex h-20 items-end p-2" style={{ background: hex }}>
        <span className="font-mono text-[10px] font-bold" style={{ color: dark ? "#fff" : "#0A0A0A" }}>{hex}</span>
      </div>
      <div className="px-3 py-2" style={{ background: "var(--bg-elevated)", borderTop: BW }}>
        <p className="text-[13px] font-bold text-ink">{label}</p>
        <p className="font-mono text-[10px] text-ink-faint">{token}</p>
      </div>
    </div>
  );
}

const LEVELS = [
  { n: 1, name: "Mildly Curious", xp: "0 XP", color: "var(--ink-faint)" },
  { n: 2, name: "Interested", xp: "50 XP", color: "var(--blue)" },
  { n: 3, name: "Invested", xp: "150 XP", color: "var(--lime)" },
  { n: 4, name: "Hooked", xp: "400 XP", color: "var(--yellow)" },
  { n: 5, name: "Unwell", xp: "900 XP", color: "var(--coral)" },
  { n: 6, name: "Feral", xp: "2 000 XP", color: "var(--pink)" },
  { n: 7, name: "Clinically Obsessed", xp: "5 000 XP", color: "var(--violet)" },
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
    <div style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-[1100px] px-6 py-16 sm:px-10">

        {/* Header */}
        <div className="mb-20">
          <Eyebrow>Brand guidelines · internal</Eyebrow>
          <h1 className="mt-5 leading-[0.9] text-ink" style={{ fontSize: "clamp(48px,8vw,96px)", fontWeight: 700, letterSpacing: "-0.04em" }}>
            hyperfix
            <span className="inline-block ml-3 align-middle"><LogoMark size={64} color="var(--accent)" /></span>
          </h1>
          <p className="mt-5 max-w-[560px] text-[18px] font-medium leading-[1.5] text-ink-muted">
            Neo-brutalist design system. Thick black borders, hard offset shadows,
            flat primary color blocks, no gradients. Loud, eigenwijs, memorable.
          </p>
        </div>

        {/* 1. LOGO */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest text-ink-faint mb-2">01</p>
          <h2 className="mb-8 text-[34px] font-bold tracking-tight text-ink">Logo — the focus-lock mark</h2>

          <Box className="mb-4 p-8">
            <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-faint mb-6">Mark · corner brackets clamping a locked-on center</p>
            <div className="flex flex-wrap items-end gap-8">
              {[16, 24, 32, 48, 64, 88].map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <LogoMark size={s} color="var(--accent)" />
                  <span className="font-mono text-[10px] text-ink-faint">{s}px</span>
                </div>
              ))}
            </div>
          </Box>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Box className="p-8">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-faint mb-6">App tile · color variants</p>
              <div className="flex flex-wrap items-end gap-4">
                <LogoTile size={56} tile="var(--yellow)" />
                <LogoTile size={56} tile="var(--accent)" />
                <LogoTile size={56} tile="var(--pink)" />
                <LogoTile size={56} tile="var(--lime)" />
              </div>
            </Box>
            <Box className="p-8">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-faint mb-6">Wordmark + lockup</p>
              <div className="flex flex-col gap-5">
                <LogoWordmark size="lg" />
                <LogoLockup size="md" />
              </div>
            </Box>
          </div>
        </section>

        {/* 2. COLORS */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest text-ink-faint mb-2">02</p>
          <h2 className="mb-8 text-[34px] font-bold tracking-tight text-ink">Color — flat blocks only</h2>

          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-faint mb-3">Canvas + ink</p>
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            <Swatch hex="#FBF6EA" token="--bg" label="Paper" />
            <Swatch hex="#F2EAD7" token="--bg-soft" label="Soft" />
            <Swatch hex="#FFFFFF" token="--bg-elevated" label="Card" />
            <Swatch hex="#0A0A0A" token="--ink" label="Ink" dark />
            <Swatch hex="#2E2E2E" token="--ink-muted" label="Muted" dark />
            <Swatch hex="#6A6A6A" token="--ink-faint" label="Faint" dark />
          </div>

          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-faint mb-3">Flat accents</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            <Swatch hex="#2F4BFF" token="--accent / --blue" label="Blue · primary" dark />
            <Swatch hex="#8B5CF6" token="--xp / --violet" label="Violet · XP" dark />
            <Swatch hex="#FF5C3A" token="--flame / --coral" label="Coral · streak" dark />
            <Swatch hex="#16E08A" token="--lime" label="Lime · reward" />
            <Swatch hex="#FFD23F" token="--yellow" label="Yellow · accent" />
            <Swatch hex="#FF5CA8" token="--pink" label="Pink · accent" dark />
          </div>
        </section>

        {/* 3. SURFACES & SHADOWS */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest text-ink-faint mb-2">03</p>
          <h2 className="mb-8 text-[34px] font-bold tracking-tight text-ink">Surfaces, borders & shadows</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="brutal-box p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-2">.brutal-box</p>
              <p className="text-[15px] font-bold text-ink">2.5px border · 4px shadow</p>
            </div>
            <div className="brutal-box-lg p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-2">.brutal-box-lg</p>
              <p className="text-[15px] font-bold text-ink">3.5px border · 7px shadow</p>
            </div>
            <button className="brutal-btn p-6 text-[15px]" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
              .brutal-btn (press me)
            </button>
          </div>
        </section>

        {/* 4. TYPE */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest text-ink-faint mb-2">04</p>
          <h2 className="mb-8 text-[34px] font-bold tracking-tight text-ink">Typography</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Box className="p-8">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-faint mb-5">Display + body — Space Grotesk</p>
              <p className="text-ink" style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.04em" }}>Aa</p>
              <p className="mt-2 text-[32px] font-bold tracking-tight text-ink">Clinically Obsessed</p>
              <p className="mt-3 text-[15px] font-medium leading-[1.6] text-ink-muted">
                Used for everything — headlines, body, buttons, the wordmark. One face, heavy weights, tight tracking.
              </p>
            </Box>
            <Box className="p-8">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-faint mb-5">Mono — JetBrains Mono</p>
              <p className="font-mono text-ink" style={{ fontSize: 44, fontWeight: 600 }}>01:24</p>
              <p className="mt-2 font-mono text-[13px] font-bold uppercase tracking-widest text-ink">DEEP DIVE · +8 XP · STREAK</p>
              <p className="mt-3 text-[15px] font-medium leading-[1.6] text-ink-muted">
                Used for: labels, eyebrows, stats, pill tags, counters, timers.
              </p>
            </Box>
          </div>
        </section>

        {/* 5. VOICE */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest text-ink-faint mb-2">05</p>
          <h2 className="mb-2 text-[34px] font-bold tracking-tight text-ink">Voice &amp; tone</h2>
          <p className="mb-8 max-w-[560px] text-[15px] font-medium text-ink-muted">
            Sounds like a friend who has ADHD, gets ADHD, and isn&apos;t precious about it.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VOICE.map((v) => (
              <Box key={v.p} className="p-5">
                <p className="text-[16px] font-bold text-ink">{v.p}</p>
                <p className="mt-1 text-[13px] font-medium leading-[1.5] text-ink-muted">{v.d}</p>
                <p className="mt-3 px-3 py-2 font-mono text-[12px]" style={{ background: "var(--lime)", border: "2px solid var(--ink)", borderRadius: 4 }}>
                  &ldquo;{v.ex}&rdquo;
                </p>
              </Box>
            ))}
          </div>
        </section>

        {/* 6. LEVELS */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest text-ink-faint mb-2">06</p>
          <h2 className="mb-8 text-[34px] font-bold tracking-tight text-ink">Level names · 7 tiers</h2>
          <div className="flex flex-col gap-3">
            {LEVELS.map((l) => (
              <div key={l.n} className="flex items-center gap-4 p-4" style={{ background: "var(--bg-elevated)", border: BW, borderRadius: 6, boxShadow: SHADOW }}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center font-mono text-[14px] font-bold" style={{ background: l.color, color: "#fff", border: BW, borderRadius: 4 }}>
                  {l.n}
                </span>
                <span className="flex-1 text-[18px] font-bold tracking-tight text-ink">{l.name}</span>
                <span className="font-mono text-[12px] font-bold uppercase text-ink-faint">{l.xp}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-8" style={{ borderTop: BW }}>
          <p className="font-mono text-[12px] uppercase tracking-wider text-ink-faint">© 2026 Hyperfix · Made for brains that run hot.</p>
        </div>
      </div>
    </div>
  );
}
