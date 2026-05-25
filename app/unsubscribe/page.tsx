import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
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
      <main className="min-h-screen flex items-center justify-center px-6 py-24" style={{ background: "#070708" }}>
        <div className="max-w-md w-full text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest mb-5" style={{ color: "rgba(94,234,212,0.55)" }}>
            email
          </p>

          <h1
            className="font-display mb-6"
            style={{ color: "#F4F4F4", fontSize: "clamp(32px, 5vw, 44px)", letterSpacing: "-0.02em", fontWeight: 600, lineHeight: 1.05 }}
          >
            Unsubscribe
          </h1>

          {user ? (
            <>
              <p className="font-sans text-base leading-relaxed mb-4" style={{ color: "rgba(244,244,244,0.5)" }}>
                Unsubscribe <strong style={{ color: "rgba(244,244,244,0.8)" }}>{userEmail}</strong> from all Hyperfix emails.
              </p>
              <p className="font-sans text-sm mb-8" style={{ color: "rgba(244,244,244,0.35)" }}>
                You can also manage individual notification settings in{" "}
                <a
                  href="/dashboard/settings"
                  className="underline transition-colors hover:text-[rgba(244,244,244,0.7)]"
                  style={{ color: "rgba(244,244,244,0.45)" }}
                >
                  Settings
                </a>
                .
              </p>
              <UnsubscribeForm email={userEmail} />
            </>
          ) : (
            <>
              <p className="font-sans text-base leading-relaxed mb-10" style={{ color: "rgba(244,244,244,0.5)" }}>
                Enter your email below and we&apos;ll remove you from all marketing and notification emails.
              </p>
              <p className="font-sans text-sm mb-10" style={{ color: "rgba(244,244,244,0.35)" }}>
                If you have an account, you can also manage notification settings in{" "}
                <a
                  href="/dashboard/settings"
                  className="underline transition-colors hover:text-[rgba(244,244,244,0.7)]"
                  style={{ color: "rgba(244,244,244,0.45)" }}
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
