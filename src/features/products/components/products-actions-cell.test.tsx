import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../../tests/helpers';
import type { ProductListItemDto } from '@/api/generated/types.gen';
import { ProductsActionsCell } from './products-actions-cell';

const mockNavigate = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const activeProduct: ProductListItemDto = {
  id: '1',
  name: 'Test Widget',
  slug: 'test-widget',
  price: '29.99',
  stock: 50,
  isActive: true,
  isFeatured: false,
  createdAt: '2026-01-01T00:00:00Z',
  category: { id: 'c1', name: 'Electronics' },
};

const inactiveProduct: ProductListItemDto = {
  ...activeProduct,
  id: '2',
  slug: 'inactive-widget',
  isActive: false,
};

describe('ProductsActionsCell', () => {
  it('should render dropdown menu trigger', () => {
    renderWithProviders(<ProductsActionsCell product={activeProduct} />);
    expect(
      screen.getByRole('button', { name: 'Open menu' }),
    ).toBeInTheDocument();
  });

  it('should show view details option', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductsActionsCell product={activeProduct} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByText('View details')).toBeInTheDocument();
  });

  it('should navigate to product detail on view details click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductsActionsCell product={activeProduct} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByText('View details'));

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/products/$productSlug',
      params: { productSlug: 'test-widget' },
    });
  });

  it('should show deactivate option for active products', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductsActionsCell product={activeProduct} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByText('Deactivate')).toBeInTheDocument();
  });

  it('should show activate option for inactive products', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductsActionsCell product={inactiveProduct} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByText('Activate')).toBeInTheDocument();
  });

  it('should show deactivate confirmation dialog', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductsActionsCell product={activeProduct} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByText('Deactivate'));

    await waitFor(() => {
      expect(screen.getByText('Deactivate product')).toBeInTheDocument();
    });
    expect(screen.getByText(/deactivate "Test Widget"/)).toBeInTheDocument();
  });

  it('should show delete confirmation dialog', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductsActionsCell product={activeProduct} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(screen.getByText('Delete product')).toBeInTheDocument();
    });
    expect(
      screen.getByText(/permanently delete "Test Widget"/),
    ).toBeInTheDocument();
  });
});
