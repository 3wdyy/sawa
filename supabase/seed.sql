-- Sawa Seed Data
-- Run after migrations to populate initial data
-- Date: 2026-01-12

-- ============================================
-- USERS
-- ============================================

-- Insert Ahmad
INSERT INTO users (id, name, slug, timezone, city, country)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Ahmad',
    'ahmad',
    'Asia/Dubai',
    'Dubai',
    'AE'
);

-- Insert Reem
INSERT INTO users (id, name, slug, timezone, city, country)
VALUES (
    'a0000000-0000-0000-0000-000000000002',
    'Reem',
    'reem',
    'Africa/Cairo',
    'Cairo', -- Update to her actual city
    'EG'
);

-- Link partners (bidirectional)
UPDATE users SET partner_id = 'a0000000-0000-0000-0000-000000000002' WHERE slug = 'ahmad';
UPDATE users SET partner_id = 'a0000000-0000-0000-0000-000000000001' WHERE slug = 'reem';

-- ============================================
-- HABITS
-- ============================================

-- Morning Photo (Reem's habit)
INSERT INTO habits (id, name, slug, type, category, icon, description, display_order)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'Morning Photo',
    'morning-photo',
    'binary',
    'relationship',
    '📸',
    'Send Ahmad the daily morning photo',
    1
);

-- Daily Call (Both)
INSERT INTO habits (id, name, slug, type, category, icon, description, display_order)
VALUES (
    'b0000000-0000-0000-0000-000000000002',
    'Daily Call',
    'daily-call',
    'dual_confirm',
    'relationship',
    '📞',
    'Have our daily call together',
    10
);

-- ============================================
-- PRAYER HABITS
-- These are shared habits but tracked individually
-- ============================================

INSERT INTO habits (id, name, slug, type, category, icon, prayer_name, display_order)
VALUES
    ('b0000000-0000-0000-0000-000000000010', 'Fajr', 'fajr', 'prayer', 'religious', '🌅', 'fajr', 2),
    ('b0000000-0000-0000-0000-000000000011', 'Dhuhr', 'dhuhr', 'prayer', 'religious', '☀️', 'dhuhr', 3),
    ('b0000000-0000-0000-0000-000000000012', 'Asr', 'asr', 'prayer', 'religious', '🌤️', 'asr', 4),
    ('b0000000-0000-0000-0000-000000000013', 'Maghrib', 'maghrib', 'prayer', 'religious', '🌅', 'maghrib', 5),
    ('b0000000-0000-0000-0000-000000000014', 'Isha', 'isha', 'prayer', 'religious', '🌙', 'isha', 6);

-- ============================================
-- USER-HABIT ASSIGNMENTS
-- ============================================

-- Ahmad's habits: Daily Call + 5 Prayers
INSERT INTO user_habits (user_id, habit_id)
SELECT 'a0000000-0000-0000-0000-000000000001', id FROM habits
WHERE slug IN ('daily-call', 'fajr', 'dhuhr', 'asr', 'maghrib', 'isha');

-- Reem's habits: Morning Photo + Daily Call + 5 Prayers
INSERT INTO user_habits (user_id, habit_id)
SELECT 'a0000000-0000-0000-0000-000000000002', id FROM habits
WHERE slug IN ('morning-photo', 'daily-call', 'fajr', 'dhuhr', 'asr', 'maghrib', 'isha');

-- ============================================
-- VERIFICATION QUERIES
-- Run these to verify seed worked correctly
-- ============================================

-- Uncomment to verify:
-- SELECT 'Users' as table_name, count(*) as count FROM users
-- UNION ALL SELECT 'Habits', count(*) FROM habits
-- UNION ALL SELECT 'User Habits', count(*) FROM user_habits;

-- SELECT u.name, h.name as habit
-- FROM user_habits uh
-- JOIN users u ON uh.user_id = u.id
-- JOIN habits h ON uh.habit_id = h.id
-- ORDER BY u.name, h.display_order;
