-- GYMOS AI Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'coach')),
  auth_provider VARCHAR(20) DEFAULT 'email' CHECK (auth_provider IN ('email', 'google')),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(100),
  bio TEXT,
  date_of_birth DATE,
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm DECIMAL(5,2),
  weight_kg DECIMAL(5,2),
  activity_level VARCHAR(20) DEFAULT 'moderate',
  fitness_goal VARCHAR(30) DEFAULT 'general_fitness',
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SOCIAL LINKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FITNESS GOALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS fitness_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_type VARCHAR(30) NOT NULL,
  target_value DECIMAL(10,2),
  current_value DECIMAL(10,2),
  unit VARCHAR(20),
  deadline DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BODY METRICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS body_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  height_cm DECIMAL(5,2),
  weight_kg DECIMAL(5,2),
  age INTEGER,
  gender VARCHAR(20),
  activity_level VARCHAR(20),
  bmi DECIMAL(4,2),
  bmr DECIMAL(8,2),
  tdee DECIMAL(8,2),
  body_fat_percent DECIMAL(4,2),
  muscle_mass_kg DECIMAL(5,2),
  analysis_data JSONB,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WORKOUT PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS workout_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  workout_type VARCHAR(30),
  duration_minutes INTEGER,
  difficulty VARCHAR(20),
  plan_data JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NUTRITION PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS nutrition_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  diet_type VARCHAR(30),
  target_calories INTEGER,
  plan_data JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DAILY TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS daily_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_type VARCHAR(30) NOT NULL CHECK (task_type IN ('workout', 'nutrition', 'hydration', 'sleep', 'custom')),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_completed BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMPLETED TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS completed_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES daily_tasks(id) ON DELETE SET NULL,
  task_type VARCHAR(30) NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- SUPPLEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS supplements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal VARCHAR(50),
  recommendations JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROGRESS LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS progress_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2),
  body_fat_percent DECIMAL(4,2),
  muscle_mass_kg DECIMAL(5,2),
  measurements JSONB DEFAULT '{}',
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROGRESS PHOTOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS progress_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_type VARCHAR(20) CHECK (photo_type IN ('front', 'side', 'back', 'other')),
  caption TEXT,
  taken_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  achievement_type VARCHAR(30) DEFAULT 'milestone',
  icon VARCHAR(50),
  metadata JSONB DEFAULT '{}',
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STREAKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  streak_type VARCHAR(30) NOT NULL CHECK (streak_type IN ('workout', 'nutrition', 'login', 'hydration')),
  current_count INTEGER DEFAULT 0,
  longest_count INTEGER DEFAULT 0,
  last_activity TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, streak_type)
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(30) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'achievement', 'reminder')),
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_social_links_user_id ON social_links(user_id);
CREATE INDEX IF NOT EXISTS idx_fitness_goals_user_id ON fitness_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_body_metrics_user_id ON body_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_user_id ON workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_plans_user_id ON nutrition_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_id ON daily_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_date ON daily_tasks(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_completed_tasks_user_id ON completed_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_logs_user_id ON progress_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_photos_user_id ON progress_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own social links" ON social_links FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own fitness goals" ON fitness_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own body metrics" ON body_metrics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own workout plans" ON workout_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own nutrition plans" ON nutrition_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own daily tasks" ON daily_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own completed tasks" ON completed_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own supplements" ON supplements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress logs" ON progress_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress photos" ON progress_photos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own streaks" ON streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fitness_goals_updated_at BEFORE UPDATE ON fitness_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workout_plans_updated_at BEFORE UPDATE ON workout_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nutrition_plans_updated_at BEFORE UPDATE ON nutrition_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
