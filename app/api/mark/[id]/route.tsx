import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

/* Flat geometric brand marks — bold acid-green solid shapes with
   negative-space cuts. Inspired by the Bitcore B style. */
const SIZE = { width: 1024, height: 1024 };

const ACCENT = "#A855F7";
const DARK = "#0B0B0B";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", height: "100%", background: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {children}
    </div>
  );
}

/* ─── 01: H — chunky block H with two negative-space slits on each leg.
   Reads as "h" but also looks like a building / monolith. */
function MarkH() {
  return (
    <Frame>
      <svg width={1024} height={1024} viewBox="0 0 1024 1024">
        {/* full block */}
        <rect x={232} y={192} width={560} height={640} fill={ACCENT} />
        {/* central H void — cut out the middle to form an H */}
        <rect x={372} y={192} width={280} height={224} fill={DARK} />
        <rect x={372} y={608} width={280} height={224} fill={DARK} />
        {/* negative slit details on each leg (Bitcore-style cuts) */}
        <rect x={272} y={252} width={60} height={16} fill={DARK} />
        <rect x={272} y={756} width={60} height={16} fill={DARK} />
        <rect x={692} y={252} width={60} height={16} fill={DARK} />
        <rect x={692} y={756} width={60} height={16} fill={DARK} />
      </svg>
    </Frame>
  );
}

/* ─── 02: HF — h and f overlapped as one solid mark, with cut lines */
function MarkHF() {
  return (
    <Frame>
      <svg width={1024} height={1024} viewBox="0 0 1024 1024">
        {/* H — left half */}
        <rect x={192} y={232} width={140} height={560} fill={ACCENT} />
        <rect x={332} y={488} width={200} height={108} fill={ACCENT} />
        <rect x={392} y={232} width={140} height={560} fill={ACCENT} />

        {/* F — right half, offset */}
        <rect x={612} y={232} width={140} height={560} fill={ACCENT} />
        <rect x={752} y={232} width={200} height={108} fill={ACCENT} />
        <rect x={752} y={488} width={140} height={88} fill={ACCENT} />

        {/* Negative cuts for the Bitcore-style detail */}
        <rect x={232} y={300} width={60} height={14} fill={DARK} />
        <rect x={432} y={720} width={60} height={14} fill={DARK} />
        <rect x={652} y={300} width={60} height={14} fill={DARK} />
        <rect x={652} y={720} width={60} height={14} fill={DARK} />
      </svg>
    </Frame>
  );
}

/* ─── 03: Monogram square — the "hf" inside a perfect square,
   with a single bold negative diagonal cut. Looks like a stamp. */
function MarkMono() {
  return (
    <Frame>
      <svg width={1024} height={1024} viewBox="0 0 1024 1024">
        {/* outer accent square */}
        <rect x={192} y={192} width={640} height={640} fill={ACCENT} />

        {/* the "h" — bold sans block carved into dark */}
        <rect x={272} y={302} width={88} height={420} fill={DARK} />
        <rect x={360} y={460} width={144} height={88} fill={DARK} />
        <rect x={504} y={302} width={88} height={420} fill={DARK} />

        {/* the "f" stem to the right, smaller */}
        <rect x={628} y={362} width={70} height={360} fill={DARK} />
        <rect x={698} y={362} width={68} height={70} fill={DARK} />
        <rect x={698} y={492} width={48} height={56} fill={DARK} />

        {/* corner accent cuts on the square */}
        <rect x={192} y={192} width={48} height={12} fill={DARK} />
        <rect x={192} y={192} width={12} height={48} fill={DARK} />
        <rect x={784} y={820} width={48} height={12} fill={DARK} />
        <rect x={820} y={784} width={12} height={48} fill={DARK} />
      </svg>
    </Frame>
  );
}

/* ─── 04: Counter mark — bold "h" with a counter sphere/dot inside the gap.
   Reads as "h" + "obsession dot". */
function MarkCounter() {
  return (
    <Frame>
      <svg width={1024} height={1024} viewBox="0 0 1024 1024">
        {/* H block */}
        <rect x={272} y={192} width={140} height={640} fill={ACCENT} />
        <rect x={612} y={192} width={140} height={640} fill={ACCENT} />
        {/* crossbar */}
        <rect x={412} y={476} width={200} height={88} fill={ACCENT} />
        {/* counter dot in the upper void */}
        <circle cx={512} cy={332} r={56} fill={ACCENT} />
        {/* slit cuts */}
        <rect x={312} y={260} width={60} height={14} fill={DARK} />
        <rect x={312} y={750} width={60} height={14} fill={DARK} />
        <rect x={652} y={260} width={60} height={14} fill={DARK} />
        <rect x={652} y={750} width={60} height={14} fill={DARK} />
      </svg>
    </Frame>
  );
}

/* ─── 05: The Tag — a horizontal pill containing "hf" as cutouts.
   Reads like a sticker or rounded badge. */
function MarkTag() {
  return (
    <Frame>
      <svg width={1024} height={1024} viewBox="0 0 1024 1024">
        {/* pill */}
        <rect x={112} y={352} width={800} height={320} rx={160} fill={ACCENT} />

        {/* "h" cutouts */}
        <rect x={232} y={420} width={80} height={184} fill={DARK} />
        <rect x={312} y={488} width={120} height={64} fill={DARK} />
        <rect x={432} y={420} width={80} height={184} fill={DARK} />

        {/* "f" cutouts */}
        <rect x={612} y={420} width={64} height={184} fill={DARK} />
        <rect x={676} y={420} width={100} height={56} fill={DARK} />
        <rect x={676} y={500} width={70} height={44} fill={DARK} />

        {/* center seam dot — divides h | f */}
        <circle cx={562} cy={512} r={10} fill={DARK} />
      </svg>
    </Frame>
  );
}

/* ─── 06: The Glyph — single sculpted character: an "h" with a hooked tail
   that nods to the "f". One continuous geometric form. */
function MarkGlyph() {
  return (
    <Frame>
      <svg width={1024} height={1024} viewBox="0 0 1024 1024">
        {/* full glyph as one path */}
        <path
          d="M 232 192
             L 372 192
             L 372 460
             L 588 460
             L 588 192
             L 728 192
             L 728 832
             L 588 832
             L 588 600
             L 372 600
             L 372 832
             L 232 832
             Z"
          fill={ACCENT}
        />
        {/* hooked tail on the right leg — that's the "f" flourish */}
        <rect x={728} y={460} width={120} height={88} fill={ACCENT} />
        <rect x={788} y={548} width={60} height={56} fill={ACCENT} />

        {/* slit cuts */}
        <rect x={272} y={252} width={60} height={14} fill={DARK} />
        <rect x={272} y={758} width={60} height={14} fill={DARK} />
        <rect x={628} y={252} width={60} height={14} fill={DARK} />
        <rect x={628} y={758} width={60} height={14} fill={DARK} />
      </svg>
    </Frame>
  );
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = parseInt(id, 10);

  const elements: React.ReactElement[] = [
    <MarkH key={0} />,
    <MarkHF key={1} />,
    <MarkMono key={2} />,
    <MarkCounter key={3} />,
    <MarkTag key={4} />,
    <MarkGlyph key={5} />,
  ];

  const element = elements[Math.min(Math.max(n, 0), elements.length - 1)];
  return new ImageResponse(element, SIZE);
}
