"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion";
import { JustStartDemo } from "./demo/JustStartDemo";

const PARA1 =
  "We're building a space where starting is enough — where ADHD brains find momentum, every small step earns a real win, and no streak ever dies from a hard week.";

const PARA2 =
  "A system where focus, reward, and forgiveness flow together — with less shame, less friction, and more action for the brains that need it most.";

const HIGHLIGHTED = new Set(["starting", "momentum", "win,"]);

function Word({
  word,
  progress,
  start,
  end,
  reduceMotion,
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  reduceMotion: boolean;
}) {
  const animatedOpacity = useTransform(progress, [start, end], [0.15, 1]);
  const clean = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
  const isHighlighted = HIGHLIGHTED.has(clean) || HIGHLIGHTED.has(word.toLowerCase());
  return (
    <motion.span
      style={{
        // Reduced-motion users see the full text immediately, no scroll reveal.
        opacity: reduceMotion ? 1 : animatedOpacity,
        color: isHighlighted ? "#ffffff" : "hsl(210 17% 95%)",
        display: "inline",
      }}
    >
      {word}{" "}
    </motion.span>
  );
}

function ScrollParagraph({
  text,
  style,
}: {
  text: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.4"],
  });
  const words = text.split(" ");
  return (
    <p ref={ref} style={style}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min((i + 2) / words.length, 1);
        return (
          <Word
            key={i}
            word={word}
            progress={scrollYProgress}
            start={start}
            end={end}
            reduceMotion={reduceMotion}
          />
        );
      })}
    </p>
  );
}

export function Mission() {
  return (
    <section style={{ paddingTop: 0, paddingBottom: "176px", paddingLeft: 24, paddingRight: 24 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        {/* Coded product demo: the real "Just Start" flow */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 96 }}>
          <JustStartDemo />
        </div>

        {/* Scroll-driven text */}
        <ScrollParagraph
          text={PARA1}
          style={{
            fontSize: "clamp(22px, 4vw, 48px)",
            fontWeight: 500,
            letterSpacing: "-1px",
            lineHeight: 1.3,
          }}
        />
        <ScrollParagraph
          text={PARA2}
          style={{
            fontSize: "clamp(18px, 3vw, 32px)",
            fontWeight: 500,
            marginTop: 40,
            lineHeight: 1.4,
          }}
        />
      </div>
    </section>
  );
}
