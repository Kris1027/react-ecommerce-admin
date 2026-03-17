import { defineConfig, devices } from '@playwright/test';

// The admin panel runs on port 3001, backend on port 3000
const BASE_URL = 'http://localhost:3001';

export default defineConfig({
  // E2E tests live in the e2e/ directory
  testDir: './e2e',

  // Run tests sequentially in CI (more stable), parallel locally
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry failed tests once in CI to handle flakiness
  retries: process.env.CI ? 1 : 0,

  // Limit parallel workers in CI to avoid resource contention
  workers: process.env.CI ? 1 : undefined,

  // Reporter: HTML report for CI, list for local dev
  reporter: process.env.CI ? 'html' : 'list',

  // Shared settings for all tests
  use: {
    baseURL: BASE_URL,

    // Collect trace on first retry (helps debug flaky tests in CI)
    trace: 'on-first-retry',

    // Take screenshot on failure
    screenshot: 'only-on-failure',
  },

  // Only test in Chromium — admin panel is internal, no cross-browser need
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Auto-start Vite dev server before running E2E tests
  webServer: {
    command: 'pnpm dev',
    url: BASE_URL,
    // Reuse existing dev server if already running
    reuseExistingServer: !process.env.CI,
    // Give Vite time to start (includes dependency pre-bundling on first run)
    timeout: 30_000,
  },
});
