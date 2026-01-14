-- Sawa V2 Database Schema
-- Migration: 002_sawa_v2
-- Date: 2026-01-14
-- Description: V2 features - XP, questions, check-ins, rituals, reactions, quests, inbox

-- ============================================
-- NEW TYPES
-- ============================================

-- Question types for daily questions
CREATE TYPE question_type AS ENUM (
    'emoji_pick',    -- Select an emoji
    'this_or_that',  -- Choose between two options
    'scale',         -- Rate 1-5
    'quick_vibe',    -- Send a preset vibe
    'one_word',      -- Type one word
    'fill_blank'     -- Complete a sentence
);

-- Question categories
CREATE TYPE question_category AS ENUM (
    'mood',
    'relationship',
    'fun',
    'dreams',
    'memories',
    'daily_life',
    'preferences'
);

-- Mood options for check-ins
CREATE TYPE mood_type AS ENUM (
    'great',
    'okay',
    'low',
    'stressed',
    'tired',
    'excited'
);

-- Reaction types
CREATE TYPE reaction_type AS ENUM ('heart', 'celebrate');

-- Inbox categories
CREATE TYPE inbox_category AS ENUM ('idea', 'todo', 'dream', 'memory');

-- Activity types for feed
CREATE TYPE activity_type AS ENUM (
    'habit_complete',
    'prayer_complete',
    'question_answered',
    'checkin_complete',
    'ritual_complete',
    'reaction_sent',
    'quest_complete',
    'level_up',
    'inbox_added',
    'wish_added'
);

-- ============================================
-- MODIFY EXISTING TABLES
-- ============================================

-- Add XP tracking to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;

-- ============================================
-- NEW TABLES
-- ============================================

-- Couple progress tracking (single row for Ahmad & Reem)
CREATE TABLE couple (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily questions bank
CREATE TABLE daily_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    question_type question_type NOT NULL,
    options JSONB, -- For tap-based questions: ["option1", "option2", ...]
    category question_category NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily question assignments (which question for which day)
CREATE TABLE daily_question_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES daily_questions(id) ON DELETE CASCADE,
    date DATE NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Question responses
CREATE TABLE question_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES daily_questions(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    answer TEXT NOT NULL,
    shuffles_used INTEGER DEFAULT 0, -- Track shuffles per day
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Daily check-ins (mood pulse)
CREATE TABLE check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    mood mood_type NOT NULL,
    note TEXT, -- Optional, max 50 chars
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Quick ritual responses
CREATE TABLE ritual_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    mood mood_type,
    energy INTEGER CHECK (energy >= 1 AND energy <= 5),
    vibe TEXT, -- The vibe sent to partner
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Reactions (heart/celebrate on partner actions)
CREATE TABLE reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL, -- 'habit', 'prayer', 'question', 'checkin', 'ritual'
    target_id UUID NOT NULL,
    reaction reaction_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quest templates
CREATE TABLE quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    xp_reward INTEGER NOT NULL,
    quest_type TEXT NOT NULL, -- 'daily', 'weekly', 'special'
    conditions JSONB NOT NULL, -- Define what needs to happen
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quest progress (tracked per day)
CREATE TABLE quest_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    UNIQUE(quest_id, date)
);

-- Daily quotes bank
CREATE TABLE daily_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote TEXT NOT NULL,
    source TEXT, -- Attribution
    category TEXT, -- 'islamic', 'love', 'motivation'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily quote assignments
CREATE TABLE daily_quote_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID NOT NULL REFERENCES daily_quotes(id) ON DELETE CASCADE,
    date DATE NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wish list
CREATE TABLE wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    fulfilled BOOLEAN DEFAULT FALSE,
    fulfilled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared inbox
CREATE TABLE inbox_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    added_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category inbox_category NOT NULL,
    title TEXT NOT NULL,
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log (for feed)
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity activity_type NOT NULL,
    description TEXT NOT NULL,
    target_type TEXT, -- What the activity refers to
    target_id UUID,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Questions
CREATE INDEX idx_daily_questions_type ON daily_questions(question_type);
CREATE INDEX idx_daily_questions_category ON daily_questions(category);
CREATE INDEX idx_question_assignments_date ON daily_question_assignments(date);

-- Responses
CREATE INDEX idx_question_responses_user_date ON question_responses(user_id, date);
CREATE INDEX idx_check_ins_user_date ON check_ins(user_id, date);
CREATE INDEX idx_ritual_responses_user_date ON ritual_responses(user_id, date);

-- Reactions
CREATE INDEX idx_reactions_from_user ON reactions(from_user_id);
CREATE INDEX idx_reactions_to_user ON reactions(to_user_id);
CREATE INDEX idx_reactions_target ON reactions(target_type, target_id);

-- Quests
CREATE INDEX idx_quest_progress_date ON quest_progress(date);
CREATE INDEX idx_quest_progress_quest ON quest_progress(quest_id);

-- Activity
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);

-- Inbox
CREATE INDEX idx_inbox_items_category ON inbox_items(category);
CREATE INDEX idx_inbox_items_added_by ON inbox_items(added_by);

-- Wishes
CREATE INDEX idx_wishes_user ON wishes(user_id);

-- Quotes
CREATE INDEX idx_quote_assignments_date ON daily_quote_assignments(date);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update couple.updated_at
CREATE TRIGGER couple_updated_at
    BEFORE UPDATE ON couple
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE couple ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_question_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE ritual_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quote_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbox_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Permissive policies for V1 (couple sharing everything)
-- Couple
CREATE POLICY "Couple is viewable by everyone" ON couple FOR SELECT USING (true);
CREATE POLICY "Anyone can update couple" ON couple FOR UPDATE USING (true);

-- Questions
CREATE POLICY "Questions are viewable by everyone" ON daily_questions FOR SELECT USING (true);
CREATE POLICY "Question assignments are viewable by everyone" ON daily_question_assignments FOR SELECT USING (true);

-- Question responses
CREATE POLICY "Question responses are viewable by everyone" ON question_responses FOR SELECT USING (true);
CREATE POLICY "Anyone can insert question responses" ON question_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update question responses" ON question_responses FOR UPDATE USING (true);

-- Check-ins
CREATE POLICY "Check-ins are viewable by everyone" ON check_ins FOR SELECT USING (true);
CREATE POLICY "Anyone can insert check-ins" ON check_ins FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update check-ins" ON check_ins FOR UPDATE USING (true);

-- Ritual responses
CREATE POLICY "Ritual responses are viewable by everyone" ON ritual_responses FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ritual responses" ON ritual_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update ritual responses" ON ritual_responses FOR UPDATE USING (true);

-- Reactions
CREATE POLICY "Reactions are viewable by everyone" ON reactions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reactions" ON reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete reactions" ON reactions FOR DELETE USING (true);

-- Quests
CREATE POLICY "Quests are viewable by everyone" ON quests FOR SELECT USING (true);
CREATE POLICY "Quest progress is viewable by everyone" ON quest_progress FOR SELECT USING (true);
CREATE POLICY "Anyone can insert quest progress" ON quest_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update quest progress" ON quest_progress FOR UPDATE USING (true);

-- Quotes
CREATE POLICY "Quotes are viewable by everyone" ON daily_quotes FOR SELECT USING (true);
CREATE POLICY "Quote assignments are viewable by everyone" ON daily_quote_assignments FOR SELECT USING (true);

-- Wishes
CREATE POLICY "Wishes are viewable by everyone" ON wishes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert wishes" ON wishes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update wishes" ON wishes FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete wishes" ON wishes FOR DELETE USING (true);

-- Inbox
CREATE POLICY "Inbox items are viewable by everyone" ON inbox_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert inbox items" ON inbox_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update inbox items" ON inbox_items FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete inbox items" ON inbox_items FOR DELETE USING (true);

-- Activity log
CREATE POLICY "Activity log is viewable by everyone" ON activity_log FOR SELECT USING (true);
CREATE POLICY "Anyone can insert activity log" ON activity_log FOR INSERT WITH CHECK (true);

-- ============================================
-- REALTIME
-- ============================================

-- Enable realtime for interactive tables
ALTER PUBLICATION supabase_realtime ADD TABLE question_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE check_ins;
ALTER PUBLICATION supabase_realtime ADD TABLE ritual_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_log;
ALTER PUBLICATION supabase_realtime ADD TABLE couple;
ALTER PUBLICATION supabase_realtime ADD TABLE inbox_items;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE couple IS 'Single row tracking couple XP and level';
COMMENT ON TABLE daily_questions IS 'Bank of daily questions (150+)';
COMMENT ON TABLE daily_question_assignments IS 'Which question is assigned to which date';
COMMENT ON TABLE question_responses IS 'User answers to daily questions';
COMMENT ON TABLE check_ins IS 'Daily mood check-ins';
COMMENT ON TABLE ritual_responses IS 'Quick 3-tap ritual responses';
COMMENT ON TABLE reactions IS 'Heart/celebrate reactions on partner actions';
COMMENT ON TABLE quests IS 'Daily/weekly quest templates';
COMMENT ON TABLE quest_progress IS 'Quest completion tracking by date';
COMMENT ON TABLE daily_quotes IS 'Bank of inspirational quotes';
COMMENT ON TABLE daily_quote_assignments IS 'Which quote is assigned to which date';
COMMENT ON TABLE wishes IS 'Personal wish lists visible to partner';
COMMENT ON TABLE inbox_items IS 'Shared categorized inbox (ideas, todos, dreams, memories)';
COMMENT ON TABLE activity_log IS 'Activity feed for real-time visibility';
