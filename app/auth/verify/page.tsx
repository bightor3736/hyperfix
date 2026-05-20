export default function VerifyPage() {
  return (
    <div className="text-center">
      <div
        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
        style={{ background: "rgba(94,234,212,0.12)", border: "1px solid rgba(94,234,212,0.25)" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </div>

      <h1
        className="font-display font-bold text-[26px] leading-tight mb-2"
        style={{ color: "#F4F4F4", letterSpacing: "-0.02em" }}
      >
        Check your email
      </h1>
      <p className="font-sans text-sm leading-relaxed mb-8" style={{ color: "rgba(244,244,244,0.45)" }}>
        We sent a confirmation link to your inbox.
        <br />
        Click it to activate your account, then come back to log in.
      </p>

      <a
        href="/auth/login"
        className="inline-flex items-center font-sans text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:opacity-90"
        style={{ background: "#5EEAD4", color: "#0A0A0A" }}
      >
        Back to log in
      </a>

      <p className="mt-8 font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.2)" }}>
        Didn&apos;t get it? Check your spam folder.
      </p>
    </div>
  );
}
