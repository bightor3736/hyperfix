import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

/* 1:1 square, brand-mark logo illustrations.
   Sculptural 3D feel via SVG radial gradients (no real 3D, no filters). */
const SIZE = { width: 1024, height: 1024 };

const ACCENT = "#5EEAD4";
const ACCENT_DEEP = "#7CB205";
const ACCENT_BRIGHT = "#D4FB7A";
const DARK = "#0B0B0B";
const DARK_MID = "#1A1A1A";

/* ─── 01: The Orbit ───
   The reference shape: a rounded teardrop/shield form with a small sphere
   overlapping at the upper-left, bright halo where they meet. */
function Orbit() {
  return (
    <div style={{ width: "100%", height: "100%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={1024} height={1024} viewBox="0 0 1024 1024">
        <defs>
          {/* Bright halo glow centered on the gap between sphere + main form */}
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ACCENT_BRIGHT} stopOpacity="1" />
            <stop offset="30%" stopColor={ACCENT} stopOpacity="0.95" />
            <stop offset="70%" stopColor={ACCENT_DEEP} stopOpacity="0.4" />
            <stop offset="100%" stopColor={ACCENT_DEEP} stopOpacity="0" />
          </radialGradient>
          {/* Body gradient — bright edge against the halo, fading to deep black on the dark side */}
          <radialGradient id="bodyShade" cx="38%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#2A2A2A" stopOpacity="1" />
            <stop offset="40%" stopColor="#141414" stopOpacity="1" />
            <stop offset="80%" stopColor={DARK} stopOpacity="1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="1" />
          </radialGradient>
          {/* Inner glow on body — picks up green light from the halo */}
          <radialGradient id="bodyRim" cx="32%" cy="38%" r="35%">
            <stop offset="0%" stopColor={ACCENT_BRIGHT} stopOpacity="0.55" />
            <stop offset="45%" stopColor={ACCENT} stopOpacity="0.15" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
          {/* Sphere */}
          <radialGradient id="sphere" cx="35%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#2C2C2C" stopOpacity="1" />
            <stop offset="55%" stopColor="#0E0E0E" stopOpacity="1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="1" />
          </radialGradient>
          {/* Sphere rim light from the halo */}
          <radialGradient id="sphereRim" cx="80%" cy="65%" r="45%">
            <stop offset="0%" stopColor={ACCENT_BRIGHT} stopOpacity="0.85" />
            <stop offset="50%" stopColor={ACCENT} stopOpacity="0.2" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Halo behind everything */}
        <circle cx={430} cy={440} r={240} fill="url(#halo)" />

        {/* Main sculptural body — a rounded shield / teardrop pointing down-right */}
        <path
          d="M 540 280
             C 720 280, 820 380, 820 540
             C 820 680, 760 780, 640 800
             C 540 815, 460 770, 410 690
             C 370 620, 360 540, 380 460
             C 400 360, 460 280, 540 280 Z"
          fill="url(#bodyShade)"
        />
        {/* Green rim light overlay on the body */}
        <path
          d="M 540 280
             C 720 280, 820 380, 820 540
             C 820 680, 760 780, 640 800
             C 540 815, 460 770, 410 690
             C 370 620, 360 540, 380 460
             C 400 360, 460 280, 540 280 Z"
          fill="url(#bodyRim)"
        />

        {/* The orbit sphere — overlaps top-left of body */}
        <circle cx={400} cy={400} r={92} fill="url(#sphere)" />
        <circle cx={400} cy={400} r={92} fill="url(#sphereRim)" />
      </svg>
    </div>
  );
}

/* ─── 02: The Lens ───
   A larger sphere with a glowing crescent — like a planet eclipsing a sun.
   Very on-brand for "focus" / "fixation". */
function Lens() {
  return (
    <div style={{ width: "100%", height: "100%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={1024} height={1024} viewBox="0 0 1024 1024">
        <defs>
          <radialGradient id="lens-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="20%" stopColor={ACCENT_BRIGHT} stopOpacity="0.95" />
            <stop offset="55%" stopColor={ACCENT} stopOpacity="0.5" />
            <stop offset="100%" stopColor={ACCENT_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lens-body" cx="30%" cy="30%" r="85%">
            <stop offset="0%" stopColor="#2A2A2A" stopOpacity="1" />
            <stop offset="50%" stopColor="#0F0F0F" stopOpacity="1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="lens-rim" cx="85%" cy="55%" r="40%">
            <stop offset="0%" stopColor={ACCENT_BRIGHT} stopOpacity="0.9" />
            <stop offset="60%" stopColor={ACCENT} stopOpacity="0.2" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Halo */}
        <circle cx={660} cy={520} r={300} fill="url(#lens-halo)" />

        {/* Main sphere */}
        <circle cx={490} cy={512} r={300} fill="url(#lens-body)" />
        {/* Rim light from halo */}
        <circle cx={490} cy={512} r={300} fill="url(#lens-rim)" />
      </svg>
    </div>
  );
}

/* ─── 03: The H ───
   The letter H sculpted as two dark slabs with a glowing crossbar gap. */
function HMark() {
  return (
    <div style={{ width: "100%", height: "100%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={1024} height={1024} viewBox="0 0 1024 1024">
        <defs>
          <radialGradient id="h-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ACCENT_BRIGHT} stopOpacity="1" />
            <stop offset="40%" stopColor={ACCENT} stopOpacity="0.6" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="h-leg-left" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1A1A1A" />
            <stop offset="60%" stopColor="var(--bg)" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
          <linearGradient id="h-leg-right" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="40%" stopColor="var(--bg)" />
            <stop offset="100%" stopColor="#1F1F1F" />
          </linearGradient>
          <radialGradient id="h-leg-glow-l" cx="100%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ACCENT_BRIGHT} stopOpacity="0.55" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="h-leg-glow-r" cx="0%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ACCENT_BRIGHT} stopOpacity="0.55" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Halo glow in the middle gap */}
        <circle cx={512} cy={512} r={200} fill="url(#h-halo)" />

        {/* Left leg */}
        <rect x={240} y={232} width={180} height={560} rx={32} fill="url(#h-leg-left)" />
        <rect x={240} y={232} width={180} height={560} rx={32} fill="url(#h-leg-glow-l)" />

        {/* Right leg */}
        <rect x={604} y={232} width={180} height={560} rx={32} fill="url(#h-leg-right)" />
        <rect x={604} y={232} width={180} height={560} rx={32} fill="url(#h-leg-glow-r)" />

        {/* Glowing crossbar — bright slab */}
        <rect x={420} y={478} width={184} height={68} fill={ACCENT_BRIGHT} />
        <rect x={420} y={478} width={184} height={68} fill={ACCENT} opacity={0.4} />
      </svg>
    </div>
  );
}

/* ─── 04: The Hook ───
   A bold sculptural "f" form with a sphere caught in the curve — the fix grabs you. */
function Hook() {
  return (
    <div style={{ width: "100%", height: "100%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={1024} height={1024} viewBox="0 0 1024 1024">
        <defs>
          <radialGradient id="hook-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ACCENT_BRIGHT} stopOpacity="1" />
            <stop offset="40%" stopColor={ACCENT} stopOpacity="0.7" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hook-body" cx="40%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#2A2A2A" />
            <stop offset="60%" stopColor="#0E0E0E" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <radialGradient id="hook-rim" cx="70%" cy="70%" r="50%">
            <stop offset="0%" stopColor={ACCENT_BRIGHT} stopOpacity="0.7" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hook-sphere" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#2A2A2A" />
            <stop offset="55%" stopColor="#0E0E0E" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
        </defs>

        {/* Halo behind the hook */}
        <circle cx={600} cy={550} r={250} fill="url(#hook-halo)" />

        {/* The hook shape — like a thick "j" or fish hook */}
        <path
          d="M 480 220
             L 620 220
             C 660 220, 690 250, 690 290
             L 690 600
             C 690 720, 600 800, 480 800
             C 380 800, 300 720, 300 620
             L 460 620
             C 460 660, 490 690, 530 690
             C 570 690, 600 660, 600 620
             L 600 380
             L 480 380 Z"
          fill="url(#hook-body)"
        />
        {/* rim glow */}
        <path
          d="M 480 220
             L 620 220
             C 660 220, 690 250, 690 290
             L 690 600
             C 690 720, 600 800, 480 800
             C 380 800, 300 720, 300 620
             L 460 620
             C 460 660, 490 690, 530 690
             C 570 690, 600 660, 600 620
             L 600 380
             L 480 380 Z"
          fill="url(#hook-rim)"
        />

        {/* Sphere caught in the curve */}
        <circle cx={755} cy={520} r={80} fill="url(#hook-sphere)" />
      </svg>
    </div>
  );
}

/* ─── 05: The Eye ───
   A horizontal lens / iris shape with a glowing pupil. */
function Eye() {
  return (
    <div style={{ width: "100%", height: "100%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={1024} height={1024} viewBox="0 0 1024 1024">
        <defs>
          <radialGradient id="eye-pupil-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor={ACCENT_BRIGHT} stopOpacity="1" />
            <stop offset="60%" stopColor={ACCENT} stopOpacity="0.7" />
            <stop offset="100%" stopColor={ACCENT_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="eye-body" cx="50%" cy="35%" r="85%">
            <stop offset="0%" stopColor="#252525" />
            <stop offset="60%" stopColor="#0C0C0C" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <radialGradient id="eye-rim" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor={ACCENT} stopOpacity="0" />
            <stop offset="85%" stopColor={ACCENT_BRIGHT} stopOpacity="0.35" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Lens body — almond shape */}
        <path
          d="M 130 512
             C 130 350, 320 280, 512 280
             C 704 280, 894 350, 894 512
             C 894 674, 704 744, 512 744
             C 320 744, 130 674, 130 512 Z"
          fill="url(#eye-body)"
        />
        <path
          d="M 130 512
             C 130 350, 320 280, 512 280
             C 704 280, 894 350, 894 512
             C 894 674, 704 744, 512 744
             C 320 744, 130 674, 130 512 Z"
          fill="url(#eye-rim)"
        />

        {/* Glowing pupil */}
        <circle cx={512} cy={512} r={180} fill="url(#eye-pupil-glow)" />
        {/* Inner dark dot */}
        <circle cx={512} cy={512} r={42} fill="#050505" />
      </svg>
    </div>
  );
}

/* ─── 06: The Pebble ───
   A simple rounded pebble form with a halo behind — minimal sculptural mark. */
function Pebble() {
  return (
    <div style={{ width: "100%", height: "100%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={1024} height={1024} viewBox="0 0 1024 1024">
        <defs>
          <radialGradient id="pebble-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ACCENT_BRIGHT} stopOpacity="1" />
            <stop offset="35%" stopColor={ACCENT} stopOpacity="0.7" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pebble-body" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#2D2D2D" />
            <stop offset="50%" stopColor="#101010" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <radialGradient id="pebble-rim" cx="75%" cy="80%" r="45%">
            <stop offset="0%" stopColor={ACCENT_BRIGHT} stopOpacity="0.75" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Halo behind */}
        <circle cx={640} cy={620} r={280} fill="url(#pebble-halo)" />

        {/* Asymmetric pebble shape */}
        <path
          d="M 360 260
             C 540 230, 740 290, 790 460
             C 840 620, 760 790, 580 810
             C 400 830, 260 720, 240 560
             C 225 420, 280 280, 360 260 Z"
          fill="url(#pebble-body)"
        />
        <path
          d="M 360 260
             C 540 230, 740 290, 790 460
             C 840 620, 760 790, 580 810
             C 400 830, 260 720, 240 560
             C 225 420, 280 280, 360 260 Z"
          fill="url(#pebble-rim)"
        />
      </svg>
    </div>
  );
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = parseInt(id, 10);

  const elements: React.ReactElement[] = [
    <Orbit key={0} />,
    <Lens key={1} />,
    <HMark key={2} />,
    <Hook key={3} />,
    <Eye key={4} />,
    <Pebble key={5} />,
  ];

  const element = elements[Math.min(Math.max(n, 0), elements.length - 1)];
  return new ImageResponse(element, SIZE);
}
