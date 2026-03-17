import { test as base, type Page } from '@playwright/test';
import { mockAllApis } from './mock-api';

// Admin credentials — must match mock-api.ts handler
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin123!';

// Reusable login helper — sets up mocks, fills form, waits for redirect
const loginAsAdmin = async (page: Page): Promise<void> => {
  // Intercept all API calls before navigating
  await mockAllApis(page);

  await page.goto('/login');

  await page.getByLabel('Email').fill(ADMIN_EMAIL);
  await page.getByLabel('Password').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait for redirect to dashboard
  await page.waitForURL('/', { timeout: 10_000 });
};

// Extend base test with an authenticated page fixture
export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await loginAsAdmin(page);
    await use(page);
  },
});

export { expect } from '@playwright/test';
export { loginAsAdmin, ADMIN_EMAIL, ADMIN_PASSWORD };
