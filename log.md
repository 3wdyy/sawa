# Sawa - Session Log

---

## Session 7 (V2 Session 3) - January 14, 2026 (Late Night)

**Focus:** Quick Interactions - Daily Question, Check-In, Quick Ritual

### Did
- [x] Created `useDailyQuestion` hook:
  - Fetches today's question from DB (auto-assigns if none)
  - Gets user's and partner's responses
  - Unlock mechanic: Partner's answer hidden until you answer
  - Shuffle functionality (1 per day limit)
  - Awards 25 XP on answer
- [x] Created `DailyQuestionCard` component:
  - Tap-based UI for emoji_pick, this_or_that, scale, quick_vibe questions
  - Text input for one_word and fill_blank questions
  - Lock icon showing partner's answer unlocks after yours
  - Shuffle button when available
  - Shows both answers after both respond
- [x] Created `useCheckIn` hook:
  - Fetches today's check-in for user and partner
  - Submit mood + optional note
  - Awards 10 XP on check-in
- [x] Created `CheckInCard` component:
  - 6 mood emoji options (great, okay, low, stressed, tired, excited)
  - Optional note input (max 50 chars)
  - Shows partner's mood immediately if they've checked in
- [x] Created `useRitual` hook:
  - Fetches ritual state for user and partner
  - Complete ritual function (mood, energy, vibe)
  - Awards 15 XP on completion
- [x] Created `QuickRitualCard` component:
  - 3-tap flow: mood → energy level (1-5) → vibe to partner
  - Pre-defined vibes: "Miss you 💕", "Love you ❤️", "Thinking of you 💭"
  - Custom vibe option
  - Back navigation between steps
  - Shows partner's ritual summary if completed
- [x] Wired all components to dashboard under "Connect" section
- [x] Fixed lint errors (Date.now() impure function, unused imports)
- [x] Build & lint pass

### Files Created
- `src/features/questions/hooks/useDailyQuestion.ts`
- `src/features/questions/components/DailyQuestionCard.tsx`
- `src/features/checkin/hooks/useCheckIn.ts`
- `src/features/checkin/components/CheckInCard.tsx`
- `src/features/ritual/hooks/useRitual.ts`
- `src/features/ritual/components/QuickRitualCard.tsx`

### Files Modified
- `src/app/page.tsx` - Added Connect section with 3 new cards

### Architecture Notes
- **XP Values:** Question = 25, Check-in = 10, Ritual = 15
- **Question Types:** emoji_pick, this_or_that, scale, quick_vibe (tap-based) | one_word, fill_blank (text input)
- **Mood Types:** great, okay, low, stressed, tired, excited
- **Ritual Flow:** Step 1 (mood) → Step 2 (energy 1-5) → Step 3 (vibe to partner)

### Next (SESSION 4: Social Layer)
1. Reaction buttons (heart/celebrate) on partner completions
2. Activity feed (recent actions from both)
3. Shared inbox (categorized: ideas, todos, dreams, memories)
4. Quest system

### Handoff for Session 4

**Pattern to follow:**
- Hook in `src/features/{name}/hooks/use{Name}.ts`
- Component in `src/features/{name}/components/{Name}Card.tsx`
- API already exists in `src/features/{name}/api/{name}.ts`

**Existing APIs ready to use:**
- `src/features/reactions/api/reactions.ts` - sendReaction, getReactions
- `src/features/activity/api/activity.ts` - logActivity, getRecentActivity
- `src/features/inbox/api/inbox.ts` - addInboxItem, getInboxItems
- `src/features/quests/api/quests.ts` - getActiveQuests, checkQuestProgress

**XP values (for consistency):**
- Prayer: 10, Binary habit: 15, Question: 25, Check-in: 10, Ritual: 15
- Reaction: 5, Quest: Variable (stored in quest.xp_reward)

**UI patterns:**
- Card wrapper: `<motion.div className="card p-4 space-y-4">`
- Header: `<span className="text-sm font-medium text-lavender flex items-center gap-2">`
- XP badge: `<span className="text-xs px-2 py-0.5 rounded-full bg-mint/20 text-mint">+N XP</span>`
- User result: `bg-sky/10 border-sky/30`
- Partner result: `bg-rose/10 border-rose/30`

---

## Session 6 (V2 Session 2) - January 14, 2026 (Late Night)

**Focus:** Core Dashboard & XP - Progress bar, XP system, V2 design

### Did
- [x] Created `CoupleProgressBar` component with:
  - Level badge with gold styling
  - Animated XP progress bar with shine effect
  - XP to next level display
  - Particle animation on XP gain (showXpGain prop)
- [x] Created `useCoupleProgress` hook:
  - TanStack Query integration for fetching couple progress
  - `addXp` mutation with optimistic updates
  - Derived values (level, progressPercent, xpToNextLevel)
- [x] Wired up XP earning on habit completion:
  - Modified `useHabits` to call `addCoupleXp` on successful habit completion
  - XP values: 10 for prayers, 15 for binary habits (photo)
  - Auto-invalidates couple-progress query after XP added
- [x] Updated dashboard with CoupleProgressBar at top
- [x] Updated V2 design colors in globals.css:
  - Background: `#1a1b2e` (deep blue-gray)
  - Lavender: `#a78bfa`, Mint: `#6ee7b7`, Rose: `#fb7185`, Sky: `#38bdf8`
- [x] Fixed lint errors (Math.random in render → pre-computed offsets)
- [x] Removed unused `isProduction` variable in next.config.ts
- [x] Build & lint pass

### Files Created
- `src/features/couple/hooks/useCoupleProgress.ts`
- `src/features/couple/components/CoupleProgressBar.tsx`

### Files Modified
- `src/features/habits/hooks/useHabits.ts` - Added XP earning on habit completion
- `src/app/page.tsx` - Added CoupleProgressBar to dashboard
- `src/app/globals.css` - Updated to V2 color palette
- `next.config.ts` - Removed unused variable

### Architecture Notes
- **XP Flow:** `useHabits.toggleHabit()` → `completeMutation.onSuccess()` → `addCoupleXp()` → invalidates `couple-progress` query
- **XP Values:** Stored in `useHabits.ts` as `XP_VALUES` constant: `{ prayer: 10, binary: 15, dual_confirm: 10 }`
- **Couple Progress:** Single row in `couple` table, fetched via `useCoupleProgress` hook
- **Level Thresholds:** Defined in `src/features/couple/api/couple.ts` - exponential scaling (100, 300, 600, 1000...)

### Design Tokens Applied (V2)
```css
--background: #1a1b2e     /* Deep blue-gray */
--lavender: #a78bfa       /* Primary accent */
--mint: #6ee7b7           /* Success/completion */
--rose: #fb7185           /* Reem's color */
--sky: #38bdf8            /* Ahmad's color */
--gold: #fcd34d           /* XP/level color */
```

### Gotchas for Session 3
- Sleep Photo habit already seeded for Ahmad (ID: `b0000000-0000-0000-0000-000000000003`)
- API functions for questions, check-ins, rituals already exist from Session 1 in `src/features/*/api/`
- Need to create UI components and hooks for these features

### Next (SESSION 3: Quick Interactions)
1. Daily Question (tap-based UI, unlock mechanic) - API ready at `src/features/questions/api/questions.ts`
2. Check-In (emoji mood, optional note) - API ready at `src/features/checkin/api/checkin.ts`
3. Quick Ritual (3-tap flow) - API ready at `src/features/ritual/api/ritual.ts`

---

## Session 5 (V2 Session 1) - January 14, 2026 (Late Night)

**Focus:** V2 Foundation & Database - All new tables, 150+ questions, API functions

### Did
- [x] Created migration `002_sawa_v2.sql` with all V2 tables:
  - `couple` (XP, level tracking)
  - `daily_questions` + `daily_question_assignments` (150+ question bank)
  - `question_responses` (user answers)
  - `check_ins` (mood pulse)
  - `ritual_responses` (quick 3-tap ritual)
  - `reactions` (heart/celebrate)
  - `quests` + `quest_progress` (gamification)
  - `daily_quotes` + `daily_quote_assignments` (40+ quotes)
  - `wishes` (wish list)
  - `inbox_items` (shared categorized inbox)
  - `activity_log` (feed)
- [x] Created new ENUMs: `question_type`, `question_category`, `mood_type`, `reaction_type`, `inbox_category`, `activity_type`
- [x] Added `xp` column to users table
- [x] Created `seed_v2.sql` with:
  - 150+ daily questions (60% tap-based, 30% one-word, 10% fill-blank)
  - 40+ daily quotes (Islamic, love, motivation)
  - 15 quest templates (daily + weekly)
  - Sleep Photo habit for Ahmad
  - Couple initialization
- [x] Applied migration and seeds to Supabase
- [x] Generated TypeScript types with convenience aliases
- [x] Created API functions for all V2 features:
  - `src/features/couple/api/couple.ts` - XP, level, progress
  - `src/features/questions/api/questions.ts` - Daily question with shuffle
  - `src/features/checkin/api/checkin.ts` - Mood pulse
  - `src/features/ritual/api/ritual.ts` - Quick 3-tap ritual
  - `src/features/reactions/api/reactions.ts` - Heart/celebrate
  - `src/features/quests/api/quests.ts` - Quest system
  - `src/features/quotes/api/quotes.ts` - Daily quote
  - `src/features/wishes/api/wishes.ts` - Wish list
  - `src/features/inbox/api/inbox.ts` - Shared inbox
  - `src/features/activity/api/activity.ts` - Activity feed
- [x] Fixed mock users to include `xp` field
- [x] Build passes

### Files Created
- `supabase/migrations/002_sawa_v2.sql`
- `supabase/seed_v2.sql`
- `src/features/couple/api/couple.ts`
- `src/features/questions/api/questions.ts`
- `src/features/checkin/api/checkin.ts`
- `src/features/ritual/api/ritual.ts`
- `src/features/reactions/api/reactions.ts`
- `src/features/quests/api/quests.ts`
- `src/features/quotes/api/quotes.ts`
- `src/features/wishes/api/wishes.ts`
- `src/features/inbox/api/inbox.ts`
- `src/features/activity/api/activity.ts`

### Files Modified
- `supabase/config.toml` - Added seed_v2.sql to seed paths
- `src/types/database.ts` - Regenerated + added convenience type aliases
- `src/features/auth/context.tsx` - Added xp field to mock users

### Next (SESSION 2: Core Dashboard & XP)
1. Build CoupleProgressBar component
2. Implement XP system (earn on habit completion)
3. Update dashboard layout with new V2 design
4. Wire up photo habits

---

## Session 4 - January 14, 2026 (Evening)

**Focus:** Connect frontend to backend - ship working V1

### Did
- [x] Full codebase audit - discovered more was built than log indicated
- [x] Fixed migration to use `gen_random_uuid()` (Supabase compatibility)
- [x] Linked Supabase CLI and ran `db reset --linked` to apply migration + seed
- [x] Verified database populated: Ahmad, Reem, 7 habits (5 prayers + morning photo + daily call)
- [x] Rewrote `page.tsx` to use real hooks (`useHabits`, `usePartnerHabits`, `usePrayerTimes`)
- [x] Refactored auth context to use `useSyncExternalStore` (fixed React compiler lint errors)
- [x] Fixed `next.config.ts` - removed static export/basePath for local dev (was causing 404)
- [x] Fixed all lint errors (removed unused vars, added useMemo for queryKey)
- [x] Updated Reem's location to Cairo/Egypt in mock users

### Decided
- Local dev should NOT use `output: "export"` or `basePath` - those are GitHub Pages only
- Keep mock users in auth context (IDs match seed data, works without Supabase auth)

### Technical Notes
- Supabase project: `nkiwtoirlrfnntwwkudo.supabase.co`
- Run with Node 20: `source ~/.nvm/nvm.sh && nvm use 20 && npm run dev`
- Database has RLS policies allowing all operations (V1 permissive)

### Files Modified
- `src/app/page.tsx` - wired to real Supabase hooks
- `src/features/auth/context.tsx` - useSyncExternalStore, fixed locations
- `src/features/habits/hooks/usePartnerHabits.ts` - useMemo for queryKey
- `src/features/habits/components/HabitCard.tsx` - removed unused prop
- `src/features/prayer/hooks/usePrayerTimes.ts` - removed unused import
- `supabase/migrations/001_initial_schema.sql` - uuid_generate_v4 → gen_random_uuid
- `next.config.ts` - conditional GitHub Pages config, turbopack root

### Next
- **Test the app at http://localhost:3000** - verify prayers/habits toggle and persist
- Test realtime by opening two tabs as different users
- If working, commit and push

---

## Session 3 - January 14, 2026

**Focus:** Resume work - Context gathering, state assessment

### Notes
- Brief session, assessed state but log was inaccurate
- Old version at `~/projects/aizura/clients/sawa/` is stale - ignore it

---

## Session 2 - January 12-13, 2026

**Focus:** Full frontend build + backend schema + deployment attempts

### Progress (What Actually Got Built)
- [x] Full Next.js app with feature-based structure
- [x] User selection screen
- [x] Dashboard with all components
- [x] PrayerCard with 5 prayers, toggles, partner indicators
- [x] HabitCard with animations
- [x] Full database schema migration
- [x] Supabase client setup
- [x] TanStack Query hooks
- [x] GitHub Actions for deployment
- [x] Mock auth (because Supabase wasn't connected)

### Git Commits
```
eec9969 fix: make prayers and habits clickable with local state
ae3bf78 fix: Use mock user data for authentication instead of Supabase
e58e891 Create nextjs.yml
70ac62d feat: add GitHub Pages deployment
5b79590 fix: force dynamic rendering to skip prerender
0370f6b fix: lazy load Supabase client to fix SSR build
5fd43d6 Initial commit: Sawa couple habit tracker
```

### Files Created
- Full `src/` directory with features/auth, features/habits, features/prayer
- `supabase/migrations/001_initial_schema.sql`
- `supabase/seed.sql`
- UI components (Avatar, Button, Card)
- All hooks and API functions

---

## Session 1 - January 12, 2026

**Focus:** Foundation - Architecture, documentation, database design

### Context
- Fresh start on Sawa (scrapped previous version)
- Ahmad and Reem have agreed on habits to track
- Goal: Build something beautiful, properly architected

### Decisions Made
- Simple user selection (no auth for V1)
- 4 habits: Morning photo, Ahmad's prayers, Reem's prayers, Daily call
- Prayer times via Aladhan API
- Website (no PWA)
- Bold & playful design direction
- Feature-based code organization

### Progress
- [x] Architecture document created (`docs/architecture.md`)
- [x] PRD created (`docs/prd.md`)
- [x] CLAUDE.md created
- [x] Session log started

### Files Created
- `docs/architecture.md`
- `docs/prd.md`
- `CLAUDE.md`
- `log.md`

---
