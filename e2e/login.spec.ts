import { test, expect } from '@playwright/test';
import { mockAuthApi, mockDashboardApi } from './fixtures/mock-api';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './fixtures/auth.fixture';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API mocks before every test
    await mockAuthApi(page);
    await mockDashboardApi(page);
    await page.goto('/login');
  });

  test('should display the login form', async ({ page }) => {
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(
      page.getByText('Please enter a valid email address'),
    ).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('WrongPassword123!');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(
      page.getByText('Invalid email or password. Please try again.'),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('should login successfully and redirect to dashboard', async ({
    page,
  }) => {
    await page.getByLabel('Email').fill(ADMIN_EMAIL);
    await page.getByLabel('Password').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByText('Dashboard')).toBeVisible();
  });

  test('should show loading state during login', async ({ page }) => {
    await page.getByLabel('Email').fill(ADMIN_EMAIL);
    await page.getByLabel('Password').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(
      page.getByRole('button', { name: 'Signing in...' }),
    ).toBeVisible();
  });

  test('should redirect to login when accessing protected route while unauthenticated', async ({
    page,
  }) => {
    await page.goto('/products');

    await expect(page).toHaveURL(/\/login/);
  });
});
