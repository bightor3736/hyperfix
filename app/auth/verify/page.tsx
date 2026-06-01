export default function VerifyPage() {
  return (
    <div className="text-center flex flex-col items-center">
      <div
        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 anim-scaleIn anim-glowPulse"
        style={{
          background: "var(--accent-soft)",
          border: "1px solid var(--accent)",
          color: "var(--accent)",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </div>

      <span
        className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5 anim-fadeUp delay-100"
        style={{
          background: "var(--accent-soft)",
          color: "var(--accent)",
          border: "1px solid var(--accent)",
        }}
      >
        almost in
      </span>
      <h1
        className="font-display leading-tight mb-3 anim-fadeUp delay-200"
        style={{
          color: "var(--ink)",
          letterSpacing: "-0.02em",
          fontSize: "clamp(28px, 4.5vw, 36px)",
          fontWeight: 600,
        }}
      >
        Check your email.
      </h1>
      <p className="font-sans text-base leading-relaxed mb-6 max-w-xs anim-fadeUp delay-300" style={{ color: "var(--ink-muted)" }}>
        Click the link we sent you — it logs you straight in, no password needed.
      </p>

      {/* Quick-open email provider buttons */}
      <div className="flex flex-col gap-2 w-full max-w-[260px] mb-8 anim-fadeUp delay-400">
        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl py-3 font-sans text-sm font-medium transition-all hover:-translate-y-px active:scale-[0.98]"
          style={{
            background: "rgba(15,16,17,0.85)",
            border: "1px solid var(--line)",
            color: "var(--ink)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <path fill="#EA4335" d="M6 18V8.4L4.2 7.2C3.5 6.7 2.5 7.2 2.5 8v9c0 .8.7 1.5 1.5 1.5h2z"/>
            <path fill="#FBBC05" d="M18 18V8.4l1.8-1.2c.7-.5 1.7 0 1.7.8v9c0 .8-.7 1.5-1.5 1.5H18z"/>
            <path fill="#4285F4" d="M18 6.75 12 11 6 6.75V6c0-.83 1.01-1.3 1.65-.8L12 8.7l4.35-3.5c.64-.5 1.65-.03 1.65.8v.75z"/>
            <path fill="#34A853" d="M6 18h12v-9.6L12 12.35 6 8.4V18z"/>
          </svg>
          Open Gmail
        </a>
        <a
          href="https://outlook.live.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl py-3 font-sans text-sm font-medium transition-all hover:-translate-y-px active:scale-[0.98]"
          style={{
            background: "rgba(15,16,17,0.85)",
            border: "1px solid var(--line)",
            color: "var(--ink)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="2" y="4" width="20" height="16" rx="2" fill="#0a0a0a"/>
            <path d="M2 7l10 7 10-7" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          Open Outlook
        </a>
      </div>

      <p className="font-sans text-sm anim-fadeUp delay-500" style={{ color: "var(--ink-faint)" }}>
        Didn&apos;t get it? Check spam, or{" "}
        <a href="/auth/signup" className="underline" style={{ color: "var(--ink-muted)" }}>
          try again
        </a>
        .
      </p>
    </div>
  );
}
