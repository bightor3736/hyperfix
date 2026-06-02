-- Enable Supabase Realtime (Postgres Changes) for focus rooms so the shared
-- timer and member presence push instantly instead of relying on polling.
--
-- REPLICA IDENTITY FULL ensures UPDATE/DELETE payloads include the full row
-- (needed for the client to react to timer_state and member changes).

ALTER TABLE focus_rooms  REPLICA IDENTITY FULL;
ALTER TABLE room_members REPLICA IDENTITY FULL;

-- Add the tables to the realtime publication (idempotent).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'focus_rooms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE focus_rooms;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'room_members'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE room_members;
  END IF;
END $$;
