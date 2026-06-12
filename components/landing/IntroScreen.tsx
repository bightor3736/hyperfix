"use client";
import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const SESSION_KEY = "hf-entered";

function UpChevrons() {
  return (
    <div className="flex flex-col items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.svg
          key={i}
          width="22"
          height="13"
          viewBox="0 0 22 13"
          fill="none"
          animate={{ opacity: [0.15, 0.6, 0.15], y: [2, -2, 2] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        >
          <path
            d="M2 11 L11 2 L20 11"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      ))}
    </div>
  );
}

function ConcentricMark({ size = 72 }: { size?: number }) {
  const inner = size * 0.38;
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <div
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.45)",
        }}
      />
      <div
        style={{
          width: inner,
          height: inner,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.45)",
        }}
      />
    </div>
  );
}

export function IntroScreen() {
  const [exited, setExited] = useState(false);
  const [ready, setReady] = useState(false);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, -260], [1, 0]);
  const scale = useTransform(y, [0, -260], [1, 0.94]);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      setExited(true);
    }
    setReady(true);
  }, []);

  function doExit() {
    const target = -(window.innerHeight * 1.15);
    animate(y, target, {
      type: "spring",
      stiffness: 180,
      damping: 26,
      onComplete: () => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setExited(true);
      },
    });
  }

  useEffect(() => {
    if (exited) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 20) doExit();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  });

  if (!ready || exited) return null;

  return (
    <motion.div
      style={{
        y,
        opacity,
        scale,
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        touchAction: "none",
        userSelect: "none",
        cursor: "grab",
      }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.55, bottom: 0.02 }}
      onDragEnd={(_, info) => {
        if (info.offset.y < -70 || info.velocity.y < -350) {
          doExit();
        } else {
          animate(y, 0, { type: "spring", stiffness: 500, damping: 35 });
        }
      }}
    >
      {/* Top spacer */}
      <div style={{ flex: 1 }} />

      {/* Center logo + wordmark */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <ConcentricMark size={72} />
        <span
          style={{
            fontWeight: 700,
            fontSize: 22,
            color: "rgba(255,255,255,0.90)",
            letterSpacing: "-0.03em",
          }}
        >
          hyperfix
        </span>
      </motion.div>

      {/* Bottom spacer */}
      <div style={{ flex: 1 }} />

      {/* Swipe cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          paddingBottom: 56,
        }}
      >
        <UpChevrons />
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)",
          }}
        >
          Swipe up to enter
        </span>
      </motion.div>
    </motion.div>
  );
}
