"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion";

const PARA =
  "Most apps punish you for falling behind. Hyperfix does the opposite — it celebrates the moment you start, forgives the days you miss, and shrinks every task until beginning feels easy. Less shame. Less friction. More of the only thing that matters: action.";

const HIGHLIGHTED = new Set(["start,", "start", "forgives", "action."]);

function Word({ word, progress, start, end, reduceMotion }: {
  word: string; progress: MotionValue<number>; start: number; end: number; reduceMotion: boolean;
}) {
  const animated = useTransform(progress, [start, end], [0.18, 1]);
  const clean = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
  const isHi = HIGHLIGHTED.has(clean) || HIGHLIGHTED.has(word.toLowerCase());
  return (
    <motion.span style={{ opacity: reduceMotion ? 1 : animated, color: isHi ? "var(--accent)" : "var(--ink)", display: "inline" }}>
      {word}{" "}
    </motion.span>
  );
}

export function Mission() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = PARA.split(" ");

  return (
    <section style={{ padding: "120px 24px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
        <p className="eyebrow" style={{ marginBottom: 24 }}>Why we built this</p>
        <p
          ref={ref}
          style={{ fontSize: "clamp(24px, 3.6vw, 40px)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.35 }}
        >
          {words.map((word, i) => {
            const s = i / words.length;
            const e = Math.min((i + 2) / words.length, 1);
            return <Word key={i} word={word} progress={scrollYProgress} start={s} end={e} reduceMotion={reduceMotion} />;
          })}
        </p>
      </div>
    </section>
  );
}
