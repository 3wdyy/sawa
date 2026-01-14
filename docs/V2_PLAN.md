# Sawa V2 - Complete Rebuild Plan

## The Vision

**Sawa is a relationship game for Ahmad and Reem.**

Not a habit tracker. Not a productivity app. A game you play together that:
- Creates daily moments of connection
- Builds healthy habits side-by-side
- Levels you up as a couple
- Gives visibility into each other's day
- Makes loving each other more fun

**Core emotional outcomes:**
- "I feel connected to Reem even when we're apart"
- "I know how she's doing today"
- "We're building something together"
- "This is fun, not a chore"

---

## Design Principles (CRITICAL)

### 1. Micro Over Macro
A 5-second tap beats a 2-minute reflection. If it requires thinking, most people skip it.

### 2. Accumulation is King
Every interaction adds to history. One day you'll have 6 months of moods, 500 vibes, 200 answers. The archive IS the value.

### 3. No Guilt, Only Reward
Missing a day doesn't punish. Completing rewards. Streaks are soft (celebrated, not enforced).

### 4. Low Friction is Survival
Both Ahmad and Reem overthink. Heavy questions = abandoned app. Make it effortless.

### 5. Sustainable for Years
Content must work for years, not weeks. Large question bank, variety, no repetition within 30 days.

---

## Complete Feature Set

### A. HABITS (Daily Actions)

| Habit | Owner | Type | Time Window | XP |
|-------|-------|------|-------------|-----|
| Fajr | Both | Prayer | Aladhan API (per timezone) | 10 |
| Dhuhr | Both | Prayer | Aladhan API (per timezone) | 10 |
| Asr | Both | Prayer | Aladhan API (per timezone) | 10 |
| Maghrib | Both | Prayer | Aladhan API (per timezone) | 10 |
| Isha | Both | Prayer | Aladhan API (per timezone) | 10 |
| Morning Photo | Reem | Checkbox | 6am-12pm Cairo | 15 |
| Sleep Photo | Ahmad | Checkbox | 8pm-2am Dubai | 15 |

**Timing Notes:**
- Prayer times from Aladhan API (already implemented)
- Different timezones handled automatically (Dubai/Cairo)
- Photo habits have "windows" - best completed in window, can still complete late
- Late completions still count, just marked as "late" (no guilt)

---

### B. CONNECTION (The Heart of Sawa)

#### 1. Daily Question (Mixed Format)

**KEY INSIGHT:** Most questions should be TAP-BASED (one click). Some can require SHORT text (max 20 chars). Heavy reflection questions = abandoned app.

**Question Types (Mix for variety):**

| Type | Friction | Example |
|------|----------|---------|
| Emoji Pick | ⚡ One tap | "How's your energy? 🔋🔋🔋 \| 🔋🔋 \| 🔋" |
| This or That | ⚡ One tap | "Tonight: Netflix \| Go out" |
| Quick Vibe | ⚡ One tap | "Send a vibe: Miss you \| Love you \| Thinking of you" |
| Scale | ⚡ One tap | "How much do you miss me? 1-5" |
| One Word | 🔸 5 seconds | "Your day in ONE word" |
| Fill Blank | 🔸 10 seconds | "Today I'm craving ___" |

**Flow:**
```
┌─────────────────────────────────────────┐
│  ❓ DAILY QUESTION                      │
│                                         │
│  "What kind of day are you having?"     │
│                                         │
│  [😴 Slow]  [⚡ Busy]  [😌 Chill]  [😤 Stressful] │
│                                         │
│  🔒 Reem's answer unlocks after yours   │
│                                         │
│  [🔄 Shuffle - 1 left today]            │
└─────────────────────────────────────────┘
```

**Content Strategy:**
- Generate 150+ questions upfront, store in database
- Mix: 60% tap-based, 30% one-word, 10% short text
- Never repeat within 30 days
- One "shuffle" per day allowed
- Categories rotate for variety

---

#### 2. Daily Check-In (Mood Pulse)
```
┌─────────────────────────────────────────┐
│  💭 HOW ARE YOU FEELING?                │
│                                         │
│  [😊 Great]  [😐 Okay]  [😔 Low]  [😤 Stressed] │
│                                         │
│  Optional: Quick note (max 50 chars)    │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  👩 Reem: 😊 "Good day!" (2h ago)       │
└─────────────────────────────────────────┘
```

- ONE tap for mood (required)
- Short note optional (not required)
- Partner sees immediately
- +10 XP per person

---

#### 3. Quick Ritual (30 Seconds)

**OLD:** Three text prompts requiring writing → TOO HEAVY
**NEW:** Three quick taps → DONE IN 30 SECONDS

```
┌─────────────────────────────────────────┐
│  ✨ QUICK RITUAL                        │
│                                         │
│  1/3 How's your mood right now?         │
│  [😊] [😐] [😔] [😴] [😤]               │
│                                         │
│  2/3 Energy level?                      │
│  [1] [2] [3] [4] [5]                    │
│                                         │
│  3/3 Send a vibe to Reem:               │
│  [Miss you 💕] [Love you ❤️]            │
│  [Thinking of you 💭] [Custom...]       │
│                                         │
│  [Complete Ritual ✓]                    │
└─────────────────────────────────────────┘
```

- Three taps total (fourth is optional custom)
- Done in 30 seconds, not 60
- Partner sees your state instantly
- +15 XP each when both complete

---

### C. GAMIFICATION

#### XP System
| Action | XP |
|--------|-----|
| Complete prayer | 10 |
| Complete photo habit | 15 |
| Answer daily question | 25 |
| Complete check-in | 10 |
| Complete 1-min rituals | 15 |
| Send reaction | 5 |
| Complete quest | Variable |

#### Couple Level
- Combined XP determines level
- Level NEVER decreases (positive only)
- Celebration animation on level up

| Level | XP Required |
|-------|-------------|
| 1 | 0 |
| 2 | 100 |
| 3 | 300 |
| 4 | 600 |
| 5 | 1,000 |
| 6 | 1,500 |
| 7 | 2,200 |
| 8 | 3,000 |
| ... | exponential |

#### Daily Quests
Special challenges for bonus XP:
- "Both pray Fajr today" (+50 XP)
- "Complete all 5 prayers" (+30 XP)
- "Send a reaction to partner" (+20 XP)
- "Answer daily question before noon" (+15 XP)
- "Both complete check-in" (+25 XP)
- "Perfect day: Everything done" (+100 XP)

#### Reactions
- ❤️ Heart and 🎉 Celebrate buttons
- Send on any partner completion
- +5 XP for sending
- Creates micro-appreciation moments

---

### D. CONTENT

#### Daily Quotes
- One Islamic/relationship quote per day
- Displayed at top of dashboard
- Curated, meaningful selection

#### Wish List
- Each person adds things they'd love
- Partner sees for gift/date ideas
- Fulfilled wishes move to archive (memories)

---

### E. SHARED INBOX

**Categorized shared space for ideas, plans, dreams:**

```
┌─────────────────────────────────────────┐
│  📥 OUR INBOX                           │
│                                         │
│  [💡 Ideas] [✅ To-do] [🌟 Dreams] [📸 Memories] │
│                                         │
│  💡 IDEAS                               │
│  • Try that new Egyptian restaurant     │
│  • Watch that movie Reem mentioned      │
│                                         │
│  ✅ TO-DO                               │
│  • Book Egypt flights                   │
│                                         │
│  🌟 DREAMS                              │
│  • Visit Japan together                 │
│                                         │
│  [+ Add to Inbox]                       │
└─────────────────────────────────────────┘
```

**Both can add. Both can see. Everything accumulates.**

---

### F. VISIBILITY

#### Activity Feed
Recent actions from both:
```
• Reem prayed Fajr (5 min ago)
• Ahmad sent ❤️ to your prayer
• Reem completed check-in (1 hour ago)
```

Real-time updates via Supabase subscriptions.

---

## Visual Design

### Theme: Dark-ish Base + Colorful Pastels

**Background:** Deep blue-gray
- Primary: `#1a1b2e` (deep blue-gray)

**Accent Colors:**
| Use | Color | Hex |
|-----|-------|-----|
| Primary | Soft lavender | `#a78bfa` |
| Success | Mint green | `#6ee7b7` |
| Reem | Coral/Rose | `#fb7185` |
| Ahmad | Sky blue | `#38bdf8` |
| Gold/XP | Warm yellow | `#fcd34d` |
| Secondary | Soft purple | `#c4b5fd` |

---

## Database Schema

### New Tables

```sql
-- Couple progress tracking
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
  question_type TEXT NOT NULL, -- 'emoji_pick', 'this_or_that', 'scale', 'one_word', 'fill_blank'
  options JSONB, -- For tap-based questions
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily question responses
CREATE TABLE question_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  question_id UUID REFERENCES daily_questions(id),
  date DATE NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Daily check-ins
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  mood TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Quick ritual responses
CREATE TABLE ritual_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  mood TEXT,
  energy INTEGER,
  vibe TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Reactions
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quests
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  xp_reward INTEGER NOT NULL,
  quest_type TEXT NOT NULL,
  conditions JSONB,
  active BOOLEAN DEFAULT TRUE
);

-- Quest progress
CREATE TABLE quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id UUID REFERENCES quests(id),
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  UNIQUE(quest_id, date)
);

-- Daily quotes
CREATE TABLE daily_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  source TEXT
);

-- Wishes
CREATE TABLE wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  fulfilled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared inbox
CREATE TABLE inbox_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  added_by UUID REFERENCES users(id),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Implementation Sessions

### SESSION 1: Foundation & Database
**Goal:** All database tables ready, 150+ questions seeded

1. Create migration `002_sawa_v2.sql` with all new tables
2. Seed 150+ tap-based questions
3. Seed 30+ daily quotes
4. Seed quest templates
5. Generate TypeScript types
6. Create API functions

**Deliverable:** Database ready, types generated

---

### SESSION 2: Core Dashboard & XP
**Goal:** New layout with couple progress, XP system working

1. Build CoupleProgressBar component
2. Implement XP system (earn on habit completion)
3. Update dashboard layout
4. Add photo habit for Ahmad

**Deliverable:** XP earned on habits, level displays

---

### SESSION 3: Quick Interactions
**Goal:** Daily question, check-in, ritual all working

1. Daily Question (tap-based UI, unlock mechanic)
2. Check-In (emoji mood, optional note)
3. Quick Ritual (3-tap flow)

**Deliverable:** All connection features working

---

### SESSION 4: Social Layer
**Goal:** Reactions, activity feed, inbox

1. Reaction buttons
2. Activity feed
3. Shared inbox (categorized)
4. Quest system

**Deliverable:** Full social features

---

### SESSION 5: Visual Polish
**Goal:** Beautiful, polished, ship-ready

1. New color palette
2. Card styling with glows
3. Wish list
4. Daily quote display
5. Mobile audit

**Deliverable:** Ship it!

---

## How to Start a New Session

1. Read this plan (`docs/V2_PLAN.md`)
2. Read the session log (`log.md`)
3. Find which session you're on
4. Follow the tasks for that session
5. Update `log.md` when done
6. Commit changes

---

## Success Criteria

- [ ] All habits trackable and syncing
- [ ] XP earned and displayed
- [ ] Daily question with unlock works
- [ ] Check-in shows partner's mood
- [ ] Reactions work
- [ ] Inbox works with categories
- [ ] App feels fun, not like a chore
- [ ] Reem finds it intuitive
- [ ] Used daily for 2+ weeks

---

## Why This Will Work

**Problem:** Long-distance couples lose touchpoints. WhatsApp becomes transactional.

**Solution:** Daily micro-connections that:
- Take 30 seconds (not 5 minutes)
- Reveal how your partner is doing
- Build a shared history
- Make loving each other a game

**This is MY creation. I own it. Let's build it.** 🚀
