import { test, expect } from './fixtures/auth.fixture';
import { mockReviewsApi } from './fixtures/mock-api';

test.describe('Review Moderation', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Override with review-specific mocks (must come after auth fixture sets up mockAllApis)
    await mockReviewsApi(authenticatedPage);
  });

  test('should display reviews list with mock data', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage
      .getByRole('navigation')
      .getByRole('link', { name: 'Reviews' })
      .click();

    // Verify reviews page loaded
    await expect(
      authenticatedPage.getByRole('heading', { name: 'Reviews' }),
    ).toBeVisible();

    // Verify mock review data is displayed
    await expect(
      authenticatedPage.getByText('Wireless Headphones'),
    ).toBeVisible();
    await expect(authenticatedPage.getByText('USB-C Cable')).toBeVisible();

    // Verify status badges (use exact match to avoid TanStack devtools text)
    await expect(
      authenticatedPage.getByText('Pending', { exact: true }).first(),
    ).toBeVisible();
    await expect(
      authenticatedPage.getByText('Approved', { exact: true }).first(),
    ).toBeVisible();
  });

  test('should quick-approve a pending review via actions menu', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage
      .getByRole('navigation')
      .getByRole('link', { name: 'Reviews' })
      .click();

    await expect(
      authenticatedPage.getByText('Wireless Headphones'),
    ).toBeVisible();

    // Open the actions menu for the first row (pending review)
    const firstRowMenu = authenticatedPage
      .getByRole('row')
      .filter({ hasText: 'Wireless Headphones' })
      .getByRole('button', { name: 'Open menu' });

    await firstRowMenu.click();

    // Click "Approve" in the dropdown
    await authenticatedPage.getByRole('menuitem', { name: 'Approve' }).click();

    // Verify success toast appears
    await expect(authenticatedPage.getByText('Review approved')).toBeVisible({
      timeout: 5_000,
    });
  });

  test('should open moderate dialog and submit', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage
      .getByRole('navigation')
      .getByRole('link', { name: 'Reviews' })
      .click();

    await expect(
      authenticatedPage.getByText('Wireless Headphones'),
    ).toBeVisible();

    // Open actions menu for the pending review
    await authenticatedPage
      .getByRole('row')
      .filter({ hasText: 'Wireless Headphones' })
      .getByRole('button', { name: 'Open menu' })
      .click();

    // Click "Moderate" in the dropdown
    await authenticatedPage.getByRole('menuitem', { name: 'Moderate' }).click();

    // Verify moderate dialog opened
    await expect(
      authenticatedPage.getByRole('heading', { name: 'Moderate Review' }),
    ).toBeVisible();

    // Verify review comment is shown
    await expect(
      authenticatedPage.getByText(
        'Really enjoyed using this product, highly recommend!',
      ),
    ).toBeVisible();

    // Select "Reject" decision
    await authenticatedPage.getByLabel('Reject').click();

    // Fill admin note
    await authenticatedPage
      .getByLabel('Admin Note')
      .fill('Suspicious review pattern');

    // Submit the moderation
    await authenticatedPage.getByRole('button', { name: 'Reject' }).click();

    // Verify success feedback
    await expect(
      authenticatedPage.getByText(/rejected|updated|moderated/i),
    ).toBeVisible({ timeout: 5_000 });
  });
});
