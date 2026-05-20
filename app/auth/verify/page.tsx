export default function VerifyPage() {
  return (
    <div className="text-center flex flex-col items-center">
      <div
        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 anim-scaleIn anim-glowPulse"
        style={{
          background: "rgba(94,234,212,0.12)",
          border: "1px solid rgba(94,234,212,0.25)",
          color: "#5EEAD4",
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
          background: "rgba(94,234,212,0.10)",
          color: "#5EEAD4",
          border: "1px solid rgba(94,234,212,0.22)",
        }}
      >
        one more step
      </span>
      <h1
        className="font-display leading-tight mb-3 anim-fadeUp delay-200"
        style={{
          color: "#FFFFFF",
          letterSpacing: "-0.02em",
          fontSize: "clamp(28px, 4.5vw, 36px)",
          fontWeight: 600,
        }}
      >
        Check your email.
      </h1>
      <p className="font-sans text-base leading-relaxed mb-8 max-w-xs anim-fadeUp delay-300" style={{ color: "rgba(255,255,255,0.55)" }}>
        We sent a confirmation link to your inbox. Click it to activate your
        account, then come back to log in.
      </p>

      <a
        href="/auth/login"
        className="inline-flex items-center font-sans text-sm font-semibold px-6 py-3.5 rounded-full transition-all hover:opacity-95 active:scale-[0.98] anim-fadeUp delay-500"
        style={{
          background: "#FFFFFF",
          color: "#0A0A0A",
          boxShadow: "0 1px 0 0 rgba(255,255,255,0.4) inset, 0 8px 28px rgba(94,234,212,0.25)",
        }}
      >
        Back to log in
      </a>

      <p className="mt-8 font-sans text-sm anim-fadeUp delay-700" style={{ color: "rgba(255,255,255,0.35)" }}>
        Didn&apos;t get it? Check your spam folder.
      </p>
    </div>
  );
}
