/**
 * HabitCircuit — Multi-Tenant Data Isolation Tests (Phase 3)
 *
 * Validates that two simultaneous public users (User A and User B) have
 * fully isolated data. User A must never see User B's habits or tasks,
 * and vice versa — even when both are authenticated at the same time.
 *
 * Prerequisites:
 *   - Set TEST_USER_A_EMAIL / TEST_USER_A_PASSWORD in .env.test
 *   - Set TEST_USER_B_EMAIL / TEST_USER_B_PASSWORD in .env.test
 *   - Both accounts must exist in Supabase Auth
 *   - Both accounts should have at least one habit and one task seeded
 *     (see README in tests/ for setup instructions)
 *
 * Run:
 *   npx playwright test tests/multi-tenant-isolation.spec.ts
 */

import { test, expect, Browser, BrowserContext, Page } from '@playwright/test'

// ─── Config ──────────────────────────────────────────────────────────────────

const BASE_URL = process.env.HABITCIRCUIT_BASE_URL ?? 'http://localhost:3000'

const USER_A = {
  email: process.env.TEST_USER_A_EMAIL ?? '',
  password: process.env.TEST_USER_A_PASSWORD ?? '',
  habitName: process.env.TEST_USER_A_HABIT ?? 'User A Unique Habit',
  taskTitle: process.env.TEST_USER_A_TASK ?? 'User A Unique Task',
}

const USER_B = {
  email: process.env.TEST_USER_B_EMAIL ?? '',
  password: process.env.TEST_USER_B_PASSWORD ?? '',
  habitName: process.env.TEST_USER_B_HABIT ?? 'User B Unique Habit',
  taskTitle: process.env.TEST_USER_B_TASK ?? 'User B Unique Task',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function createIsolatedContext(browser: Browser): Promise<BrowserContext> {
  // Each context gets its own cookie jar, localStorage, and session storage —
  // no state leaks between User A and User B.
  return browser.newContext({
    baseURL: BASE_URL,
    storageState: undefined, // always start fresh
  })
}

async function login(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login')
  await page.waitForSelector('h1', { timeout: 10_000 })

  // Switch to sign-in tab if needed
  const signinBtn = page.getByRole('button', { name: /sign in/i }).first()
  await signinBtn.click()

  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder(/password|••••/i).fill(password)
  await page.locator('form').getByRole('button', { name: /^sign in$/i }).click()

  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 15_000 })
}

async function getVisibleHabitNames(page: Page): Promise<string[]> {
  await page.goto('/dashboard/habits')
  await page.waitForLoadState('networkidle')

  // Wait for habits to load (table rows appear after Supabase fetch)
  await page.waitForSelector('table tbody tr', { timeout: 10_000 })

  // Habit names appear in the first <td> of each body row
  const cells = page.locator('table tbody tr td:first-child span.text-sm')
  const count = await cells.count()
  const names: string[] = []
  for (let i = 0; i < count; i++) {
    const text = (await cells.nth(i).textContent())?.trim()
    if (text) names.push(text)
  }
  return names
}

async function getVisibleTaskTitles(page: Page): Promise<string[]> {
  await page.goto('/dashboard/tasks')
  await page.waitForLoadState('networkidle')

  // Wait for loading spinner to disappear
  await page.waitForSelector('table tbody tr', { timeout: 10_000 })

  // Title is in the 2nd column (1st is Type); text lives in a span.text-sm
  const cells = page.locator('table tbody tr td:nth-child(2) span.text-sm')
  const count = await cells.count()
  const titles: string[] = []
  for (let i = 0; i < count; i++) {
    const text = (await cells.nth(i).textContent())?.trim()
    if (text) titles.push(text)
  }
  return titles
}

// ─── Tests ───────────────────────────────────────────────────────────────────

test.describe('Multi-Tenant Data Isolation', () => {
  test.beforeAll(() => {
    if (!USER_A.email || !USER_A.password) {
      throw new Error(
        'Missing TEST_USER_A_EMAIL / TEST_USER_A_PASSWORD. ' +
        'Copy .env.test.example to .env.test and fill in credentials.'
      )
    }
    if (!USER_B.email || !USER_B.password) {
      throw new Error(
        'Missing TEST_USER_B_EMAIL / TEST_USER_B_PASSWORD. ' +
        'Copy .env.test.example to .env.test and fill in credentials.'
      )
    }
  })

  // ── 1. Concurrent login ────────────────────────────────────────────────────

  test('User A and User B can log in simultaneously in isolated contexts', async ({ browser }) => {
    const ctxA = await createIsolatedContext(browser)
    const ctxB = await createIsolatedContext(browser)
    const pageA = await ctxA.newPage()
    const pageB = await ctxB.newPage()

    // Log both users in concurrently
    await Promise.all([
      login(pageA, USER_A.email, USER_A.password),
      login(pageB, USER_B.email, USER_B.password),
    ])

    // Both should land on /dashboard
    expect(pageA.url()).toContain('/dashboard')
    expect(pageB.url()).toContain('/dashboard')

    // Sessions must be independent — Supabase SSR uses cookies, verify via cookie jar
    const cookiesA = await ctxA.cookies()
    const cookiesB = await ctxB.cookies()

    const hasSupabaseCookieA = cookiesA.some(c => c.name.includes('sb-') || c.name.includes('supabase'))
    const hasSupabaseCookieB = cookiesB.some(c => c.name.includes('sb-') || c.name.includes('supabase'))

    expect(hasSupabaseCookieA).toBe(true)
    expect(hasSupabaseCookieB).toBe(true)

    await ctxA.close()
    await ctxB.close()
  })

  // ── 2. Habit isolation ─────────────────────────────────────────────────────

  test("User A's habits page does not show User B's unique habit", async ({ browser }) => {
    const ctxA = await createIsolatedContext(browser)
    const ctxB = await createIsolatedContext(browser)
    const pageA = await ctxA.newPage()
    const pageB = await ctxB.newPage()

    await Promise.all([
      login(pageA, USER_A.email, USER_A.password),
      login(pageB, USER_B.email, USER_B.password),
    ])

    // Get habits as seen by each user
    const [habitsSeenByA, habitsSeenByB] = await Promise.all([
      getVisibleHabitNames(pageA),
      getVisibleHabitNames(pageB),
    ])

    // A sees their own habit
    expect(habitsSeenByA).toContain(USER_A.habitName)

    // B sees their own habit
    expect(habitsSeenByB).toContain(USER_B.habitName)

    // A must NOT see B's habit
    expect(habitsSeenByA).not.toContain(USER_B.habitName)

    // B must NOT see A's habit
    expect(habitsSeenByB).not.toContain(USER_A.habitName)

    await ctxA.close()
    await ctxB.close()
  })

  // ── 3. Task isolation ──────────────────────────────────────────────────────

  test("User A's tasks page does not show User B's unique task", async ({ browser }) => {
    const ctxA = await createIsolatedContext(browser)
    const ctxB = await createIsolatedContext(browser)
    const pageA = await ctxA.newPage()
    const pageB = await ctxB.newPage()

    await Promise.all([
      login(pageA, USER_A.email, USER_A.password),
      login(pageB, USER_B.email, USER_B.password),
    ])

    const [tasksSeenByA, tasksSeenByB] = await Promise.all([
      getVisibleTaskTitles(pageA),
      getVisibleTaskTitles(pageB),
    ])

    // A sees their own task
    expect(tasksSeenByA).toContain(USER_A.taskTitle)

    // B sees their own task
    expect(tasksSeenByB).toContain(USER_B.taskTitle)

    // A must NOT see B's task
    expect(tasksSeenByA).not.toContain(USER_B.taskTitle)

    // B must NOT see A's task
    expect(tasksSeenByB).not.toContain(USER_A.taskTitle)

    await ctxA.close()
    await ctxB.close()
  })

  // ── 4. Dashboard namespace isolation ──────────────────────────────────────

  test('Each user only sees their own display name on the dashboard', async ({ browser }) => {
    const ctxA = await createIsolatedContext(browser)
    const ctxB = await createIsolatedContext(browser)
    const pageA = await ctxA.newPage()
    const pageB = await ctxB.newPage()

    await Promise.all([
      login(pageA, USER_A.email, USER_A.password),
      login(pageB, USER_B.email, USER_B.password),
    ])

    // The TopBar renders "Hey, {displayName}" — extract the name
    const greetA = await pageA.locator('header span').first().textContent()
    const greetB = await pageB.locator('header span').first().textContent()

    // Neither greeting should reference the other user's email prefix
    const nameA = USER_A.email.split('@')[0]
    const nameB = USER_B.email.split('@')[0]

    expect(greetA).not.toContain(nameB)
    expect(greetB).not.toContain(nameA)

    await ctxA.close()
    await ctxB.close()
  })

  // ── 5. Unauthenticated access blocked ─────────────────────────────────────

  test('Dashboard redirects to /login when unauthenticated', async ({ browser }) => {
    const ctx = await createIsolatedContext(browser)
    const page = await ctx.newPage()

    await page.goto('/dashboard')
    await page.waitForURL('**/login', { timeout: 10_000 })

    expect(page.url()).toContain('/login')
    await ctx.close()
  })

  test('Habits page redirects to /login when unauthenticated', async ({ browser }) => {
    const ctx = await createIsolatedContext(browser)
    const page = await ctx.newPage()

    await page.goto('/dashboard/habits')
    await page.waitForURL('**/login', { timeout: 10_000 })

    expect(page.url()).toContain('/login')
    await ctx.close()
  })

  test('Tasks page redirects to /login when unauthenticated', async ({ browser }) => {
    const ctx = await createIsolatedContext(browser)
    const page = await ctx.newPage()

    await page.goto('/dashboard/tasks')
    await page.waitForURL('**/login', { timeout: 10_000 })

    expect(page.url()).toContain('/login')
    await ctx.close()
  })
})
