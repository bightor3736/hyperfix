-- ─────────────────────────────────────────────────────────────
-- Just Start: server-side store for the tasks a user is avoiding.
-- Each row is a *task* (not a session) so we can show "still waiting on
-- you" across devices and, later, send "that thing is still waiting"
-- reminders — the strongest ADHD return hook (Zeigarnik). We reward the
-- START, not the finish, so a task can be started many times before it's
-- marked done.
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS start_tasks (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT        NOT NULL,              -- the dreaded task, user's words
  step            TEXT        NOT NULL DEFAULT '',   -- smallest first move
  sessions        INT         NOT NULL DEFAULT 0,    -- times the user crossed the line
  total_minutes   INT         NOT NULL DEFAULT 0,    -- minutes actually started
  last_started_at TIMESTAMPTZ,                       -- powers "Xh ago" + reminders
  done_at         TIMESTAMPTZ,                       -- null = still open
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Open tasks per user, newest first — the "still waiting on you" query.
CREATE INDEX IF NOT EXISTS start_tasks_user_open
  ON start_tasks (user_id, done_at, created_at DESC);

ALTER TABLE start_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS start_tasks_own ON start_tasks;
CREATE POLICY start_tasks_own ON start_tasks
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
