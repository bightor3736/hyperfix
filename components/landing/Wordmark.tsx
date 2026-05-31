export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <a
      href="/"
      className={`font-display-medium text-[30px] leading-none tracking-tight text-ink hover:text-ink sm:text-[33px] ${className}`}
      aria-label="Hyperfix"
    >
      hyperfix
    </a>
  );
}
