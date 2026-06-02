#!/usr/bin/env python3
"""Regenerate _ALL_MIGRATIONS.sql as an idempotent, re-runnable script.

Transforms applied to each source migration so the consolidated file can be run
safely against a database in ANY state (fresh or partially migrated):

  - CREATE POLICY "x" ON t ...   -> prefixed with DROP POLICY IF EXISTS "x" ON t;
  - CREATE TABLE t (             -> CREATE TABLE IF NOT EXISTS t (
  - CREATE INDEX ON t (...)      -> wrapped in DO/EXCEPTION (unnamed indexes
                                    can't take IF NOT EXISTS)

Functions/triggers already use CREATE OR REPLACE; seed INSERTs already use
ON CONFLICT DO NOTHING; ALTER ... ADD COLUMN already uses IF NOT EXISTS.
"""
import re
from pathlib import Path

ORDER = [
    "001_init.sql", "002_reactions.sql", "003_following.sql", "004_pro.sql", "005_lists.sql",
    "006_comments.sql", "007_tags.sql", "008_profile_enhancements.sql", "009_studio.sql", "010_pro_features.sql",
    "20260517000001_create_waitlist.sql",
    "2026_05_25_banner_url_on_fixes.sql", "2026_05_25_card_style_on_fixes.sql", "2026_05_25_messages.sql",
    "2026_05_25_notification_prefs.sql", "2026_05_25_push_subscriptions.sql", "2026_05_25_timezone_on_profiles.sql",
    "2026_05_26_profiles_always_public.sql",
    "2026_05_29_focus_rooms.sql", "2026_05_29_focus_rooms_visibility.sql",
    "2026_05_31_adhd_features.sql", "2026_06_01_gamification.sql", "2026_06_02_streaks_monetization.sql",
    "2026_06_03_daily_quests.sql", "2026_06_04_dopamine.sql", "2026_06_05_walls.sql", "2026_06_06_signup_source.sql",
    "2026_06_07_onboarding_goals.sql", "2026_06_08_focus_realtime.sql", "2026_06_08_spotify_env_note.sql",
]

TABLE_RE = re.compile(r'^(\s*)create\s+table\s+(?!if\s+not\s+exists\b)(.*)$', re.IGNORECASE)
UNNAMED_IDX_RE = re.compile(r'^(\s*)create\s+index\s+on\s+(.*);\s*$', re.IGNORECASE)
# Policy name + target table may span newlines, so this runs over full text.
POLICY_RE = re.compile(
    r'(?P<indent>[ \t]*)create\s+policy\s+(?P<name>"(?:[^"]*)"|\S+)\s+on\s+(?P<table>\S+)',
    re.IGNORECASE | re.DOTALL,
)


def transform_line(line: str) -> str:
    m = UNNAMED_IDX_RE.match(line)
    if m:
        indent, body = m.groups()
        return f'{indent}DO $$ BEGIN CREATE INDEX ON {body}; EXCEPTION WHEN duplicate_table THEN NULL; END $$;'
    m = TABLE_RE.match(line)
    if m:
        indent, rest = m.groups()
        return f'{indent}CREATE TABLE IF NOT EXISTS {rest}'
    return line


def guard_policies(text: str) -> str:
    def repl(m: "re.Match[str]") -> str:
        indent, name, table = m.group("indent"), m.group("name"), m.group("table")
        return f'{indent}DROP POLICY IF EXISTS {name} ON {table};\n{m.group(0)}'
    return POLICY_RE.sub(repl, text)


def main():
    here = Path(__file__).parent
    out = ["-- " + "=" * 76,
           "-- HYPERFIX — CONSOLIDATED MIGRATIONS (idempotent, safe to re-run)",
           "-- Run this whole file against your Supabase project (SQL editor or psql).",
           "-- Guards added: DROP POLICY IF EXISTS, CREATE TABLE/INDEX IF NOT EXISTS.",
           "-- " + "=" * 76, ""]
    for fname in ORDER:
        path = here / fname
        if not path.exists():
            continue
        out.append("-- " + "-" * 76)
        out.append(f"-- {fname}")
        out.append("-- " + "-" * 76)
        body = "\n".join(transform_line(ln) for ln in path.read_text().splitlines())
        out.append(guard_policies(body))
        out.append("")
        out.append("")
    (here / "_ALL_MIGRATIONS.sql").write_text("\n".join(out))
    print(f"Wrote _ALL_MIGRATIONS.sql ({len(out)} lines)")


if __name__ == "__main__":
    main()
