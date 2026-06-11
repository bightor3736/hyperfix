export function AppIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden>
      {/* Near-black rounded square */}
      <rect width="36" height="36" rx="9" fill="#18181B" />
      {/* Clean white "h" letterform — left stroke + arch + right stroke */}
      {/* Left vertical stroke */}
      <line x1="11" y1="9" x2="11" y2="27" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      {/* Arch from midpoint of left stroke to top of right stroke */}
      <path d="M11 19.5 C11 14 25 14 25 19.5" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Right stroke from where arch lands down */}
      <line x1="25" y1="19.5" x2="25" y2="27" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

export function LogoMark({ size = 28, className = "" }: { size?: number; className?: string; color?: string; ink?: string }) {
  return <AppIcon size={size} />;
}

export function Wordmark({ dark = false, size = 18 }: { dark?: boolean; size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <AppIcon size={size + 12} />
      <span style={{
        fontFamily: '-apple-system, "Inter", "Helvetica Neue", system-ui, sans-serif',
        fontSize: size,
        fontWeight: 600,
        letterSpacing: "-0.025em",
        color: dark ? "#ffffff" : "#18181B",
        lineHeight: 1,
      }}>
        hyperfix
      </span>
    </span>
  );
}

// Legacy exports for dashboard compatibility
export function LogoTile({ size = 40, className = "", tile = "var(--accent)" }: { size?: number; className?: string; tile?: string }) {
  const radius = Math.max(8, Math.round(size * 0.28));
  return (
    <span className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size, background: tile, borderRadius: radius }}>
      <AppIcon size={Math.round(size * 0.62)} />
    </span>
  );
}
export function LogoWordmark({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const fontSize = size === "sm" ? "text-[22px]" : size === "lg" ? "text-[42px]" : "text-[28px]";
  return <span className={`leading-none text-ink ${fontSize} ${className}`} style={{ fontWeight: 600, letterSpacing: "-0.025em" }}>hyperfix</span>;
}
export { LogoWordmark as LogoFull };
export function LogoLockup({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const markPx = size === "sm" ? 24 : size === "lg" ? 42 : 30;
  return <span className={`inline-flex items-center gap-2.5 ${className}`}><AppIcon size={markPx} /><LogoWordmark size={size} /></span>;
}
export function SparkIcon({ size = 20, className = "" }: { size?: number; className?: string; color?: string }) {
  return <AppIcon size={size} />;
}
