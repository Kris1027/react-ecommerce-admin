import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../../tests/helpers';
import { RecentOrders } from './recent-orders';

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe('RecentOrders', () => {
  it('should show loading skeletons initially', () => {
    const { container } = renderWithProviders(<RecentOrders />);
    expect(screen.getByText('Recent Orders')).toBeInTheDocument();
    expect(container.querySelector('[class*="animate-pulse"]')).toBeTruthy();
  });

  it('should render orders table after loading', async () => {
    renderWithProviders(<RecentOrders />);

    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument();
    });

    expect(screen.getByText('ORD-002')).toBeInTheDocument();
    expect(screen.getByText('ORD-003')).toBeInTheDocument();
  });

  it('should render order status badges', async () => {
    renderWithProviders(<RecentOrders />);

    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
    expect(screen.getByText('Delivered')).toBeInTheDocument();
    expect(screen.getByText('Shipped')).toBeInTheDocument();
  });

  it('should render order totals as money', async () => {
    renderWithProviders(<RecentOrders />);

    await waitFor(() => {
      expect(screen.getByText(/149,99/)).toBeInTheDocument();
    });
    expect(screen.getByText(/299,99/)).toBeInTheDocument();
  });

  it('should have a link to view all orders', async () => {
    renderWithProviders(<RecentOrders />);

    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument();
    });

    const viewAllLink = screen.getByRole('link');
    expect(viewAllLink).toHaveAttribute('href', '/orders');
  });
});
