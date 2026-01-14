-- Sawa Database Schema
-- Migration: 001_initial_schema
-- Date: 2026-01-12
-- Description: Initial schema for couple habit tracker

-- ============================================
-- TYPES
-- ============================================

-- Habit tracking types
CREATE TYPE habit_type AS ENUM ('binary', 'prayer', 'dual_confirm');

-- Habit categories for grouping
CREATE TYPE habit_category AS ENUM ('religious', 'relationship', 'health', 'productivity');

-- Prayer names (for prayer-type habits)
CREATE TYPE prayer_name AS ENUM ('fajr', 'dhuhr', 'asr', 'maghrib', 'isha');

-- ============================================
-- TABLES
-- ============================================

-- Users table
-- Note: Designed to work with simple selection now, can link to auth.users later
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- 'ahmad' or 'reem' for simple selection
    timezone TEXT NOT NULL DEFAULT 'UTC',
    city TEXT, -- For prayer times API
    country TEXT, -- For prayer times API
    partner_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habits table
-- Predefined habits that users can track
CREATE TABLE habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- e.g., 'fajr', 'morning-photo', 'daily-call'
    type habit_type NOT NULL,
    category habit_category NOT NULL,
    icon TEXT NOT NULL DEFAULT '📌', -- Emoji
    prayer_name prayer_name, -- Only for prayer-type habits
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User-Habit assignments
-- Which habits each user tracks
CREATE TABLE user_habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Each user can only have each habit once
    UNIQUE(user_id, habit_id)
);

-- Habit logs
-- Individual completions of habits
CREATE TABLE habit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,

    -- Date in user's local timezone (for grouping by day)
    date DATE NOT NULL,

    -- Flexible value storage per habit type
    -- Binary: { "done": true }
    -- Prayer: { "done": true, "on_time": true }
    -- Dual confirm: { "done": true }
    value JSONB NOT NULL DEFAULT '{"done": true}'::jsonb,

    -- Exact timestamp of completion
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- One log per user per habit per day
    UNIQUE(user_id, habit_id, date)
);

-- ============================================
-- INDEXES
-- ============================================

-- Fast lookup for user's daily habits
CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, date);

-- Fast lookup for habit completions by date
CREATE INDEX idx_habit_logs_habit_date ON habit_logs(habit_id, date);

-- Fast partner lookup
CREATE INDEX idx_users_partner ON users(partner_id);

-- Fast habit lookup by slug
CREATE INDEX idx_habits_slug ON habits(slug);

-- Fast user lookup by slug
CREATE INDEX idx_users_slug ON users(slug);

-- User habits lookup
CREATE INDEX idx_user_habits_user ON user_habits(user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

-- For now, allow all authenticated users to read everything
-- (Just 2 users, both should see everything)
-- These policies are permissive for V1, can tighten later with proper auth

-- Users: Everyone can read all users
CREATE POLICY "Users are viewable by everyone"
    ON users FOR SELECT
    USING (true);

-- Habits: Everyone can read all habits
CREATE POLICY "Habits are viewable by everyone"
    ON habits FOR SELECT
    USING (true);

-- User habits: Everyone can read all user habits
CREATE POLICY "User habits are viewable by everyone"
    ON user_habits FOR SELECT
    USING (true);

-- Habit logs: Everyone can read all logs (couple sharing)
CREATE POLICY "Habit logs are viewable by everyone"
    ON habit_logs FOR SELECT
    USING (true);

-- Habit logs: Anyone can insert (for V1 without auth)
CREATE POLICY "Anyone can insert habit logs"
    ON habit_logs FOR INSERT
    WITH CHECK (true);

-- Habit logs: Anyone can update their own logs
CREATE POLICY "Anyone can update habit logs"
    ON habit_logs FOR UPDATE
    USING (true);

-- Habit logs: Anyone can delete their own logs
CREATE POLICY "Anyone can delete habit logs"
    ON habit_logs FOR DELETE
    USING (true);

-- ============================================
-- REALTIME
-- ============================================

-- Enable realtime for habit_logs (core feature)
ALTER PUBLICATION supabase_realtime ADD TABLE habit_logs;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'App users - currently just Ahmad and Reem';
COMMENT ON TABLE habits IS 'Predefined habits that can be tracked';
COMMENT ON TABLE user_habits IS 'Which habits each user is tracking';
COMMENT ON TABLE habit_logs IS 'Individual habit completions - the core data';

COMMENT ON COLUMN users.slug IS 'URL-friendly identifier for simple auth';
COMMENT ON COLUMN users.partner_id IS 'Reference to the other user in the couple';
COMMENT ON COLUMN habits.prayer_name IS 'Only set for prayer-type habits';
COMMENT ON COLUMN habit_logs.date IS 'Local date for the user, used for daily grouping';
COMMENT ON COLUMN habit_logs.value IS 'Flexible JSON for different habit types';
