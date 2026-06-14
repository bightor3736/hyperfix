import type { Metadata } from "next";
import { LogoMark, LogoTile, LogoWordmark, LogoLockup } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Hyperfix Brand Guidelines",
  description: "Internal brand reference — light warm system: colors, type, voice, marks.",
  robots: { index: false, follow: false },
};

const BW = "1px solid var(--line)";
const CARD_BG = "var(--bg-white)";
const MUTED = "var(--ink-muted)";
const FAINT = "var(--ink-faint)";

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
        <span className="font-mono text-[10px] font-bold" style={{ color: dark ? "#fff" : "var(--ink)" }}>{hex}</span>
      </div>
      <div className="px-3 py-2" style={{ background: CARD_BG, borderTop: BW }}>
        <p className="text-[13px] font-bold" style={{ color: "var(--ink)" }}>{label}</p>
        <p className="font-mono text-[10px]" style={{ color: FAINT }}>{token}</p>
      </div>
    </div>
  );
}

const LEVELS = [
  { n: 1, name: "Mildly Curious", xp: "0 XP", color: "rgba(24,20,16,0.12)" },
  { n: 2, name: "Interested", xp: "50 XP", color: "rgba(24,20,16,0.25)" },
  { n: 3, name: "Invested", xp: "150 XP", color: "rgba(24,20,16,0.40)" },
  { n: 4, name: "Hooked", xp: "400 XP", color: "rgba(24,20,16,0.55)" },
  { n: 5, name: "Unwell", xp: "900 XP", color: "rgba(24,20,16,0.70)" },
  { n: 6, name: "Feral", xp: "2 000 XP", color: "var(--ink)" },
  { n: 7, name: "Clinically Obsessed", xp: "5 000 XP", color: "var(--xp)" },
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
          <h1 className="mt-5 leading-[0.95]" style={{ fontSize: "clamp(48px,8vw,96px)", fontWeight: 500, letterSpacing: "-0.03em", color: "var(--ink)" }}>
            hyperfix
            <span className="inline-block ml-3 align-middle"><LogoMark size={64} color="var(--accent)" /></span>
          </h1>
          <p className="mt-5 max-w-[560px] text-[18px] font-medium leading-[1.5]" style={{ color: MUTED }}>
            Light warm design system. Cream paper canvas, hairline ink borders,
            dark ink type, one{" "}
            <span style={{ fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)", fontStyle: "italic", fontWeight: 400, color: "var(--accent)" }}>
              serif italic
            </span>{" "}
            accent. Coral is the spark; color is reserved for brand &amp; gamification.
          </p>
        </div>

        {/* 1. LOGO */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: FAINT }}>01</p>
          <h2 className="mb-8 text-[34px] font-bold tracking-tight" style={{ color: "var(--ink)" }}>Logo — the focus-lock mark</h2>

          <Box className="mb-4 p-8">
            <p className="font-mono text-[11px] font-bold uppercase tracking-widest mb-6" style={{ color: FAINT }}>Mark · corner brackets clamping a locked-on center</p>
            <div className="flex flex-wrap items-end gap-8">
              {[16, 24, 32, 48, 64, 88].map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <LogoMark size={s} color="var(--ink)" />
                  <span className="font-mono text-[10px]" style={{ color: FAINT }}>{s}px</span>
                </div>
              ))}
            </div>
          </Box>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Box className="p-8">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest mb-6" style={{ color: FAINT }}>App tile · monochrome variants</p>
              <div className="flex flex-wrap items-end gap-4">
                <LogoTile size={56} tile="var(--ink)" />
                <LogoTile size={56} tile="var(--accent)" />
                <LogoTile size={56} tile="var(--fill)" />
                <LogoTile size={56} tile="#FFFFFF" />
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
          <h2 className="mb-8 text-[34px] font-bold tracking-tight" style={{ color: "var(--ink)" }}>Color — warm paper first</h2>

          <p className="font-mono text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: FAINT }}>Canvas + ink</p>
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            <Swatch hex="#FBF7F1" token="--bg" label="Paper" />
            <Swatch hex="#F5EFE5" token="--bg-soft" label="Soft" />
            <Swatch hex="#FFFFFF" token="--bg-white" label="Card" />
            <Swatch hex="#181410" token="--ink" label="Ink" dark />
            <Swatch hex="rgba(24,20,16,0.60)" token="--ink-muted" label="Muted" />
            <Swatch hex="rgba(24,20,16,0.40)" token="--ink-faint" label="Faint" />
          </div>

          <p className="font-mono text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: FAINT }}>Brand + gamification</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            <Swatch hex="#FF5A36" token="--accent" label="Coral · spark" dark />
            <Swatch hex="#6D5AE6" token="--xp" label="Violet · XP" dark />
            <Swatch hex="#F2541B" token="--flame" label="Flame · streak" dark />
            <Swatch hex="#1FA968" token="--success" label="Green · success" dark />
          </div>
        </section>

        {/* 3. SURFACES & DIVIDERS */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: FAINT }}>03</p>
          <h2 className="mb-8 text-[34px] font-bold tracking-tight" style={{ color: "var(--ink)" }}>Surfaces, borders & dividers</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="p-6" style={{ background: CARD_BG, border: BW, borderRadius: 16 }}>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: FAINT }}>Card</p>
              <p className="text-[15px] font-bold" style={{ color: "var(--ink)" }}>var(--bg-white) · 1px var(--line) · radius 16</p>
            </div>
            <div className="liquid-glass p-6" style={{ borderRadius: 16 }}>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: FAINT }}>.liquid-glass</p>
              <p className="text-[15px] font-bold" style={{ color: "var(--ink)" }}>Secondary buttons & chips</p>
            </div>
            <button className="p-6 text-[15px]" style={{ background: "var(--accent)", color: "#fff", fontWeight: 600, border: "none", borderRadius: 16, cursor: "pointer" }}>
              Primary button (coral spark)
            </button>
          </div>
        </section>

        {/* 4. TYPE */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: FAINT }}>04</p>
          <h2 className="mb-8 text-[34px] font-bold tracking-tight" style={{ color: "var(--ink)" }}>Typography</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Box className="p-8">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: FAINT }}>Display + body — Space Grotesk</p>
              <p style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.04em", color: "var(--ink)" }}>Aa</p>
              <p className="mt-2 text-[32px] font-bold tracking-tight" style={{ color: "var(--ink)" }}>
                Clinically{" "}
                <span style={{ fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)", fontStyle: "italic", fontWeight: 400 }}>Obsessed</span>
              </p>
              <p className="mt-3 text-[15px] font-medium leading-[1.6]" style={{ color: MUTED }}>
                Used for everything — headlines, body, buttons, the wordmark. One serif italic accent word per big heading.
              </p>
            </Box>
            <Box className="p-8">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: FAINT }}>Mono — JetBrains Mono</p>
              <p className="font-mono" style={{ fontSize: 44, fontWeight: 600, color: "var(--ink)" }}>01:24</p>
              <p className="mt-2 font-mono text-[13px] font-bold uppercase tracking-widest" style={{ color: "var(--ink)" }}>DEEP DIVE · +8 XP · STREAK</p>
              <p className="mt-3 text-[15px] font-medium leading-[1.6]" style={{ color: MUTED }}>
                Used for: labels, eyebrows, stats, pill tags, counters, timers.
              </p>
            </Box>
          </div>
        </section>

        {/* 5. VOICE */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: FAINT }}>05</p>
          <h2 className="mb-2 text-[34px] font-bold tracking-tight" style={{ color: "var(--ink)" }}>Voice &amp; tone</h2>
          <p className="mb-8 max-w-[560px] text-[15px] font-medium" style={{ color: MUTED }}>
            Sounds like a friend who has ADHD, gets ADHD, and isn&apos;t precious about it.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VOICE.map((v) => (
              <Box key={v.p} className="p-5">
                <p className="text-[16px] font-bold" style={{ color: "var(--ink)" }}>{v.p}</p>
                <p className="mt-1 text-[13px] font-medium leading-[1.5]" style={{ color: MUTED }}>{v.d}</p>
                <p className="mt-3 px-3 py-2 font-mono text-[12px]" style={{ background: "var(--fill)", border: BW, borderRadius: 10, color: "rgba(24,20,16,0.70)" }}>
                  &ldquo;{v.ex}&rdquo;
                </p>
              </Box>
            ))}
          </div>
        </section>

        {/* 6. LEVELS */}
        <section className="mb-20">
          <p className="font-mono text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: FAINT }}>06</p>
          <h2 className="mb-8 text-[34px] font-bold tracking-tight" style={{ color: "var(--ink)" }}>Level names · 7 tiers</h2>
          <div className="flex flex-col gap-3">
            {LEVELS.map((l) => (
              <div key={l.n} className="flex items-center gap-4 p-4" style={{ background: CARD_BG, border: BW, borderRadius: 16 }}>
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center font-mono text-[14px] font-bold"
                  style={{ background: l.color, color: l.n >= 5 ? "#fff" : "var(--ink)", border: BW, borderRadius: 9999 }}
                >
                  {l.n}
                </span>
                <span className="flex-1 text-[18px] font-bold tracking-tight" style={{ color: "var(--ink)" }}>{l.name}</span>
                <span className="font-mono text-[12px] font-bold uppercase" style={{ color: l.n === 7 ? "var(--xp)" : FAINT }}>{l.xp}</span>
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
