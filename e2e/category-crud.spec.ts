import { test, expect } from './fixtures/auth.fixture';
import { mockCategoriesApi } from './fixtures/mock-api';

test.describe('Category CRUD', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await mockCategoriesApi(authenticatedPage);
  });

  test('should display categories list with mock data', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage
      .getByRole('navigation')
      .getByRole('link', { name: 'Categories' })
      .click();

    await expect(
      authenticatedPage.getByRole('heading', { name: 'Categories' }),
    ).toBeVisible();

    await expect(
      authenticatedPage.getByText('Electronics', { exact: true }),
    ).toBeVisible();
    await expect(
      authenticatedPage.getByText('Clothing', { exact: true }),
    ).toBeVisible();
  });

  test('should navigate to create category page', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage
      .getByRole('navigation')
      .getByRole('link', { name: 'Categories' })
      .click();

    await authenticatedPage
      .getByRole('link', { name: 'Create category' })
      .click();

    await expect(
      authenticatedPage.getByRole('heading', { name: 'Create Category' }),
    ).toBeVisible();

    await expect(authenticatedPage.getByLabel('Name')).toBeVisible();
  });

  test('should create a new category', async ({ authenticatedPage }) => {
    await authenticatedPage
      .getByRole('navigation')
      .getByRole('link', { name: 'Categories' })
      .click();

    await authenticatedPage
      .getByRole('link', { name: 'Create category' })
      .click();

    await authenticatedPage.getByLabel('Name').fill('Test Category');
    await authenticatedPage
      .getByLabel('Description')
      .fill('A test category for E2E');

    await authenticatedPage
      .getByRole('button', { name: 'Create category' })
      .click();

    await expect(authenticatedPage.getByText('Category created')).toBeVisible({
      timeout: 5_000,
    });
  });

  test('should navigate to edit category page', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage
      .getByRole('navigation')
      .getByRole('link', { name: 'Categories' })
      .click();

    await expect(
      authenticatedPage.getByText('Electronics', { exact: true }),
    ).toBeVisible();

    await authenticatedPage
      .getByRole('row')
      .filter({ hasText: 'Electronics' })
      .getByRole('button', { name: 'Open menu' })
      .click();

    await authenticatedPage
      .getByRole('menuitem', { name: 'View details' })
      .click();

    await expect(
      authenticatedPage.getByRole('heading', { name: 'Electronics' }),
    ).toBeVisible();

    await expect(authenticatedPage.getByLabel('Name')).toHaveValue(
      'Electronics',
    );
  });

  test('should deactivate a category via actions menu', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage
      .getByRole('navigation')
      .getByRole('link', { name: 'Categories' })
      .click();

    await expect(
      authenticatedPage.getByText('Electronics', { exact: true }),
    ).toBeVisible();

    await authenticatedPage
      .getByRole('row')
      .filter({ hasText: 'Electronics' })
      .getByRole('button', { name: 'Open menu' })
      .click();

    await authenticatedPage
      .getByRole('menuitem', { name: 'Deactivate' })
      .click();

    await expect(
      authenticatedPage.getByText('Deactivate category'),
    ).toBeVisible();

    await authenticatedPage.getByRole('button', { name: 'Deactivate' }).click();

    await expect(
      authenticatedPage.getByText('Category deactivated'),
    ).toBeVisible({ timeout: 5_000 });
  });

  test('should delete a category via actions menu', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage
      .getByRole('navigation')
      .getByRole('link', { name: 'Categories' })
      .click();

    await expect(
      authenticatedPage.getByText('Electronics', { exact: true }),
    ).toBeVisible();

    await authenticatedPage
      .getByRole('row')
      .filter({ hasText: 'Electronics' })
      .getByRole('button', { name: 'Open menu' })
      .click();

    await authenticatedPage.getByRole('menuitem', { name: 'Delete' }).click();

    await expect(authenticatedPage.getByText('Delete category')).toBeVisible();

    await authenticatedPage.getByRole('button', { name: 'Delete' }).click();

    await expect(authenticatedPage.getByText('Category deleted')).toBeVisible({
      timeout: 5_000,
    });
  });
});
