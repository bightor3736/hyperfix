export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <a
      href="/"
      className={`font-display-medium text-[30px] leading-none tracking-tight hover:opacity-80 transition-opacity ${className}`}
      style={{ color: "var(--ink)" }}
      aria-label="Hyperfix"
    >
      hyperfix
    </a>
  );
}
