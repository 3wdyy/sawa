# Sawa - Project Instructions

**Part of ATLAS system.**

---

## What Is Sawa

سوا (Sawa) - "Together" in Egyptian Arabic. A couple habit tracker for Ahmad and Reem.

**Core purpose:** Track habits, see partner live, stay accountable together.

---

## Context Loading

When working on Sawa:
1. Read `~/CLAUDE.md` - Master ATLAS instructions
2. Read this file - Project instructions
3. Read `./log.md` - Session history
4. Reference `./docs/architecture.md` - Technical decisions
5. Reference `./docs/prd.md` - Product requirements

---

## Tech Stack

- **Runtime:** Node.js 20.x
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 4.x
- **Backend:** Supabase (Postgres + Realtime)
- **State:** TanStack Query
- **Deployment:** Vercel

---

## Project Structure

```
sawa/
├── docs/
│   ├── architecture.md    # Technical decisions (READ THIS)
│   └── prd.md            # Product requirements
├── supabase/
│   ├── migrations/       # Database migrations
│   └── seed.sql          # Initial data
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # UI components
│   ├── features/         # Feature modules
│   ├── lib/              # Utilities
│   └── types/            # TypeScript types
├── CLAUDE.md             # This file
└── log.md                # Session log
```

---

## Design Principles

1. **Simple for Reem** - If she has to think, we failed
2. **Real-time** - Partner's actions appear instantly
3. **Bold & playful** - Not another boring app
4. **Mobile-first** - Primarily used on phones
5. **Built to grow** - Clean architecture for future features

---

## Working Rules

### Code Quality
- TypeScript strict mode, no `any`
- Small, focused components
- Hooks for reusable logic
- Meaningful variable names
- Comments only when logic isn't self-evident

### Architecture
- Follow decisions in `docs/architecture.md`
- Feature-based organization
- Container/Presenter pattern where appropriate
- Types generated from Supabase schema

### Git
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`
- Small, focused commits
- Branch per feature if complex

### Testing (Future)
- Not in V1, but structure code to be testable
- Pure functions, dependency injection where it helps

---

## Session Flow

### Start
```
## Session Start

**Context:** Sawa
**Last session:** [from log.md]
**Focus:** [What we're doing]
```

### During
- End every message with file tracking:
  `**Files:** none | Added: X | Modified: Y`

### End
Run `/wrap` → update `./log.md`

---

## Current Phase

**Phase 1: Foundation**
- [ ] Supabase project setup
- [ ] Database schema + migrations
- [ ] Next.js project initialization
- [ ] Basic folder structure
- [ ] Design system tokens

---

## Commands

```bash
# Development
npm run dev          # Start dev server

# Database
npx supabase gen types typescript --project-id <id> > src/types/database.ts

# Build
npm run build        # Production build
npm run lint         # Lint check
```

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Key Decisions

Read `docs/architecture.md` for full ADRs. Summary:

| Decision | Choice | Why |
|----------|--------|-----|
| Framework | Next.js App Router | Modern, Server Components |
| Backend | Supabase | Real-time built-in |
| Auth | Simple selection | Only 2 users, private app |
| Prayer times | Aladhan API | Free, reliable |
| State | TanStack Query | Caching, optimistic updates |
| Styling | Tailwind | Rapid, consistent |

---

## Future Scope (NOT V1)

- Streaks and statistics
- Emoji reactions
- Push notifications
- Photo uploads
- More habits
- Proper authentication

Architecture supports all of these. Build V1 first.

---

**Focus: Ship a beautiful, working V1 that Ahmad and Reem actually use.**
