ALTER TABLE schedule_entries
  ADD COLUMN IF NOT EXISTS calendar_event_id TEXT;
