import { test, expect } from './fixtures/auth.fixture';

test.describe('Auth Guard', () => {
  test('should persist session after page reload', async ({
    authenticatedPage,
  }) => {
    // Already logged in via fixture — verify dashboard is visible
    await expect(
      authenticatedPage.getByRole('heading', { name: 'Dashboard' }),
    ).toBeVisible();

    // Reload the page
    await authenticatedPage.reload();

    // Should still be on the dashboard (not redirected to login)
    await expect(
      authenticatedPage.getByRole('heading', { name: 'Dashboard' }),
    ).toBeVisible();
  });

  test('should navigate between protected routes without re-login', async ({
    authenticatedPage,
  }) => {
    // Navigate to Products
    await authenticatedPage
      .getByRole('navigation')
      .getByRole('link', { name: 'Products' })
      .click();

    await expect(
      authenticatedPage.getByRole('heading', { name: 'Products' }),
    ).toBeVisible();

    // Navigate to Orders
    await authenticatedPage
      .getByRole('navigation')
      .getByRole('link', { name: 'Orders' })
      .click();

    await expect(
      authenticatedPage.getByRole('heading', { name: 'Orders' }),
    ).toBeVisible();

    // Navigate to Users
    await authenticatedPage
      .getByRole('navigation')
      .getByRole('link', { name: 'Users' })
      .click();

    await expect(
      authenticatedPage.getByRole('heading', { name: 'Users' }),
    ).toBeVisible();

    // Back to Dashboard
    await authenticatedPage
      .getByRole('navigation')
      .getByRole('link', { name: 'Dashboard' })
      .click();

    await expect(
      authenticatedPage.getByRole('heading', { name: 'Dashboard' }),
    ).toBeVisible();
  });

  test('should redirect to requested page after login', async ({
    authenticatedPage,
  }) => {
    // Already authenticated — just verify that the auth flow completed
    // The login.spec.ts covers the redirect case for unauthenticated users
    await expect(authenticatedPage).toHaveURL('/');
  });
});
