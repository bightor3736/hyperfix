"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, ArrowRight, Check, X, Zap, Clock } from "lucide-react";

/**
 * "Just Start" — the painkiller. ADHD brains don't lose at working, they lose
 * at *starting* (task paralysis). So the only thing we ask is that you begin,
 * and we reward the START, not the finish.
 *
 * The flow: name the thing you're avoiding → shrink it to the smallest first
 * move → commit to a tiny timer ("do 5 min, you can quit after") → cross the
 * line → get celebrated for starting. Started-but-unfinished tasks are kept
 * server-side (the Zeigarnik pull) so they bring you back across devices.
 */

type Task = {
  id: string;
  title: string;
  step: string;
  sessions: number;
  totalMinutes: number;
  lastStartedAt: string | null;
  createdAt: string;
};

type Phase = "idle" | "setup" | "running" | "done";

const DURATIONS = [2, 5, 10, 25];

// API rows come back snake_case; normalise to the local shape.
type TaskRow = {
  id: string;
  title: string;
  step: string;
  sessions: number;
  total_minutes: number;
  last_started_at: string | null;
  created_at: string;
};
function fromRow(r: TaskRow): Task {
  return {
    id: r.id,
    title: r.title,
    step: r.step ?? "",
    sessions: r.sessions ?? 0,
    totalMinutes: r.total_minutes ?? 0,
    lastStartedAt: r.last_started_at,
    createdAt: r.created_at,
  };
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function ago(iso: string | null): string {
  if (!iso) return "just now";
  const diff = Date.now() - Date.parse(iso);
  const days = Math.floor(diff / 86400000);
  if (days >= 1) return `${days}d ago`;
  const hrs = Math.floor(diff / 3600000);
  if (hrs >= 1) return `${hrs}h ago`;
  const mins = Math.floor(diff / 60000);
  if (mins >= 1) return `${mins}m ago`;
  return "just now";
}

export function JustStart({ welcome = false }: { welcome?: boolean }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const titleRef = useRef<HTMLInputElement | null>(null);

  // draft / active task fields
  const [title, setTitle] = useState("");
  const [step, setStep] = useState("");
  const [minutes, setMinutes] = useState(5);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // timer
  const [remaining, setRemaining] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load the user's open tasks.
  useEffect(() => {
    fetch("/api/start/tasks")
      .then((r) => (r.ok ? r.json() : { tasks: [] }))
      .then((d) => setTasks((d.tasks ?? []).map(fromRow)))
      .catch(() => { /* offline — start empty */ });
  }, []);

  // First run after onboarding: drop the cursor straight in the input so the
  // very first thing a new user does is start something (the <60s aha moment).
  useEffect(() => {
    if (welcome && phase === "idle") {
      const t = setTimeout(() => titleRef.current?.focus(), 400);
      return () => clearTimeout(t);
    }
  }, [welcome, phase]);

  // ── Begin a brand-new task ────────────────────────────────────────
  async function beginNew() {
    const t = title.trim();
    if (!t || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/start/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: t, step: step.trim() }),
      });
      const d = await res.json();
      if (d?.task) {
        const task = fromRow(d.task);
        setTasks((prev) => [task, ...prev]);
        setActiveId(task.id);
        setPhase("setup");
      }
    } catch {
      /* keep them in the form on failure */
    } finally {
      setSubmitting(false);
    }
  }

  // ── Re-open an existing avoided task ──────────────────────────────
  function resume(task: Task) {
    setTitle(task.title);
    setStep(task.step);
    setActiveId(task.id);
    setPhase("setup");
  }

  // ── Launch the timer ─────────────────────────────────────────────
  function launch() {
    setRemaining(minutes * 60);
    setRunning(true);
    setPhase("running");
  }

  const finish = useCallback(() => {
    setRunning(false);
    setRemaining(0);
    setPhase("done");

    // Optimistically book the session locally.
    setTasks((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? { ...t, sessions: t.sessions + 1, totalMinutes: t.totalMinutes + minutes, lastStartedAt: new Date().toISOString(), step: step.trim() || t.step }
          : t
      )
    );

    fetch("/api/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minutes, task: title, taskId: activeId, step: step.trim() }),
    })
      .then((r) => r.json())
      .then((d) => setEarnedXp(d?.xp ?? 20))
      .catch(() => setEarnedXp(20));

    // gentle chime
    try {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 740;
      gain.gain.value = 0.1;
      osc.start();
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      /* no audio */
    }
  }, [activeId, minutes, title, step]);

  // timer loop
  useEffect(() => {
    if (!running) {
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
    tickRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (tickRef.current) clearInterval(tickRef.current);
          finish();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [running, finish]);

  function reset() {
    setPhase("idle");
    setTitle("");
    setStep("");
    setMinutes(5);
    setActiveId(null);
    setRunning(false);
    setEarnedXp(0);
  }

  function markDone(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    fetch(`/api/start/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: true }),
    }).catch(() => { /* non-fatal */ });
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    fetch(`/api/start/tasks/${id}`, { method: "DELETE" }).catch(() => { /* non-fatal */ });
  }

  const activeTask = tasks.find((t) => t.id === activeId);
  const openTasks = tasks;

  // ──────────────────────────────────────────────────────────────────
  return (
    <section
      className="brutal-box-lg p-6 sm:p-7"
      style={{ background: "var(--bg-elevated)", border: "1.5px solid var(--line-strong)", borderRadius: 20, boxShadow: "var(--shadow-lg)" }}
    >
      {/* ── IDLE: name the monster + open tasks ────────────────────── */}
      {phase === "idle" && (
        <>
          <span className="brutal-tag mb-4" style={{ background: "var(--coral)", color: "#fff" }}>
            <Zap size={13} strokeWidth={3} /> {welcome ? "Welcome — let's start" : "Just start"}
          </span>
          <h2
            className="leading-[1.02] text-ink"
            style={{ fontSize: "clamp(26px,5vw,36px)", fontWeight: 800, letterSpacing: "-0.03em" }}
          >
            What are you avoiding?
          </h2>
          <p className="mt-2 text-[14px] font-medium leading-snug text-ink-muted">
            {welcome
              ? <>Name one thing right now — we&apos;ll get you over the line in 5 minutes. That&apos;s your first win.</>
              : <>Name it. You only have to <span className="text-ink" style={{ fontWeight: 700 }}>start</span> — you can quit after a few minutes.</>}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              beginNew();
            }}
            className="mt-5"
          >
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. the email I've been dreading"
              autoComplete="off"
              className="w-full px-4 py-3.5 text-[15px] font-medium text-ink outline-none"
              style={{ background: "var(--bg-soft)", border: "1.5px solid var(--line-strong)", borderRadius: 16 }}
            />
            <button
              type="submit"
              disabled={!title.trim() || submitting}
              className="brutal-btn mt-3 w-full py-3.5 text-[15px] disabled:opacity-40"
              style={{ background: "var(--accent)", color: "var(--accent-ink)", borderRadius: 16 }}
            >
              {submitting ? "One sec…" : <>Let&apos;s start <ArrowRight size={17} strokeWidth={3} /></>}
            </button>
          </form>

          {/* Open loops pull you back (Zeigarnik) */}
          {openTasks.length > 0 && (
            <div className="mt-7">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-faint">
                Still waiting on you
              </p>
              <ul className="mt-3 space-y-2.5">
                {openTasks.slice(0, 4).map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 p-3"
                    style={{ background: "var(--bg-soft)", border: "1px solid var(--line)", borderRadius: 16 }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold text-ink">{t.title}</p>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                        {t.sessions > 0
                          ? `${t.sessions} start${t.sessions === 1 ? "" : "s"} · ${t.totalMinutes}m in · ${ago(t.lastStartedAt)}`
                          : `added ${ago(t.createdAt)}`}
                      </p>
                    </div>
                    <button
                      onClick={() => resume(t)}
                      className="brutal-btn shrink-0 px-3 py-2 text-[12px]"
                      style={{ background: "var(--yellow)", color: "var(--ink)", borderRadius: 16 }}
                    >
                      <Play size={12} strokeWidth={3} fill="currentColor" /> Go
                    </button>
                    <button
                      onClick={() => markDone(t.id)}
                      aria-label="Mark done"
                      className="shrink-0 transition-colors"
                      style={{ color: "var(--ink-faint)" }}
                    >
                      <Check size={18} strokeWidth={3} />
                    </button>
                    <button
                      onClick={() => removeTask(t.id)}
                      aria-label="Remove"
                      className="shrink-0 text-ink-faint transition-opacity hover:opacity-60"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* ── SETUP: shrink it + the deal ────────────────────────────── */}
      {phase === "setup" && (
        <>
          <button
            onClick={reset}
            className="mb-4 font-mono text-[11px] font-bold uppercase tracking-widest text-ink-faint transition-colors hover:text-ink"
          >
            ← back
          </button>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-faint">Starting</p>
          <h2 className="mt-1 leading-[1.05] text-ink" style={{ fontSize: "clamp(22px,4.5vw,30px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
            {title}
          </h2>

          <label className="mt-5 block">
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-muted">
              What&apos;s the smallest first move?
            </span>
            <input
              value={step}
              onChange={(e) => setStep(e.target.value)}
              placeholder="e.g. just open the doc and write one line"
              autoComplete="off"
              className="mt-2 w-full px-4 py-3 text-[14px] font-medium text-ink outline-none"
              style={{ background: "var(--bg-soft)", border: "1.5px solid var(--line-strong)", borderRadius: 16 }}
            />
          </label>

          <div className="mt-5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-muted">How long?</span>
            <div className="mt-2 flex gap-2">
              {DURATIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMinutes(m)}
                  className="flex-1 py-2.5 font-mono text-[13px] font-bold transition-all"
                  style={
                    minutes === m
                      ? { background: "var(--ink)", color: "var(--bg)", border: "1.5px solid var(--line-strong)", borderRadius: 16 }
                      : { background: "var(--bg-elevated)", color: "var(--ink)", border: "1.5px solid var(--line-strong)", borderRadius: 16 }
                  }
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          {/* The 5-minute lie */}
          <div className="mt-5 p-4" style={{ background: "var(--yellow)", border: "1.5px solid var(--line-strong)", borderRadius: 16 }}>
            <p className="text-[14px] font-bold leading-snug text-ink">
              The deal: do {minutes} minutes. Then you&apos;re allowed to stop.
            </p>
            <p className="mt-1 text-[12px] font-medium leading-snug" style={{ color: "var(--ink)", opacity: 0.7 }}>
              (You probably won&apos;t want to. That&apos;s the whole trick.)
            </p>
          </div>

          <button
            onClick={launch}
            className="brutal-btn mt-5 w-full py-4 text-[16px]"
            style={{ background: "var(--coral)", color: "#fff", borderRadius: 16 }}
          >
            Start now <Play size={17} strokeWidth={3} fill="currentColor" />
          </button>
        </>
      )}

      {/* ── RUNNING: the timer ─────────────────────────────────────── */}
      {phase === "running" && (
        <div className="flex flex-col items-center text-center">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-faint">Working on</p>
          <h2 className="mt-1 leading-tight text-ink" style={{ fontSize: "clamp(18px,4vw,24px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {title}
          </h2>
          {(activeTask?.step || step) && (
            <p className="mt-2 inline-flex max-w-full items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-ink"
              style={{ background: "var(--bg-soft)", border: "1px solid var(--line)", borderRadius: 999 }}>
              <Clock size={12} strokeWidth={3} /> {activeTask?.step || step}
            </p>
          )}

          <p
            className="mt-6 tabular-nums leading-none text-ink"
            style={{ fontWeight: 800, letterSpacing: "-0.05em", fontSize: "clamp(64px,18vw,104px)" }}
          >
            {fmt(remaining)}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => setRunning((r) => !r)}
              className="brutal-btn px-7 py-3.5 text-[15px]"
              style={{ background: running ? "var(--bg-elevated)" : "var(--accent)", color: running ? "var(--ink)" : "var(--accent-ink)", borderRadius: 16 }}
            >
              {running ? <Pause size={17} strokeWidth={3} fill="currentColor" /> : <Play size={17} strokeWidth={3} fill="currentColor" />}
              {running ? "Pause" : "Resume"}
            </button>
            <button
              onClick={finish}
              className="brutal-btn px-5 py-3.5 text-[13px]"
              style={{ background: "var(--lime)", color: "var(--ink)", borderRadius: 16 }}
            >
              <Check size={16} strokeWidth={3} /> I started
            </button>
          </div>
          <button
            onClick={reset}
            className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-ink-faint transition-colors hover:text-ink"
          >
            <RotateCcw size={12} strokeWidth={3} /> cancel
          </button>
        </div>
      )}

      {/* ── DONE: celebrate the START ──────────────────────────────── */}
      {phase === "done" && (
        <div className="flex flex-col items-center text-center anim-pop">
          <div
            className="flex h-16 w-16 items-center justify-center anim-wiggle"
            style={{ background: "var(--lime)", border: "1.5px solid var(--line-strong)", borderRadius: 20, boxShadow: "var(--shadow-sm)" }}
          >
            <Check size={32} strokeWidth={3} style={{ color: "var(--ink)" }} />
          </div>
          <h2 className="mt-5 leading-none text-ink" style={{ fontSize: "clamp(30px,6vw,44px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
            You started.
          </h2>
          <p className="mt-2 text-[15px] font-medium leading-snug text-ink-muted">
            That was the hard part — and you did it.
          </p>

          <div
            className="mt-5 inline-flex items-center gap-2 px-4 py-2"
            style={{ background: "var(--xp)", color: "#fff", border: "1.5px solid var(--line-strong)", borderRadius: 999, boxShadow: "var(--shadow-sm)" }}
          >
            <Zap size={15} strokeWidth={3} fill="#fff" />
            <span className="font-mono text-[13px] font-bold uppercase tracking-wider">+{earnedXp} XP</span>
          </div>

          <div className="mt-7 flex w-full flex-col gap-2.5">
            <button
              onClick={launch}
              className="brutal-btn w-full py-3.5 text-[15px]"
              style={{ background: "var(--coral)", color: "#fff", borderRadius: 16 }}
            >
              Keep going — another round <ArrowRight size={16} strokeWidth={3} />
            </button>
            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  if (activeId) markDone(activeId);
                  reset();
                }}
                className="brutal-btn flex-1 py-3 text-[14px]"
                style={{ background: "var(--lime)", color: "var(--ink)", borderRadius: 16 }}
              >
                <Check size={15} strokeWidth={3} /> It&apos;s done
              </button>
              <button
                onClick={reset}
                className="brutal-btn flex-1 py-3 text-[14px]"
                style={{ background: "var(--bg-elevated)", color: "var(--ink)", borderRadius: 16 }}
              >
                Save for later
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
