-- Sawa V2 Seed Data
-- Run after migrations to populate V2 features
-- Date: 2026-01-14

-- ============================================
-- SLEEP PHOTO HABIT FOR AHMAD
-- ============================================

INSERT INTO habits (id, name, slug, type, category, icon, description, display_order)
VALUES (
    'b0000000-0000-0000-0000-000000000003',
    'Sleep Photo',
    'sleep-photo',
    'binary',
    'relationship',
    '🌙',
    'Send Reem the nightly sleep photo',
    9
) ON CONFLICT (slug) DO NOTHING;

-- Assign to Ahmad
INSERT INTO user_habits (user_id, habit_id)
SELECT 'a0000000-0000-0000-0000-000000000001', id FROM habits
WHERE slug = 'sleep-photo'
ON CONFLICT (user_id, habit_id) DO NOTHING;

-- ============================================
-- COUPLE INITIALIZATION
-- ============================================

INSERT INTO couple (id, total_xp, level)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    0,
    1
) ON CONFLICT DO NOTHING;

-- ============================================
-- DAILY QUESTIONS (150+ questions)
-- Mix: 60% tap-based, 30% one-word, 10% fill-blank
-- ============================================

-- === EMOJI PICK (Energy & Mood) ===
INSERT INTO daily_questions (question, question_type, options, category) VALUES
('How''s your energy right now?', 'emoji_pick', '["High", "Medium", "Low", "Running on fumes"]', 'mood'),
('What''s your vibe today?', 'emoji_pick', '["Productive", "Chill", "Stressed", "Meh"]', 'mood'),
('How did you sleep?', 'emoji_pick', '["Great", "Okay", "Badly", "What sleep?"]', 'daily_life'),
('How''s your mood right now?', 'emoji_pick', '["Happy", "Calm", "Tired", "Anxious"]', 'mood'),
('Energy check!', 'emoji_pick', '["100%", "70%", "40%", "Help"]', 'mood'),
('How''s your heart today?', 'emoji_pick', '["Full", "Content", "Heavy", "Light"]', 'mood'),
('Work mode or rest mode?', 'emoji_pick', '["Grind time", "Cruising", "Coasting", "Done"]', 'daily_life'),
('How hungry are you?', 'emoji_pick', '["Starving", "A bit", "Full", "Can''t eat"]', 'daily_life'),
('Social battery status?', 'emoji_pick', '["Fully charged", "Medium", "Low", "Drained"]', 'mood'),
('How''s your focus today?', 'emoji_pick', '["Laser sharp", "Decent", "Scattered", "What focus"]', 'daily_life'),
('Current stress level?', 'emoji_pick', '["Zero", "Manageable", "High", "Overwhelmed"]', 'mood'),
('How creative do you feel?', 'emoji_pick', '["Super creative", "A bit", "Not really", "Blocked"]', 'mood'),
('Body feeling today?', 'emoji_pick', '["Energized", "Normal", "Tired", "Sore"]', 'daily_life'),
('Mind state?', 'emoji_pick', '["Clear", "Busy", "Racing", "Foggy"]', 'mood'),
('Motivation level?', 'emoji_pick', '["Let''s go!", "Present", "Meh", "Zero"]', 'mood');

-- === THIS OR THAT (Preferences) ===
INSERT INTO daily_questions (question, question_type, options, category) VALUES
('Tonight you''d rather:', 'this_or_that', '["Netflix", "Go out"]', 'preferences'),
('For dinner:', 'this_or_that', '["Cook at home", "Order food"]', 'preferences'),
('Right now you want:', 'this_or_that', '["Company", "Alone time"]', 'preferences'),
('Your ideal weekend:', 'this_or_that', '["Adventure", "Relax"]', 'preferences'),
('You''d rather:', 'this_or_that', '["Beach", "Mountains"]', 'preferences'),
('Coffee or tea today?', 'this_or_that', '["Coffee", "Tea"]', 'preferences'),
('Right now:', 'this_or_that', '["Video call", "Voice call"]', 'preferences'),
('Movie night:', 'this_or_that', '["Comedy", "Drama"]', 'preferences'),
('For a treat:', 'this_or_that', '["Sweet", "Savory"]', 'preferences'),
('Tonight:', 'this_or_that', '["Early sleep", "Stay up late"]', 'preferences'),
('Weekend plan:', 'this_or_that', '["Productive", "Lazy"]', 'preferences'),
('Mood for:', 'this_or_that', '["Deep talk", "Light chat"]', 'preferences'),
('You prefer:', 'this_or_that', '["Hot weather", "Cold weather"]', 'preferences'),
('Music now:', 'this_or_that', '["Upbeat", "Chill"]', 'preferences'),
('Today needs:', 'this_or_that', '["Caffeine", "Nap"]', 'preferences'),
('You''d pick:', 'this_or_that', '["Sunrise", "Sunset"]', 'preferences'),
('Right now:', 'this_or_that', '["Work mode", "Play mode"]', 'preferences'),
('For comfort:', 'this_or_that', '["Food", "Blanket"]', 'preferences'),
('You want:', 'this_or_that', '["Hug", "Space"]', 'preferences'),
('This week:', 'this_or_that', '["Plan everything", "Go with flow"]', 'preferences');

-- === SCALE (1-5 Ratings) ===
INSERT INTO daily_questions (question, question_type, options, category) VALUES
('How much do you miss me?', 'scale', '["1", "2", "3", "4", "5"]', 'relationship'),
('Rate your day so far:', 'scale', '["1", "2", "3", "4", "5"]', 'mood'),
('How excited are you for this week?', 'scale', '["1", "2", "3", "4", "5"]', 'mood'),
('How productive today?', 'scale', '["1", "2", "3", "4", "5"]', 'daily_life'),
('How much do you need a break?', 'scale', '["1", "2", "3", "4", "5"]', 'mood'),
('How loved do you feel?', 'scale', '["1", "2", "3", "4", "5"]', 'relationship'),
('How much do you want to travel?', 'scale', '["1", "2", "3", "4", "5"]', 'dreams'),
('How grateful are you today?', 'scale', '["1", "2", "3", "4", "5"]', 'mood'),
('How ready for the weekend?', 'scale', '["1", "2", "3", "4", "5"]', 'daily_life'),
('How much do you need a hug?', 'scale', '["1", "2", "3", "4", "5"]', 'relationship'),
('How adventurous do you feel?', 'scale', '["1", "2", "3", "4", "5"]', 'mood'),
('How peaceful is today?', 'scale', '["1", "2", "3", "4", "5"]', 'mood'),
('How proud of yourself today?', 'scale', '["1", "2", "3", "4", "5"]', 'mood'),
('How much you want comfort food?', 'scale', '["1", "2", "3", "4", "5"]', 'daily_life'),
('How content right now?', 'scale', '["1", "2", "3", "4", "5"]', 'mood');

-- === QUICK VIBE (Send a Feeling) ===
INSERT INTO daily_questions (question, question_type, options, category) VALUES
('Send me a vibe:', 'quick_vibe', '["Miss you", "Love you", "Thinking of you", "Proud of you"]', 'relationship'),
('Quick vibe check:', 'quick_vibe', '["Good vibes", "Need energy", "Feeling blessed", "Meh"]', 'mood'),
('For your partner:', 'quick_vibe', '["Virtual hug", "You got this", "I believe in you", "Miss your face"]', 'relationship'),
('Right now I''m sending:', 'quick_vibe', '["Love", "Warmth", "Support", "Good energy"]', 'relationship'),
('Pick a vibe:', 'quick_vibe', '["Grateful", "Hopeful", "Peaceful", "Excited"]', 'mood'),
('To brighten their day:', 'quick_vibe', '["You''re amazing", "So proud of you", "Can''t wait to see you", "Love you lots"]', 'relationship'),
('Your energy:', 'quick_vibe', '["Fire", "Calm", "Sparkly", "Cozy"]', 'mood'),
('Send a feeling:', 'quick_vibe', '["Affection", "Admiration", "Gratitude", "Comfort"]', 'relationship'),
('Vibe for today:', 'quick_vibe', '["Main character energy", "Cozy energy", "Boss energy", "Soft energy"]', 'fun'),
('What you''re radiating:', 'quick_vibe', '["Joy", "Peace", "Strength", "Love"]', 'mood');

-- === ONE WORD (Quick Text) ===
INSERT INTO daily_questions (question, question_type, options, category) VALUES
('Your day in ONE word:', 'one_word', NULL, 'daily_life'),
('One word for how you feel:', 'one_word', NULL, 'mood'),
('What you need in one word:', 'one_word', NULL, 'mood'),
('One word about us:', 'one_word', NULL, 'relationship'),
('Describe your mood:', 'one_word', NULL, 'mood'),
('One word for this week:', 'one_word', NULL, 'daily_life'),
('What you''re thinking:', 'one_word', NULL, 'mood'),
('One word for your energy:', 'one_word', NULL, 'mood'),
('What you''re grateful for:', 'one_word', NULL, 'mood'),
('Your wish for today:', 'one_word', NULL, 'daily_life'),
('What you''re craving:', 'one_word', NULL, 'daily_life'),
('One word for tonight:', 'one_word', NULL, 'daily_life'),
('How work was in one word:', 'one_word', NULL, 'daily_life'),
('What I am to you in one word:', 'one_word', NULL, 'relationship'),
('Your goal today in one word:', 'one_word', NULL, 'daily_life'),
('One word for how you slept:', 'one_word', NULL, 'daily_life'),
('What you appreciate:', 'one_word', NULL, 'relationship'),
('Your current need:', 'one_word', NULL, 'mood'),
('One word for your heart:', 'one_word', NULL, 'mood'),
('What brings you joy:', 'one_word', NULL, 'mood'),
('One word for our love:', 'one_word', NULL, 'relationship'),
('Your spirit animal today:', 'one_word', NULL, 'fun'),
('One word for what I mean to you:', 'one_word', NULL, 'relationship'),
('Your superpower today:', 'one_word', NULL, 'fun'),
('What you''re looking forward to:', 'one_word', NULL, 'daily_life'),
('Color of your mood:', 'one_word', NULL, 'fun'),
('What drives you:', 'one_word', NULL, 'mood'),
('Your current anthem in one word:', 'one_word', NULL, 'fun'),
('What you want more of:', 'one_word', NULL, 'mood'),
('One word for our future:', 'one_word', NULL, 'dreams');

-- === FILL BLANK (Short Completion) ===
INSERT INTO daily_questions (question, question_type, options, category) VALUES
('Today I''m craving ___', 'fill_blank', NULL, 'daily_life'),
('I can''t stop thinking about ___', 'fill_blank', NULL, 'mood'),
('I wish we could ___', 'fill_blank', NULL, 'relationship'),
('Right now I really need ___', 'fill_blank', NULL, 'mood'),
('Today made me feel ___', 'fill_blank', NULL, 'mood'),
('I''m looking forward to ___', 'fill_blank', NULL, 'daily_life'),
('You make me feel ___', 'fill_blank', NULL, 'relationship'),
('My highlight today was ___', 'fill_blank', NULL, 'daily_life'),
('I''m grateful for ___', 'fill_blank', NULL, 'mood'),
('I really miss ___', 'fill_blank', NULL, 'relationship'),
('This week I want to ___', 'fill_blank', NULL, 'daily_life'),
('Together we should ___', 'fill_blank', NULL, 'relationship'),
('My dream right now is ___', 'fill_blank', NULL, 'dreams'),
('I love when you ___', 'fill_blank', NULL, 'relationship'),
('If I could, I''d ___', 'fill_blank', NULL, 'dreams');

-- === MORE EMOJI PICK (Various) ===
INSERT INTO daily_questions (question, question_type, options, category) VALUES
('What kind of day is it?', 'emoji_pick', '["Chill day", "Busy day", "Good day", "Long day"]', 'daily_life'),
('How''s your heart feeling?', 'emoji_pick', '["Full", "Light", "Heavy", "Warm"]', 'mood'),
('Weather match your mood?', 'emoji_pick', '["Sunny inside", "Cloudy", "Stormy", "Rainbow"]', 'fun'),
('Your inner animal today?', 'emoji_pick', '["Lion", "Cat", "Sloth", "Bunny"]', 'fun'),
('Season of your soul?', 'emoji_pick', '["Spring", "Summer", "Fall", "Winter"]', 'fun'),
('What you''re channeling:', 'emoji_pick', '["Boss energy", "Soft energy", "Chaos", "Peace"]', 'mood'),
('Current life mode:', 'emoji_pick', '["Thriving", "Surviving", "Vibing", "Struggling"]', 'mood'),
('Your love tank:', 'emoji_pick', '["Overflowing", "Full", "Half", "Need refill"]', 'relationship'),
('How present are you?', 'emoji_pick', '["Fully here", "Mostly", "Distracted", "Elsewhere"]', 'mood'),
('Your relationship vibe today:', 'emoji_pick', '["Romantic", "Cozy", "Playful", "Deep"]', 'relationship');

-- === MORE THIS OR THAT (Fun) ===
INSERT INTO daily_questions (question, question_type, options, category) VALUES
('Right now you feel like:', 'this_or_that', '["Main character", "Side character"]', 'fun'),
('Your love language today:', 'this_or_that', '["Words", "Acts of service"]', 'relationship'),
('You''d rather receive:', 'this_or_that', '["Surprise gift", "Planned date"]', 'relationship'),
('For us today:', 'this_or_that', '["Quality time", "Space to recharge"]', 'relationship'),
('Conversation mood:', 'this_or_that', '["Talk about feelings", "Talk about random stuff"]', 'relationship'),
('Date night vibe:', 'this_or_that', '["Fancy", "Casual"]', 'preferences'),
('Travel style:', 'this_or_that', '["Plan everything", "Spontaneous"]', 'preferences'),
('Morning you or night you?', 'this_or_that', '["Morning person today", "Night owl today"]', 'daily_life'),
('For comfort:', 'this_or_that', '["Your voice", "A message"]', 'relationship'),
('What you need:', 'this_or_that', '["Advice", "Just listening"]', 'mood');

-- === RELATIONSHIP SPECIFIC ===
INSERT INTO daily_questions (question, question_type, options, category) VALUES
('What I love about you today:', 'emoji_pick', '["Your smile", "Your mind", "Your heart", "Everything"]', 'relationship'),
('Our relationship feels:', 'emoji_pick', '["Strong", "Growing", "Cozy", "Exciting"]', 'relationship'),
('What I''m grateful for in us:', 'one_word', NULL, 'relationship'),
('I fell in love with you because ___', 'fill_blank', NULL, 'relationship'),
('When I think of you I feel:', 'emoji_pick', '["Warm", "Happy", "Lucky", "Peaceful"]', 'relationship'),
('Our next adventure should be:', 'this_or_that', '["Something new", "Somewhere familiar"]', 'relationship'),
('What makes us work:', 'one_word', NULL, 'relationship'),
('I appreciate you most when ___', 'fill_blank', NULL, 'relationship'),
('Our love is like:', 'emoji_pick', '["Fire", "Ocean", "Garden", "Home"]', 'relationship'),
('Distance makes me:', 'emoji_pick', '["Miss you more", "Appreciate you", "Stronger", "Impatient"]', 'relationship');

-- === DREAMS & FUTURE ===
INSERT INTO daily_questions (question, question_type, options, category) VALUES
('In 5 years we''ll be:', 'emoji_pick', '["Traveling", "Settled", "Adventuring", "Building"]', 'dreams'),
('Our dream home has:', 'this_or_that', '["Garden", "City view"]', 'dreams'),
('Next trip should be:', 'this_or_that', '["Relaxing", "Exploring"]', 'dreams'),
('Life goal priority:', 'emoji_pick', '["Career", "Family", "Adventure", "Peace"]', 'dreams'),
('Retirement dream:', 'this_or_that', '["Beach house", "Countryside"]', 'dreams'),
('Bucket list item:', 'one_word', NULL, 'dreams'),
('I dream about ___', 'fill_blank', NULL, 'dreams'),
('Together we''ll ___', 'fill_blank', NULL, 'dreams'),
('Our wedding will be:', 'emoji_pick', '["Intimate", "Grand", "Traditional", "Unique"]', 'dreams'),
('Future us vibe:', 'emoji_pick', '["Power couple", "Cozy couple", "Adventure couple", "Chill couple"]', 'dreams');

-- === MEMORIES ===
INSERT INTO daily_questions (question, question_type, options, category) VALUES
('A memory that makes you smile:', 'one_word', NULL, 'memories'),
('Best date we had:', 'one_word', NULL, 'memories'),
('Song that reminds you of us:', 'one_word', NULL, 'memories'),
('Place that means most:', 'one_word', NULL, 'memories'),
('Our funniest moment was ___', 'fill_blank', NULL, 'memories'),
('I always remember when you ___', 'fill_blank', NULL, 'memories'),
('Favorite thing we did together:', 'one_word', NULL, 'memories'),
('Moment I knew I loved you:', 'one_word', NULL, 'memories'),
('Our special thing:', 'one_word', NULL, 'memories'),
('What I''ll always treasure:', 'one_word', NULL, 'memories');

-- === FUN & RANDOM ===
INSERT INTO daily_questions (question, question_type, options, category) VALUES
('If you were a food:', 'emoji_pick', '["Pizza", "Ice cream", "Sushi", "Chocolate"]', 'fun'),
('Superhero you''d be:', 'emoji_pick', '["Flying hero", "Strong hero", "Invisible hero", "Mind reader"]', 'fun'),
('Your emoji today:', 'emoji_pick', '["Vibing", "Heart eyes", "Sleepy", "Fire"]', 'fun'),
('Random craving:', 'this_or_that', '["Ice cream", "Chips"]', 'fun'),
('If we had a pet:', 'this_or_that', '["Cat", "Dog"]', 'fun'),
('Your karaoke song:', 'one_word', NULL, 'fun'),
('Random thing you love:', 'one_word', NULL, 'fun'),
('Guilty pleasure:', 'one_word', NULL, 'fun'),
('Comfort show:', 'one_word', NULL, 'fun'),
('If I could teleport to you, I''d bring ___', 'fill_blank', NULL, 'fun');

-- ============================================
-- DAILY QUOTES (40+ quotes)
-- ============================================

INSERT INTO daily_quotes (quote, source, category) VALUES
-- Islamic
('And He found you lost and guided you.', 'Quran 93:7', 'islamic'),
('Verily, with hardship comes ease.', 'Quran 94:6', 'islamic'),
('So remember Me, I will remember you.', 'Quran 2:152', 'islamic'),
('And whoever puts their trust in Allah, He will be sufficient for them.', 'Quran 65:3', 'islamic'),
('Allah does not burden a soul beyond that it can bear.', 'Quran 2:286', 'islamic'),
('The best of people are those who bring most benefit to others.', 'Prophet Muhammad (PBUH)', 'islamic'),
('Be in this world as if you were a stranger or a traveler.', 'Prophet Muhammad (PBUH)', 'islamic'),
('The strong person is not the one who can wrestle someone else down. The strong person is the one who can control themselves when they are angry.', 'Prophet Muhammad (PBUH)', 'islamic'),
('Make things easy, do not make things difficult. Give glad tidings and do not drive people away.', 'Prophet Muhammad (PBUH)', 'islamic'),
('When Allah loves a servant, He tests them.', 'Prophet Muhammad (PBUH)', 'islamic'),
('Indeed, the patient will be given their reward without measure.', 'Quran 39:10', 'islamic'),
('And your Lord is going to give you, and you will be satisfied.', 'Quran 93:5', 'islamic'),
('Do not lose hope in the mercy of Allah.', 'Quran 39:53', 'islamic'),
('For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.', 'Quran 94:5-6', 'islamic'),
('My mercy encompasses all things.', 'Quran 7:156', 'islamic'),

-- Love
('The greatest thing you''ll ever learn is just to love and be loved in return.', 'Eden Ahbez', 'love'),
('Love is composed of a single soul inhabiting two bodies.', 'Aristotle', 'love'),
('In all the world, there is no heart for me like yours.', 'Maya Angelou', 'love'),
('I have found the one whom my soul loves.', 'Song of Solomon 3:4', 'love'),
('Whatever our souls are made of, his and mine are the same.', 'Emily Bronte', 'love'),
('You are my today and all of my tomorrows.', 'Leo Christopher', 'love'),
('The best thing to hold onto in life is each other.', 'Audrey Hepburn', 'love'),
('Love recognizes no barriers.', 'Maya Angelou', 'love'),
('To be fully seen by somebody, and be loved anyhow - this is a human offering that can border on miraculous.', 'Elizabeth Gilbert', 'love'),
('Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.', 'Unknown', 'love'),
('Grow old with me, the best is yet to be.', 'Robert Browning', 'love'),
('You don''t love someone for their looks, or their clothes, or their fancy car, but because they sing a song only you can hear.', 'Oscar Wilde', 'love'),
('Where there is love, there is life.', 'Mahatma Gandhi', 'love'),

-- Motivation
('The only way to do great work is to love what you do.', 'Steve Jobs', 'motivation'),
('Start where you are. Use what you have. Do what you can.', 'Arthur Ashe', 'motivation'),
('Believe you can and you''re halfway there.', 'Theodore Roosevelt', 'motivation'),
('The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt', 'motivation'),
('It is never too late to be what you might have been.', 'George Eliot', 'motivation'),
('What you get by achieving your goals is not as important as what you become by achieving your goals.', 'Zig Ziglar', 'motivation'),
('The only impossible journey is the one you never begin.', 'Tony Robbins', 'motivation'),
('Don''t watch the clock; do what it does. Keep going.', 'Sam Levenson', 'motivation'),
('Success is not final, failure is not fatal: it is the courage to continue that counts.', 'Winston Churchill', 'motivation'),
('You are never too old to set another goal or to dream a new dream.', 'C.S. Lewis', 'motivation'),
('The secret of getting ahead is getting started.', 'Mark Twain', 'motivation'),
('Everything you''ve ever wanted is on the other side of fear.', 'George Addair', 'motivation'),
('Your limitation—it''s only your imagination.', 'Unknown', 'motivation');

-- ============================================
-- QUEST TEMPLATES
-- ============================================

INSERT INTO quests (title, description, xp_reward, quest_type, conditions) VALUES
-- Daily quests
('Fajr Together', 'Both pray Fajr today', 50, 'daily', '{"type": "both_complete", "habit": "fajr"}'),
('Prayer Warrior', 'Complete all 5 prayers', 30, 'daily', '{"type": "all_prayers", "count": 5}'),
('Perfect Habits', 'Complete all your habits today', 40, 'daily', '{"type": "all_habits"}'),
('Connection Made', 'Complete the daily check-in', 15, 'daily', '{"type": "checkin_complete"}'),
('Question Time', 'Answer today''s question', 20, 'daily', '{"type": "question_answered"}'),
('Ritual Complete', 'Complete the quick ritual', 15, 'daily', '{"type": "ritual_complete"}'),
('Photo Love', 'Complete your photo habit', 15, 'daily', '{"type": "photo_habit"}'),
('Early Bird', 'Answer daily question before noon', 15, 'daily', '{"type": "early_question"}'),
('React with Love', 'Send a reaction to your partner', 10, 'daily', '{"type": "reaction_sent"}'),
('Both Check In', 'Both complete daily check-in', 25, 'daily', '{"type": "both_checkin"}'),
('Perfect Day', 'Complete ALL activities today', 100, 'daily', '{"type": "perfect_day"}'),

-- Weekly quests
('Prayer Streak', 'Pray all 5 prayers for 3 days in a row', 100, 'weekly', '{"type": "prayer_streak", "days": 3}'),
('Question Streak', 'Answer daily question 5 days in a row', 75, 'weekly', '{"type": "question_streak", "days": 5}'),
('Ritual Master', 'Complete ritual 4 days this week', 60, 'weekly', '{"type": "ritual_count", "count": 4}'),
('Check-in Champions', 'Both check in every day for a week', 150, 'weekly', '{"type": "both_checkin_streak", "days": 7}'),
('Reaction Spree', 'Send 10 reactions this week', 50, 'weekly', '{"type": "reaction_count", "count": 10}');

-- ============================================
-- VERIFICATION
-- ============================================

-- Uncomment to verify counts:
-- SELECT 'Questions' as table_name, count(*) as count FROM daily_questions
-- UNION ALL SELECT 'Quotes', count(*) FROM daily_quotes
-- UNION ALL SELECT 'Quests', count(*) FROM quests
-- UNION ALL SELECT 'Couple', count(*) FROM couple;
