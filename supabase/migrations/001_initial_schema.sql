-- ==============================================================================
-- KIZUNA GAMIFICATION APP - FULL SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ENUMS DEFINITIONS
-- ------------------------------------------------------------------------------

CREATE TYPE epic_status AS ENUM ('active', 'completed', 'abandoned');
CREATE TYPE quest_status AS ENUM ('active', 'completed', 'abandoned');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE habit_frequency AS ENUM ('daily', 'weekly', 'monthly');
CREATE TYPE attribute_type AS ENUM ('str', 'dex', 'int', 'wis', 'cha', 'con');
CREATE TYPE entity_type AS ENUM ('epic', 'quest', 'task', 'habit', 'reward');
CREATE TYPE action_type AS ENUM ('created', 'completed', 'redeemed', 'archived');
CREATE TYPE mood_type AS ENUM ('amazing', 'good', 'neutral', 'bad', 'terrible');

-- ------------------------------------------------------------------------------
-- 2. TABLES DEFINITIONS
-- ------------------------------------------------------------------------------

-- USERS TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  total_level INT NOT NULL DEFAULT 1,
  total_xp INT NOT NULL DEFAULT 0,
  str_level INT NOT NULL DEFAULT 1,
  str_xp INT NOT NULL DEFAULT 0,
  dex_level INT NOT NULL DEFAULT 1,
  dex_xp INT NOT NULL DEFAULT 0,
  int_level INT NOT NULL DEFAULT 1,
  int_xp INT NOT NULL DEFAULT 0,
  wis_level INT NOT NULL DEFAULT 1,
  wis_xp INT NOT NULL DEFAULT 0,
  cha_level INT NOT NULL DEFAULT 1,
  cha_xp INT NOT NULL DEFAULT 0,
  con_level INT NOT NULL DEFAULT 1,
  con_xp INT NOT NULL DEFAULT 0,
  current_streak INT NOT NULL DEFAULT 0,
  best_streak INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EPICS TABLE
CREATE TABLE epics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status epic_status NOT NULL DEFAULT 'active',
  target_date DATE,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- QUESTS TABLE
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  epic_id UUID REFERENCES epics(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status quest_status NOT NULL DEFAULT 'active',
  reward_points INT NOT NULL DEFAULT 50,
  attribute_type attribute_type NOT NULL DEFAULT 'str',
  attribute_xp INT NOT NULL DEFAULT 25,
  target_date DATE,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TASKS TABLE
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id UUID REFERENCES quests(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'pending',
  reward_points INT NOT NULL DEFAULT 20,
  attribute_type attribute_type NOT NULL DEFAULT 'str',
  attribute_xp INT NOT NULL DEFAULT 10,
  due_date DATE,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HABITS TABLE
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  reward_points INT NOT NULL DEFAULT 15,
  attribute_type attribute_type NOT NULL DEFAULT 'str',
  attribute_xp INT NOT NULL DEFAULT 10,
  frequency habit_frequency NOT NULL DEFAULT 'daily',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- REWARDS TABLE
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cost_points INT NOT NULL DEFAULT 100,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ACTIVITY_LOG TABLE
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity_type entity_type NOT NULL,
  entity_id UUID NOT NULL,
  action_type action_type NOT NULL,
  points_change INT NOT NULL DEFAULT 0,
  attribute_xp_gained INT NOT NULL DEFAULT 0,
  attribute_type attribute_type,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- JOURNAL_ENTRIES TABLE
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  content TEXT NOT NULL,
  mood mood_type NOT NULL DEFAULT 'neutral',
  xp_bonus INT NOT NULL DEFAULT 25,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------------------------

CREATE INDEX idx_epics_user_id ON epics(user_id);
CREATE INDEX idx_quests_user_id ON quests(user_id);
CREATE INDEX idx_quests_epic_id ON quests(epic_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_quest_id ON tasks(quest_id);
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_rewards_user_id ON rewards(user_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE epics ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- USERS POLICIES
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- EPICS POLICIES
CREATE POLICY "Users can manage own epics" ON epics FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- QUESTS POLICIES
CREATE POLICY "Users can manage own quests" ON quests FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- TASKS POLICIES
CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- HABITS POLICIES
CREATE POLICY "Users can manage own habits" ON habits FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- REWARDS POLICIES
CREATE POLICY "Users can manage own rewards" ON rewards FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ACTIVITY LOG POLICIES
CREATE POLICY "Users can view own activity log" ON activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity log" ON activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- JOURNAL ENTRIES POLICIES
CREATE POLICY "Users can manage own journal entries" ON journal_entries FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. AUTOMATED ACTIVITY_LOG TRIGGER FUNCTIONS
-- ------------------------------------------------------------------------------

-- Function to handle automated activity logging upon completion / redemption
CREATE OR REPLACE FUNCTION fn_log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Log Quest completion
  IF (TG_TABLE_NAME = 'quests' AND NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed')) THEN
    INSERT INTO activity_log (user_id, entity_type, entity_id, action_type, points_change, attribute_xp_gained, attribute_type)
    VALUES (NEW.user_id, 'quest', NEW.id, 'completed', NEW.reward_points, NEW.attribute_xp, NEW.attribute_type);
  
  -- Log Task completion
  ELSIF (TG_TABLE_NAME = 'tasks' AND NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed')) THEN
    INSERT INTO activity_log (user_id, entity_type, entity_id, action_type, points_change, attribute_xp_gained, attribute_type)
    VALUES (NEW.user_id, 'task', NEW.id, 'completed', NEW.reward_points, NEW.attribute_xp, NEW.attribute_type);

  -- Log Epic completion
  ELSIF (TG_TABLE_NAME = 'epics' AND NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed')) THEN
    INSERT INTO activity_log (user_id, entity_type, entity_id, action_type, points_change, attribute_xp_gained, attribute_type)
    VALUES (NEW.user_id, 'epic', NEW.id, 'completed', 500, 250, 'str');

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach status change triggers
CREATE TRIGGER trg_quest_status_change
  AFTER UPDATE ON quests
  FOR EACH ROW
  EXECUTE FUNCTION fn_log_status_change();

CREATE TRIGGER trg_task_status_change
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION fn_log_status_change();

CREATE TRIGGER trg_epic_status_change
  AFTER UPDATE ON epics
  FOR EACH ROW
  EXECUTE FUNCTION fn_log_status_change();
