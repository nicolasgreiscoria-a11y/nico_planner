# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## App

**HabitCircuit** — a personal weekly planner + habit tracker. Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (Auth + Postgres + RLS), Google Calendar API, Vercel.

---

## Commands

```bash
npm run dev          # start local dev server
npm run build        # production build
npm run lint         # ESLint via next lint
npm run test:e2e     # Playwright tests (requires tests/.env.test)
npm run test:e2e:ui  # Playwright interactive UI
```

Single test file: `npx playwright test tests/sign-in.spec.ts`

---

## Architecture

### Auth & Middleware

`src/middleware.ts` refreshes the Supabase session on every request via `@supabase/ssr`. All authenticated pages live under `src/app/dashboard/`. The middleware protects the route but does NOT redirect — redirection is handled inside `src/app/dashboard/layout.tsx`.

Two Supabase client factories:
- `src/lib/supabase/client.ts` — browser (use in client components and hooks)
- `src/lib/supabase/server.ts` — server (use in API routes and Server Components)

### Google Calendar

Refresh tokens are stored in `profiles.google_refresh_token` (server-only, never sent to the client). All Calendar operations go through `src/lib/google/calendar.ts` (`getCalendarClient(refreshToken)`). The existing pattern in `src/app/api/calendar/sync/route.ts` is the canonical reference for any new calendar sync endpoints.

### Data Layer

Each table has a corresponding custom hook in `src/lib/hooks/`. Hooks use the browser Supabase client and are the standard way for client components to read/write data. API routes use the server client.

The `profiles` table extends Supabase Auth (`id` = `auth.uid()`). Every other table has `user_id UUID REFERENCES auth.users(id)` with RLS `USING (auth.uid() = user_id)`.

### Week Navigation

`src/lib/context/WeekContext.tsx` holds the currently-viewed week. All dashboard components read from it — it's the single source of truth for "which week are we showing."

### Migrations

All schema changes go in `supabase/migrations/` as `.sql` files with timestamp prefixes. Use the Supabase MCP tool `apply_migration` for DDL, `execute_sql` for DML. After creating tables, run `get_advisors` with type `"security"` to verify RLS.

---

## Current Active Plan (task_today.md)

Three parts to implement in order:

1. **Schedule → Google Calendar Sync** — Add `calendar_event_id` to `schedule_entries`, new API route `src/app/api/calendar/sync_block/route.ts`, sync toggle in `src/components/schedule/SlotEditor.tsx`.
2. **Stripe One-Time Payment** — `is_lifetime_pro` + `stripe_customer_id` on `profiles`, Stripe Checkout session endpoint, webhook to set `is_lifetime_pro = true`, `PaywallModal.tsx` gating Calendar Sync behind payment ($6.99 launch price).
3. **Marketing assets** — Files in `marketing/`, plus `src/app/link/page.tsx` (Link-in-Bio landing page).

Do not begin implementation until the user gives the go-ahead.
