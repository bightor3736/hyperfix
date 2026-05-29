-- Allow rooms to be discoverable (public) or invite-only (private)
ALTER TABLE focus_rooms ADD COLUMN IF NOT EXISTS is_private BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS focus_rooms_discoverable_idx
  ON focus_rooms (is_active, is_private, last_activity DESC);
