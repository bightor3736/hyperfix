import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Hyperfix",
  description: "What Hyperfix collects, how we use it, and how to delete it.",
  alternates: { canonical: "https://hyperfix.app/privacy" },
  robots: { index: true, follow: false },
};

const sections = [
  {
    h: "What we collect",
    body: "When you create an account we store your email address, chosen username, and any content you add (fix titles, notes, eulogies). We also store timestamps and basic usage data (e.g. when a fix was created or ended). We don't collect your real name, location, or IP address beyond what Supabase logs for security.",
  },
  {
    h: "How we use it",
    body: "Your email is used to send account-related emails (confirmations, password resets) and, if you opt in, product updates and notification digests. We'll never email you more than once a week and every email has a one-click unsubscribe. We don't use your email for advertising.",
  },
  {
    h: "What we don't do",
    body: "We don't sell your data. We don't share it with third parties for advertising. We don't use your fixes, notes, or any personal content to train AI models. We use Vercel Analytics (privacy-friendly, no cookies, no fingerprinting) to understand general usage patterns.",
  },
  {
    h: "Where it's stored",
    body: "Your account data is stored in Supabase (supabase.com). Supabase hosts in the EU by default. Their privacy policy is at supabase.com/privacy. Payments (Pro tier) are handled by Stripe — we never see or store your card details.",
  },
  {
    h: "Public vs private",
    body: "Fixes you mark as public are visible to other logged-in users on the Explore page and on your public profile. Fixes you mark as private are only visible to you. You can change the visibility of any fix at any time.",
  },
  {
    h: "How to delete your data",
    body: "You can delete your account from Settings → Account → Delete account. This permanently removes your profile and all associated fixes. If you need help, email privacy@hyperfix.app and we'll action it within 48 hours.",
  },
  {
    h: "Cookies",
    body: "We use a single functional session cookie to keep you logged in. No tracking cookies, no ad pixels, no third-party cookies. Vercel Analytics is cookieless.",
  },
  {
    h: "Changes to this policy",
    body: "If we change what we collect or how we use it, we'll update this page, note the date, and email you if the change is material.",
  },
];

export default function PrivacyPage() {
  return (
    <main id="main-content" className="relative z-10" style={{ background: "#000000", color: "#ffffff" }}>
      <Nav />

      <section className="px-6 sm:px-10 pt-32 sm:pt-40 pb-10" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="mx-auto" style={{ maxWidth: 720 }}>
          <p className="uppercase mb-4" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "rgba(255,255,255,0.35)" }}>
            Legal
          </p>
          <h1 style={{ color: "#ffffff", fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.025em", fontWeight: 500 }}>
            Privacy{" "}
            <span style={{ fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)", fontStyle: "italic", fontWeight: 400 }}>
              Policy
            </span>
          </h1>
          <p className="mt-5 uppercase tabular-nums" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "rgba(255,255,255,0.35)" }}>
            Effective: May 2026
          </p>
        </div>
      </section>

      <section className="px-6 sm:px-10 py-16 sm:py-20">
        <div className="mx-auto" style={{ maxWidth: 720 }}>
          {sections.map((s, i) => (
            <div
              key={s.h}
              className="py-8 grid sm:grid-cols-3 gap-4 sm:gap-10"
              style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)" }}
            >
              <h2 className="text-lg tracking-tight sm:pt-1" style={{ color: "#ffffff", fontWeight: 600 }}>
                {s.h}
              </h2>
              <p className="sm:col-span-2 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
