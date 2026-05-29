-- Focus rooms: body-doubling + Pomodoro + voice + Spotify

CREATE TABLE focus_rooms (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  code          TEXT        NOT NULL UNIQUE,          -- 6-char invite code
  name          TEXT        NOT NULL,
  owner_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_active     BOOLEAN     NOT NULL DEFAULT true,
  max_members   INT         NOT NULL DEFAULT 12,

  -- Pomodoro timer state (owner controls, synced to everyone)
  timer_state   JSONB       NOT NULL DEFAULT '{"mode":"focus","remaining":1500,"isRunning":false,"round":1}',

  -- Spotify integration (owner only)
  spotify_access_token   TEXT,
  spotify_refresh_token  TEXT,
  spotify_expires_at     TIMESTAMPTZ,
  current_track          JSONB,   -- {name,artist,albumArt,progressMs,durationMs,isPlaying,trackId}

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE room_members (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     UUID        NOT NULL REFERENCES focus_rooms(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES profiles(id)    ON DELETE CASCADE,
  status      TEXT        NOT NULL DEFAULT 'focusing',  -- focusing | break | away
  task        TEXT        NOT NULL DEFAULT '',
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (room_id, user_id)
);

CREATE TABLE room_messages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id    UUID        NOT NULL REFERENCES focus_rooms(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES profiles(id)    ON DELETE CASCADE,
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX ON focus_rooms  (code);
CREATE INDEX ON focus_rooms  (owner_id);
CREATE INDEX ON room_members (room_id);
CREATE INDEX ON room_members (user_id);
CREATE INDEX ON room_messages(room_id, created_at);

-- RLS
ALTER TABLE focus_rooms   ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_messages ENABLE ROW LEVEL SECURITY;

-- focus_rooms: anyone authenticated can read active rooms they're in;
--              only owner can update; anyone can create
CREATE POLICY "rooms_select" ON focus_rooms FOR SELECT USING (true);
CREATE POLICY "rooms_insert" ON focus_rooms FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "rooms_update" ON focus_rooms FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "rooms_delete" ON focus_rooms FOR DELETE USING (auth.uid() = owner_id);

-- room_members: anyone can see membership; you manage your own row
CREATE POLICY "members_select" ON room_members FOR SELECT USING (true);
CREATE POLICY "members_insert" ON room_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "members_update" ON room_members FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "members_delete" ON room_members FOR DELETE USING (auth.uid() = user_id);

-- room_messages: readable by all members, writable by authenticated users
CREATE POLICY "messages_select" ON room_messages FOR SELECT USING (true);
CREATE POLICY "messages_insert" ON room_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
