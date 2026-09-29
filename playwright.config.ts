import process from 'node:process'

import { defineConfig, devices } from '@playwright/test'

const isCI = !!process.env.CI
const PORT = 4173

/**
 * E2E always runs against the production build (`vite preview`),
 * so the real security headers (CSP) are in effect.
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'iphone',
      use: { ...devices['iPhone 15'] },
      testIgnore: /\.desktop\.spec\.ts$/,
    },
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /\.mobile\.spec\.ts$/,
    },
  ],
  webServer: {
    command: isCI ? 'npm run preview' : 'npm run build-only && npm run preview',
    port: PORT,
    reuseExistingServer: !isCI,
  },
})
