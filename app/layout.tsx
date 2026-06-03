import type { Metadata, Viewport } from "next";
import { Fraunces, Lexend, JetBrains_Mono, Inter, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";
import { AffTracker } from "@/components/AffTracker";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
});

// Lexend — engineered to reduce reading friction; the top pick for ADHD
// legibility. Keeps the --font-instrument variable name so the Tailwind
// `sans` mapping doesn't need to change.
const instrument = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

// Landing-page typefaces — used to keep the auth screens visually continuous
// with the marketing site (Inter for headings/body, Source Serif 4 for the
// italic accent words and the "F" mark).
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-landing-sans",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  style: ["italic", "normal"],
  variable: "--font-landing-serif",
});

const SITE_URL = "https://hyperfix.app";
const SITE_NAME = "Hyperfix";
const TITLE =
  "Hyperfix — ADHD accountability that actually works";
const DESCRIPTION =
  "Track your hyperfixations, earn XP for real actions, and beat the tasks your brain avoids. A warm, forgiving game built for ADHD — no leaderboards, just yours. Free to start.";

export const viewport: Viewport = {
  themeColor: "#f6f8fb",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Hyperfix",
  },
  description: DESCRIPTION,
  keywords: [
    "ADHD dopamine app",
    "dopamine menu app",
    "anti doomscroll app",
    "ADHD game",
    "ADHD focus app",
    "ADHD productivity app",
    "ADHD streak app",
    "understimulation ADHD",
    "neurodivergent productivity",
    "dopamine on tap",
  ],
  authors: [{ name: "Hyperfix" }],
  creator: "Hyperfix",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Hyperfix — your daily dopamine, on tap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "health",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hyperfix",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Hyperfix",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web, iOS, Android",
  description: DESCRIPTION,
  url: SITE_URL,
  screenshot: `${SITE_URL}/opengraph-image`,
  featureList: [
    "Hyperfixation tracker",
    "XP and levels",
    "Proof-of-action timer",
    "Streak freezes",
    "Focus rooms with body doubling",
    "Customizable profile",
    "Daily quests",
    "Jackpot rewards",
  ],
  offers: [
    {
      "@type": "Offer",
      name: "Free Player",
      price: "0",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Power-Up",
      price: "3.25",
      priceCurrency: "USD",
      description: "Billed annually at $39/year",
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE_URL,
  name: SITE_NAME,
  description: DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrument.variable} ${mono.variable} ${inter.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('hyperfix-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else if(window.matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();`,
          }}
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink focus:text-paper focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest"
          >
            Skip to content
          </a>
          <Suspense fallback={null}><AffTracker /></Suspense>
          {children}
          <Analytics />
        </body>
    </html>
  );
}
