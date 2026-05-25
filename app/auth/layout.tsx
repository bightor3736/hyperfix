import { LogoLockup } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#070708" }}>
      {/* Header */}
      <header className="px-6 sm:px-10 pt-8 sm:pt-10">
        <a href="/" className="inline-block transition-transform hover:scale-[1.02]">
          <LogoLockup size="sm" />
        </a>
      </header>

      {/* Form area — centered, no card */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[380px] anim-fadeUp">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 sm:px-10 pb-6">
        <p
          className="font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "rgba(255,255,255,0.28)" }}
        >
          hyperfix · the journal for your obsessions
        </p>
      </footer>
    </div>
  );
}
