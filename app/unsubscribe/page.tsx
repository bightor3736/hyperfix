import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { createClient } from "@/lib/supabase/server";
import { UnsubscribeForm } from "./UnsubscribeForm";

export const metadata: Metadata = {
  title: "Unsubscribe · Hyperfix",
  description: "Manage your Hyperfix email preferences.",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userEmail = user?.email ?? undefined;

  return (
    <>
      <Nav />
      <main className="min-h-screen flex items-center justify-center px-6 py-32" style={{ background: "#000000" }}>
        <div className="max-w-md w-full text-center">
          <p className="uppercase mb-5" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "rgba(255,255,255,0.35)" }}>
            Email
          </p>

          <h1
            className="mb-6"
            style={{ color: "#ffffff", fontSize: "clamp(32px, 5vw, 44px)", letterSpacing: "-0.025em", fontWeight: 500, lineHeight: 1.05 }}
          >
            <span style={{ fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)", fontStyle: "italic", fontWeight: 400 }}>
              Unsubscribe
            </span>
          </h1>

          {user ? (
            <>
              <p className="font-sans text-base leading-relaxed mb-4" style={{ color: "var(--ink-muted)" }}>
                Unsubscribe <strong style={{ color: "var(--ink)" }}>{userEmail}</strong> from all Hyperfix emails.
              </p>
              <p className="font-sans text-sm mb-8" style={{ color: "var(--ink-faint)" }}>
                You can also manage individual notification settings in{" "}
                <a
                  href="/dashboard/settings"
                  className="underline transition-colors hover:text-[var(--ink-muted)]"
                  style={{ color: "var(--ink-muted)" }}
                >
                  Settings
                </a>
                .
              </p>
              <UnsubscribeForm email={userEmail} />
            </>
          ) : (
            <>
              <p className="font-sans text-base leading-relaxed mb-10" style={{ color: "var(--ink-muted)" }}>
                Enter your email below and we&apos;ll remove you from all marketing and notification emails.
              </p>
              <p className="font-sans text-sm mb-10" style={{ color: "var(--ink-faint)" }}>
                If you have an account, you can also manage notification settings in{" "}
                <a
                  href="/dashboard/settings"
                  className="underline transition-colors hover:text-[var(--ink-muted)]"
                  style={{ color: "var(--ink-muted)" }}
                >
                  Dashboard → Settings
                </a>
                .
              </p>
              <UnsubscribeForm />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
