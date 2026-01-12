# Sawa - Architecture Document

**Version:** 1.0
**Date:** January 12, 2026
**Author:** Ahmad + ATLAS

---

## 1. System Overview

### What is Sawa?

**سوا (Sawa)** means "together" in Egyptian Arabic. It's a couple habit tracker for Ahmad and Reem to:

1. **Track** habits together (prayers, daily rituals)
2. **See** each other's progress in real-time
3. **Encourage** each other through visible accountability

### Design Principles

| Principle | Meaning |
|-----------|---------|
| **Simple for Reem** | If she has to think, we failed. Dead simple UI. |
| **Real-time connection** | See partner's actions instantly. The core value. |
| **Beautiful & playful** | Bold colors, delightful interactions. Not another boring app. |
| **Built to grow** | Start with 4 habits, architecture supports unlimited. |
| **Mobile-first** | Primarily used on phones, must feel native. |

---

## 2. MVP Requirements

### Users
- Ahmad (Dubai, GMT+4)
- Reem (Egypt, GMT+2)
- Simple user selection (no passwords for MVP)

### Habits (V1)

| Habit | Type | Owner | Description |
|-------|------|-------|-------------|
| Morning Photo | binary | Reem | She confirms she sent the daily photo |
| Ahmad's Prayers | prayer (x5) | Ahmad | 5 daily prayers with time awareness |
| Reem's Prayers | prayer (x5) | Reem | 5 daily prayers with time awareness |
| Daily Call | dual_confirm | Both | Both mark when they've had their daily call |

### Core Features (V1)
- [ ] User selection (Ahmad/Reem)
- [ ] Dashboard showing today's habits for both users
- [ ] Tap to complete binary habits
- [ ] Prayer cards showing current prayer + times
- [ ] Real-time sync (see partner complete habits live)
- [ ] Visual progress indicators
- [ ] Timezone-aware (each user sees correct prayer times)

### Explicitly NOT in V1
- Streaks and statistics
- Heatmap calendars
- Emoji reactions
- Push notifications
- Photo uploads
- Custom habits
- Authentication (proper auth)

---

## 3. Architecture Decisions

### ADR-001: Next.js 14+ with App Router

**Decision:** Use Next.js with App Router (not Pages Router)

**Rationale:**
- Server Components reduce client bundle size
- Server Actions simplify mutations
- Modern patterns, industry standard
- Great DX with TypeScript
- Vercel deployment is seamless

**Trade-offs:**
- Slightly more complex mental model (server vs client)
- Newer, some patterns still evolving

---

### ADR-002: Supabase for Backend

**Decision:** Use Supabase (Postgres + Auth + Realtime)

**Rationale:**
- Real-time is CORE to Sawa - Supabase realtime is built-in
- Postgres is robust and familiar
- Row Level Security for data isolation
- Auth ready when we need it later
- Free tier is generous
- Type generation from schema

**Trade-offs:**
- Vendor dependency
- Less control than self-hosted

---

### ADR-003: Simple User Selection (No Auth for V1)

**Decision:** Use localStorage-based user selection, not proper authentication

**Rationale:**
- Only 2 users (Ahmad + Reem)
- Private app, not public
- Dramatically reduces complexity
- Can add proper auth later (Supabase Auth ready)

**How it works:**
- User selects "I'm Ahmad" or "I'm Reem" on first visit
- Selection stored in localStorage
- User ID used for all database operations
- Can switch users (for testing)

**Migration path:**
- Users table is already structured for real auth
- When ready: add Supabase Auth, link to existing user IDs
- No data migration needed

---

### ADR-004: Prayer Times via Aladhan API

**Decision:** Use Aladhan.com API for prayer times

**Rationale:**
- Free, reliable, well-documented
- Supports all calculation methods
- City/country based lookup
- No API key required

**Implementation:**
- Fetch prayer times daily per user (based on their city)
- Cache in localStorage for offline resilience
- Show current prayer window in UI
- Different times for Ahmad (Dubai) vs Reem (Egypt)

---

### ADR-005: TanStack Query for Data Fetching

**Decision:** Use TanStack Query (React Query) for server state

**Rationale:**
- Handles caching, refetching, stale data elegantly
- Works great with Supabase
- Optimistic updates for snappy UX
- DevTools for debugging

**Alternative considered:** SWR (simpler but less features)

---

### ADR-006: Tailwind CSS + Custom Design System

**Decision:** Tailwind CSS with custom color palette and components

**Rationale:**
- Rapid development
- Consistent spacing/sizing
- Easy to customize
- No runtime overhead

**Design system includes:**
- Custom color palette (bold, playful)
- Consistent spacing scale
- Component primitives (Button, Card, etc.)
- Animation utilities

---

### ADR-007: Feature-Based Directory Structure

**Decision:** Organize code by feature, not by type

**Rationale:**
- Related code stays together
- Easier to navigate as app grows
- Clear ownership of features
- Easier to delete/refactor features

**Example:**
```
src/features/habits/
  ├── components/
  │   ├── HabitCard.tsx
  │   └── PrayerCard.tsx
  ├── hooks/
  │   └── useHabits.ts
  ├── api/
  │   └── habits.ts
  └── types.ts
```

---

## 4. Database Design

### Schema Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   users     │────<│ habit_logs  │>────│   habits    │
└─────────────┘     └─────────────┘     └─────────────┘
      │                                        │
      │              ┌─────────────┐           │
      └─────────────<│  user_habits │>─────────┘
                     └─────────────┘
```

### Tables

#### users
Core user information. Partner relationship is bidirectional.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Display name |
| timezone | text | IANA timezone (e.g., 'Asia/Dubai') |
| city | text | For prayer times |
| country | text | For prayer times |
| partner_id | uuid | References other user |
| created_at | timestamptz | When created |

#### habits
Predefined habit definitions. Not user-specific.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Display name |
| slug | text | Unique identifier (e.g., 'fajr', 'morning-photo') |
| type | text | 'binary' or 'prayer' or 'dual_confirm' |
| category | text | 'religious', 'relationship' |
| icon | text | Emoji for display |
| prayer_name | text | NULL unless type='prayer' |
| display_order | int | Sort order |
| created_at | timestamptz | When created |

#### user_habits
Which habits each user tracks. Allows different habits per user.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References users |
| habit_id | uuid | References habits |
| is_active | boolean | Whether currently tracking |
| created_at | timestamptz | When assigned |

#### habit_logs
Individual habit completions.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Who completed |
| habit_id | uuid | Which habit |
| date | date | Which day (in user's timezone) |
| value | jsonb | Flexible data per habit type |
| logged_at | timestamptz | Exact timestamp |
| created_at | timestamptz | When record created |

**Value examples:**
- Binary: `{ "done": true }`
- Prayer: `{ "done": true, "on_time": true }`
- Dual confirm: `{ "done": true }`

### Indexes

```sql
-- Fast lookups for daily habits
CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, date);
CREATE INDEX idx_habit_logs_habit_date ON habit_logs(habit_id, date);

-- Fast partner lookup
CREATE INDEX idx_users_partner ON users(partner_id);
```

### Row Level Security

For future auth readiness, but currently permissive:

```sql
-- Users can read all users (just 2)
-- Habit logs can be read by both users (couple sharing)
-- Only owner can insert/update their own logs
```

---

## 5. Component Architecture

### Hierarchy

```
App
├── Layout
│   ├── Header (user info, partner status)
│   └── Main content area
├── Pages
│   ├── Login (user selection)
│   └── Dashboard (main view)
└── Features
    ├── Habits
    │   ├── HabitList (grouped by category)
    │   ├── HabitCard (individual habit)
    │   ├── PrayerCard (prayer with times)
    │   └── DualConfirmCard (both users confirm)
    ├── Partner
    │   └── PartnerStatus (real-time partner progress)
    └── Prayer
        └── PrayerTimes (current prayer indicator)
```

### Component Patterns

**1. Container/Presenter Split**
```tsx
// Container: handles data
function HabitListContainer() {
  const { habits, loading } = useHabits();
  return <HabitList habits={habits} loading={loading} />;
}

// Presenter: pure UI
function HabitList({ habits, loading }) {
  // Just renders, no data fetching
}
```

**2. Compound Components** (where appropriate)
```tsx
<HabitCard>
  <HabitCard.Icon />
  <HabitCard.Title />
  <HabitCard.Status />
</HabitCard>
```

**3. Hooks for Logic**
```tsx
// Encapsulate complex logic
function useHabitCompletion(habitId) {
  // Mutation, optimistic update, error handling
}
```

---

## 6. Directory Structure

```
~/projects/sawa/
├── docs/
│   ├── architecture.md       # This document
│   ├── prd.md               # Product requirements
│   └── decisions/           # Additional ADRs if needed
│
├── supabase/
│   ├── migrations/          # Database migrations (versioned)
│   │   └── 001_initial.sql
│   ├── seed.sql             # Initial data (users, habits)
│   └── types.ts             # Generated types from schema
│
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Dashboard (main page)
│   │   ├── login/
│   │   │   └── page.tsx     # User selection
│   │   └── globals.css      # Global styles
│   │
│   ├── components/
│   │   ├── ui/              # Generic, reusable
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   └── layout/
│   │       └── Header.tsx
│   │
│   ├── features/
│   │   ├── auth/            # User selection
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── context.tsx
│   │   ├── habits/          # Core habit tracking
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   └── types.ts
│   │   └── prayer/          # Prayer times
│   │       ├── components/
│   │       ├── hooks/
│   │       └── api/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts    # Browser client
│   │   │   └── server.ts    # Server client
│   │   ├── utils/
│   │   │   ├── date.ts      # Date/timezone helpers
│   │   │   └── cn.ts        # className utility
│   │   └── constants.ts     # App constants
│   │
│   └── types/
│       └── database.ts      # Generated from Supabase
│
├── public/
│   └── icons/
│
├── .env.local.example       # Environment template
├── .gitignore
├── CLAUDE.md                # AI instructions for this project
├── log.md                   # Session log
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## 7. Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | Node.js | 20.x |
| Framework | Next.js | 14.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Database | PostgreSQL (via Supabase) | 15 |
| Backend | Supabase | Latest |
| State | TanStack Query | 5.x |
| Forms | React Hook Form (if needed) | 7.x |
| Deployment | Vercel | - |

---

## 8. Future Considerations

These are NOT in V1 but the architecture supports them:

### Streaks & Statistics
- habit_logs table has date field for streak calculation
- Can add computed views or functions

### Reactions/Encouragement
- Add reactions table (from_user_id, to_log_id, emoji)
- Real-time subscription on reactions

### More Habits
- habits table is generic, add rows for new habits
- user_habits controls who tracks what

### Proper Authentication
- Supabase Auth is ready
- users table can link to auth.users
- RLS policies prepared

### Push Notifications
- PWA can add later if needed
- Web Push API or Supabase Edge Functions

### Photo Uploads
- Supabase Storage ready
- Add attachment_url to habit_logs.value

---

## 9. Implementation Order

1. **Database**: Create Supabase project, run migrations, seed data
2. **Project Setup**: Initialize Next.js, configure Tailwind, set up structure
3. **Auth Feature**: User selection, context, persistence
4. **Habits Feature**: Basic habit display and completion
5. **Prayer Feature**: Prayer times integration
6. **Real-time**: Partner sync via Supabase subscriptions
7. **Polish**: Design system, animations, mobile optimization

---

**This document is the source of truth for Sawa's architecture.**

Update it when making significant architectural changes.
