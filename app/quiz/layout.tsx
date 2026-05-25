import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What kind of hyperfixer are you? · Hyperfix",
  description: "6 questions. Find your hyperfixation archetype. Free quiz.",
  alternates: { canonical: "https://hyperfix.app/quiz" },
  openGraph: {
    title: "What kind of hyperfixer are you? · Hyperfix",
    description: "6 questions. Find your hyperfixation archetype. Free quiz.",
    url: "https://hyperfix.app/quiz",
    type: "website",
  },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
