-- ADHD toolkit tables: brain dump, mood log, RSD journal, medication tracker

-- Brain dump / task capture
CREATE TABLE brain_dump (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content         TEXT        NOT NULL,
  status          TEXT        NOT NULL DEFAULT 'inbox',   -- inbox | doing | done | parked
  energy_required TEXT        NOT NULL DEFAULT 'any',     -- low | medium | high | any
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

-- Daily mood / energy / focus check-in
CREATE TABLE mood_logs (
  id         UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID  NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date       DATE  NOT NULL,
  energy     INT   NOT NULL CHECK (energy     BETWEEN 1 AND 10),
  focus      INT   NOT NULL CHECK (focus      BETWEEN 1 AND 10),
  mood       INT   NOT NULL CHECK (mood       BETWEEN 1 AND 10),
  note       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, date)
);

-- RSD journal (always private)
CREATE TABLE rsd_entries (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trigger    TEXT NOT NULL,
  content    TEXT NOT NULL,
  intensity  INT  NOT NULL DEFAULT 5 CHECK (intensity BETWEEN 1 AND 10),
  reframe    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Medication tracker
CREATE TABLE med_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  medication    TEXT NOT NULL,
  dose          TEXT NOT NULL DEFAULT '',
  taken_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effect_rating INT  CHECK (effect_rating BETWEEN 1 AND 10),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX ON brain_dump  (user_id, status);
CREATE INDEX ON brain_dump  (user_id, created_at DESC);
CREATE INDEX ON mood_logs   (user_id, date DESC);
CREATE INDEX ON rsd_entries (user_id, created_at DESC);
CREATE INDEX ON med_logs    (user_id, taken_at DESC);

-- RLS
ALTER TABLE brain_dump  ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsd_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE med_logs    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "brain_dump_own"  ON brain_dump  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mood_logs_own"   ON mood_logs   USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rsd_entries_own" ON rsd_entries USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "med_logs_own"    ON med_logs    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
