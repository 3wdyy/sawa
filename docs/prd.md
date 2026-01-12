# Sawa - Product Requirements Document

**Version:** 2.0
**Date:** January 12, 2026
**Status:** V1 MVP Definition

---

## The Vision

**سوا (Sawa)** = "Together" in Egyptian Arabic

A beautiful, playful app for Ahmad and Reem to track daily habits together. Not a productivity tool - a connection tool. Every completed habit is visible to your partner in real-time.

---

## Users

| User | Location | Timezone | Prayer City |
|------|----------|----------|-------------|
| Ahmad | Dubai, UAE | Asia/Dubai (GMT+4) | Dubai |
| Reem | Egypt | Africa/Cairo (GMT+2) | Her city (TBD) |

**Key insight:** Different timezones = different prayer times. UI must handle this.

---

## V1 Habits

### 1. Morning Photo (Reem's habit)
- **Type:** Binary (checkbox)
- **Owner:** Reem only
- **What:** She confirms she sent Ahmad the daily morning photo
- **UI:** Simple toggle, shows as complete/incomplete

### 2. Ahmad's Prayers
- **Type:** Prayer (5 per day)
- **Owner:** Ahmad only
- **What:** Track completion of each of the 5 daily prayers
- **UI:** 5 prayer cards showing:
  - Prayer name (Fajr, Dhuhr, Asr, Maghrib, Isha)
  - Prayer time (based on Dubai)
  - Current prayer highlighted
  - Completion status

### 3. Reem's Prayers
- **Type:** Prayer (5 per day)
- **Owner:** Reem only
- **What:** Same as Ahmad's but with her prayer times
- **UI:** Same as Ahmad's prayers

### 4. Daily Call
- **Type:** Dual confirm (both must complete)
- **Owner:** Both
- **What:** Both mark when they've had their daily call
- **UI:** Shows both users' status, "complete" when both done

---

## Core Flows

### Flow 1: First Visit
1. User opens app
2. See welcome screen with "سوا"
3. Asked "Who are you?" with two options: Ahmad | Reem
4. Selection saved, redirected to dashboard
5. Can always switch user (for testing)

### Flow 2: View Dashboard
1. See today's date
2. See your habits section (your own habits)
3. See partner's habits section (their progress)
4. Prayer times show current prayer highlighted
5. Partner completions update in real-time

### Flow 3: Complete Habit
1. Tap on incomplete habit
2. Habit animates to complete state
3. Partner sees completion instantly
4. Can tap again to undo

### Flow 4: Prayer Completion
1. See 5 prayer cards with times
2. Current prayer is highlighted
3. Tap to mark complete
4. Shows completion time (on-time or late indicator future feature)

---

## UI Requirements

### Design Direction
- **Bold & playful** - Not corporate, not clinical
- **Warm colors** - Connection, love, together
- **Micro-animations** - Delightful feedback on actions
- **Mobile-first** - Touch targets, thumb reach

### Color Palette (Proposed)
```
Primary:    Warm coral/salmon (#FF6B6B or similar)
Secondary:  Soft purple (#9B59B6 or similar)
Background: Clean white or very light warm gray
Text:       Deep charcoal (#2D3436)
Success:    Fresh green (#00B894)
Partner:    Distinguishing color for partner's items
```

### Typography
- Clean, modern sans-serif
- Arabic support (for "سوا" and future Arabic UI)
- Clear hierarchy (habit names, times, labels)

### Key Screens

#### 1. Login Screen
- App name "سوا" prominently
- "Sawaa - Together" subtitle
- Two large, friendly buttons: Ahmad | Reem
- Beautiful but simple

#### 2. Dashboard
- Header: User name, date, partner status indicator
- "Your Habits" section
  - Prayer cards (5, with times)
  - Other personal habits
- "Partner's Progress" section
  - Their habits with completion status
  - Real-time updates
- Visual distinction between your/partner sections

#### 3. Habit Card
- Icon + Name
- Completion status (visual, not just text)
- Tap to toggle
- Animation on completion

#### 4. Prayer Card (special)
- Prayer name + time
- "Current" indicator if it's the active prayer window
- 5 in a row/grid
- Clear visual for complete/incomplete

---

## Technical Requirements

### Real-time Sync
- **Critical feature** - the core value proposition
- When one user completes habit → other sees within 1-2 seconds
- Use Supabase Realtime subscriptions
- Optimistic UI updates (immediate feedback, sync in background)

### Prayer Times
- Fetch from Aladhan API
- Cache locally (refresh daily)
- Different cities for Ahmad (Dubai) vs Reem (her city)
- Show current prayer window

### Timezone Handling
- All dates stored in UTC in database
- Convert to user's timezone for display
- Prayer times fetched for each user's location

### Offline Resilience (Nice to have)
- Cache today's state in localStorage
- Queue completions if offline
- Sync when back online

---

## Success Criteria

V1 is successful when:
- [ ] Ahmad can see his dashboard with prayers + partner section
- [ ] Reem can see her dashboard with photo + prayers + partner section
- [ ] Completing a habit updates partner's view within 2 seconds
- [ ] Prayer times are accurate for both locations
- [ ] App feels delightful to use, not like a chore
- [ ] Reem finds it intuitive (no explanation needed)

---

## Out of Scope (V2+)

| Feature | Why Deferred |
|---------|--------------|
| Streaks | Adds complexity, not core connection |
| Statistics | Can view in Supabase if curious |
| Reactions | Nice but not essential |
| Notifications | Just open the app |
| Photo uploads | WhatsApp works fine |
| More habits | Prove V1 first |
| Proper auth | Only 2 users |

---

## Implementation Phases

### Phase 1: Foundation (Current)
- [x] Architecture document
- [x] PRD (this document)
- [ ] Supabase project
- [ ] Database schema
- [ ] Next.js project setup

### Phase 2: Core Features
- [ ] User selection flow
- [ ] Dashboard layout
- [ ] Habit display (non-interactive)
- [ ] Prayer times integration

### Phase 3: Interactivity
- [ ] Habit completion (yours)
- [ ] Real-time partner sync
- [ ] Optimistic updates

### Phase 4: Polish
- [ ] Design system refinement
- [ ] Animations
- [ ] Mobile optimization
- [ ] Edge case handling

### Phase 5: Ship
- [ ] Deploy to Vercel
- [ ] Test with Reem
- [ ] Iterate based on feedback

---

**Ready to build. Start with Phase 1.**
