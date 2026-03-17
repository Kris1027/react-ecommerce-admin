import { test, expect } from './fixtures/auth.fixture';

test.describe('Navigation', () => {
  // All sidebar pages with their expected heading text
  const pages = [
    { link: 'Dashboard', url: '/', heading: 'Dashboard' },
    { link: 'Products', url: '/products', heading: 'Products' },
    { link: 'Categories', url: '/categories', heading: 'Categories' },
    { link: 'Inventory', url: '/inventory', heading: 'Inventory' },
    { link: 'Orders', url: '/orders', heading: 'Orders' },
    { link: 'Payments', url: '/payments', heading: 'Payments' },
    { link: 'Coupons', url: '/coupons', heading: 'Coupons' },
    { link: 'Users', url: '/users', heading: 'Users' },
    { link: 'Reviews', url: '/reviews', heading: 'Reviews' },
    { link: 'Shipping', url: '/shipping', heading: 'Shipping Methods' },
    { link: 'Notifications', url: '/notifications', heading: 'Notifications' },
  ];

  for (const { link, url, heading } of pages) {
    test(`should navigate to ${link} page`, async ({ authenticatedPage }) => {
      await authenticatedPage
        .getByRole('navigation')
        .getByRole('link', { name: link })
        .click();

      // Verify URL contains the path (pages may add query params like ?page=1&limit=10)
      await expect(authenticatedPage).toHaveURL(new RegExp(`${url}(\\?.*)?$`));

      // Verify page heading is visible
      await expect(
        authenticatedPage.getByRole('heading', { name: heading }),
      ).toBeVisible();
    });
  }

  test('should highlight active sidebar link', async ({
    authenticatedPage,
  }) => {
    // Navigate to Products
    await authenticatedPage
      .getByRole('navigation')
      .getByRole('link', { name: 'Products' })
      .click();

    // The Products link should have active styling (data-status="active" from TanStack Router)
    await expect(
      authenticatedPage
        .getByRole('navigation')
        .getByRole('link', { name: 'Products' }),
    ).toHaveAttribute('data-status', 'active');
  });
});
