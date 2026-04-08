import { test, expect } from './fixtures/auth.fixture';
import { mockProductsApi } from './fixtures/mock-api';

test.describe('Search and Filter', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await mockProductsApi(authenticatedPage);

    await authenticatedPage
      .getByRole('navigation')
      .getByRole('link', { name: 'Products' })
      .click();

    await expect(
      authenticatedPage.getByRole('heading', { name: 'Products' }),
    ).toBeVisible();
  });

  test('should filter products by search param in URL', async ({
    authenticatedPage,
  }) => {
    // Products page uses URL search params for filtering (no search input on page)
    await authenticatedPage.goto('/products?search=Wireless');

    await expect(authenticatedPage).toHaveURL(/search=Wireless/);
    await expect(
      authenticatedPage.getByText('Wireless Headphones'),
    ).toBeVisible();
  });

  test('should filter products by category', async ({ authenticatedPage }) => {
    // Open category filter dropdown
    await authenticatedPage
      .locator('button')
      .filter({ hasText: 'All categories' })
      .click();

    await authenticatedPage
      .getByRole('option', { name: 'Electronics' })
      .click();

    // URL should contain category filter
    await expect(authenticatedPage).toHaveURL(/categoryId=/);
  });

  test('should reset category filter to all', async ({ authenticatedPage }) => {
    // First select a category
    await authenticatedPage
      .locator('button')
      .filter({ hasText: 'All categories' })
      .click();

    await authenticatedPage
      .getByRole('option', { name: 'Electronics' })
      .click();

    await expect(authenticatedPage).toHaveURL(/categoryId=/);

    // Now reset to "All categories"
    await authenticatedPage
      .locator('button')
      .filter({ hasText: 'Electronics' })
      .click();

    await authenticatedPage
      .getByRole('option', { name: 'All categories' })
      .click();

    // categoryId should be removed from URL
    await expect(authenticatedPage).not.toHaveURL(/categoryId=/);
  });

  test('should display product data in the table', async ({
    authenticatedPage,
  }) => {
    await expect(
      authenticatedPage.getByText('Wireless Headphones'),
    ).toBeVisible();

    // Verify the product row has the category
    await expect(
      authenticatedPage.getByText('Electronics', { exact: true }),
    ).toBeVisible();
  });
});
