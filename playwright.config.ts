import { defineConfig, devices } from '@playwright/test'
import { config } from 'dotenv'
import path from 'path'

config({ path: path.resolve(__dirname, 'tests/.env.test') })

/**
 * HabitCircuit Playwright configuration.
 *
 * Tests run against the local Next.js dev server.
 * Set HABITCIRCUIT_BASE_URL to override (e.g. for staging).
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,   // multi-tenant tests must not share browser state
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: process.env.HABITCIRCUIT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Start the dev server automatically when running locally */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
