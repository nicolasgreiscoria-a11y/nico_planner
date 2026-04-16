-- =============================================================================
-- HabitCircuit: Multi-Tenant RLS Hardening
-- Ensures every table enforces full user isolation for public SaaS launch.
-- Applies SELECT, INSERT, UPDATE, DELETE policies on all 10 user-owned tables.
-- Safe to run on an existing database: uses CREATE POLICY IF NOT EXISTS pattern.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_delete_own" ON profiles
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- categories
-- -----------------------------------------------------------------------------
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_select_own" ON categories;
DROP POLICY IF EXISTS "categories_insert_own" ON categories;
DROP POLICY IF EXISTS "categories_update_own" ON categories;
DROP POLICY IF EXISTS "categories_delete_own" ON categories;

CREATE POLICY "categories_select_own" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "categories_insert_own" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "categories_update_own" ON categories
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "categories_delete_own" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- schedule_entries
-- -----------------------------------------------------------------------------
ALTER TABLE schedule_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "schedule_entries_select_own" ON schedule_entries;
DROP POLICY IF EXISTS "schedule_entries_insert_own" ON schedule_entries;
DROP POLICY IF EXISTS "schedule_entries_update_own" ON schedule_entries;
DROP POLICY IF EXISTS "schedule_entries_delete_own" ON schedule_entries;

CREATE POLICY "schedule_entries_select_own" ON schedule_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "schedule_entries_insert_own" ON schedule_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "schedule_entries_update_own" ON schedule_entries
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "schedule_entries_delete_own" ON schedule_entries
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- habits
-- -----------------------------------------------------------------------------
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "habits_select_own" ON habits;
DROP POLICY IF EXISTS "habits_insert_own" ON habits;
DROP POLICY IF EXISTS "habits_update_own" ON habits;
DROP POLICY IF EXISTS "habits_delete_own" ON habits;

CREATE POLICY "habits_select_own" ON habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "habits_insert_own" ON habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habits_update_own" ON habits
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habits_delete_own" ON habits
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- habit_logs
-- habit_logs.user_id must match the parent habit's user_id.
-- We enforce this by joining back to habits to prevent cross-user log injection.
-- -----------------------------------------------------------------------------
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "habit_logs_select_own" ON habit_logs;
DROP POLICY IF EXISTS "habit_logs_insert_own" ON habit_logs;
DROP POLICY IF EXISTS "habit_logs_update_own" ON habit_logs;
DROP POLICY IF EXISTS "habit_logs_delete_own" ON habit_logs;

CREATE POLICY "habit_logs_select_own" ON habit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "habit_logs_insert_own" ON habit_logs
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_logs.habit_id
        AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "habit_logs_update_own" ON habit_logs
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habit_logs_delete_own" ON habit_logs
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- weekly_tasks
-- -----------------------------------------------------------------------------
ALTER TABLE weekly_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "weekly_tasks_select_own" ON weekly_tasks;
DROP POLICY IF EXISTS "weekly_tasks_insert_own" ON weekly_tasks;
DROP POLICY IF EXISTS "weekly_tasks_update_own" ON weekly_tasks;
DROP POLICY IF EXISTS "weekly_tasks_delete_own" ON weekly_tasks;

CREATE POLICY "weekly_tasks_select_own" ON weekly_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "weekly_tasks_insert_own" ON weekly_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "weekly_tasks_update_own" ON weekly_tasks
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "weekly_tasks_delete_own" ON weekly_tasks
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- weekly_task_logs
-- Same parent-join guard as habit_logs.
-- -----------------------------------------------------------------------------
ALTER TABLE weekly_task_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "weekly_task_logs_select_own" ON weekly_task_logs;
DROP POLICY IF EXISTS "weekly_task_logs_insert_own" ON weekly_task_logs;
DROP POLICY IF EXISTS "weekly_task_logs_update_own" ON weekly_task_logs;
DROP POLICY IF EXISTS "weekly_task_logs_delete_own" ON weekly_task_logs;

CREATE POLICY "weekly_task_logs_select_own" ON weekly_task_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "weekly_task_logs_insert_own" ON weekly_task_logs
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM weekly_tasks
      WHERE weekly_tasks.id = weekly_task_logs.weekly_task_id
        AND weekly_tasks.user_id = auth.uid()
    )
  );

CREATE POLICY "weekly_task_logs_update_own" ON weekly_task_logs
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "weekly_task_logs_delete_own" ON weekly_task_logs
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- daily_todos
-- -----------------------------------------------------------------------------
ALTER TABLE daily_todos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "daily_todos_select_own" ON daily_todos;
DROP POLICY IF EXISTS "daily_todos_insert_own" ON daily_todos;
DROP POLICY IF EXISTS "daily_todos_update_own" ON daily_todos;
DROP POLICY IF EXISTS "daily_todos_delete_own" ON daily_todos;

CREATE POLICY "daily_todos_select_own" ON daily_todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "daily_todos_insert_own" ON daily_todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "daily_todos_update_own" ON daily_todos
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "daily_todos_delete_own" ON daily_todos
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- daily_notes
-- -----------------------------------------------------------------------------
ALTER TABLE daily_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "daily_notes_select_own" ON daily_notes;
DROP POLICY IF EXISTS "daily_notes_insert_own" ON daily_notes;
DROP POLICY IF EXISTS "daily_notes_update_own" ON daily_notes;
DROP POLICY IF EXISTS "daily_notes_delete_own" ON daily_notes;

CREATE POLICY "daily_notes_select_own" ON daily_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "daily_notes_insert_own" ON daily_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "daily_notes_update_own" ON daily_notes
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "daily_notes_delete_own" ON daily_notes
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- tasks (big events with optional Google Calendar sync)
-- -----------------------------------------------------------------------------
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tasks_select_own" ON tasks;
DROP POLICY IF EXISTS "tasks_insert_own" ON tasks;
DROP POLICY IF EXISTS "tasks_update_own" ON tasks;
DROP POLICY IF EXISTS "tasks_delete_own" ON tasks;

CREATE POLICY "tasks_select_own" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "tasks_insert_own" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasks_update_own" ON tasks
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasks_delete_own" ON tasks
  FOR DELETE USING (auth.uid() = user_id);
