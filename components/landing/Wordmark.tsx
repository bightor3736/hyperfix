import { LogoMark } from "@/components/Logo";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <a
      href="/"
      className={`inline-flex items-center gap-2.5 leading-none ${className}`}
      aria-label="Hyperfix"
    >
      <LogoMark size={28} color="var(--accent)" />
      <span
        className="text-[26px] leading-none text-ink sm:text-[28px]"
        style={{ fontWeight: 700, letterSpacing: "-0.04em" }}
      >
        hyperfix
      </span>
    </a>
  );
}
