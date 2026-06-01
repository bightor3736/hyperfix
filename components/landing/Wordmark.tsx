import { LogoMark } from "@/components/Logo";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <a
      href="/"
      className={`inline-flex items-center gap-2.5 leading-none hover:opacity-90 ${className}`}
      aria-label="Hyperfix"
    >
      <LogoMark size={26} color="var(--energy)" />
      <span className="font-display-medium text-[30px] leading-none tracking-tight text-ink sm:text-[33px]">
        hyperfix
      </span>
    </a>
  );
}
