import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../../tests/helpers';
import type { UserProfileDto } from '@/api/generated/types.gen';
import { useAuthStore } from '@/stores/auth.store';
import { UsersActionsCell } from './users-actions-cell';

const mockNavigate = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const activeUser: UserProfileDto = {
  id: '2',
  email: 'user@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'ADMIN',
  isActive: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

const inactiveUser: UserProfileDto = {
  ...activeUser,
  id: '3',
  isActive: false,
};

const setupAuthStore = () => {
  useAuthStore.setState({
    accessToken: 'mock-token',
    refreshToken: 'mock-refresh',
    user: {
      id: '1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'Admin',
      role: 'ADMIN',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  });
};

describe('UsersActionsCell', () => {
  it('should render dropdown menu trigger', () => {
    setupAuthStore();
    renderWithProviders(<UsersActionsCell user={activeUser} />);
    expect(
      screen.getByRole('button', { name: 'Open menu' }),
    ).toBeInTheDocument();
  });

  it('should show view details option', async () => {
    setupAuthStore();
    const user = userEvent.setup();
    renderWithProviders(<UsersActionsCell user={activeUser} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByText('View details')).toBeInTheDocument();
  });

  it('should navigate to user detail on view details click', async () => {
    setupAuthStore();
    const user = userEvent.setup();
    renderWithProviders(<UsersActionsCell user={activeUser} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByText('View details'));

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/users/$userId',
      params: { userId: '2' },
    });
  });

  it('should show deactivate option for active users', async () => {
    setupAuthStore();
    const user = userEvent.setup();
    renderWithProviders(<UsersActionsCell user={activeUser} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByText('Deactivate')).toBeInTheDocument();
  });

  it('should show activate option for inactive users', async () => {
    setupAuthStore();
    const user = userEvent.setup();
    renderWithProviders(<UsersActionsCell user={inactiveUser} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByText('Activate')).toBeInTheDocument();
  });

  it('should show deactivate confirmation dialog', async () => {
    setupAuthStore();
    const user = userEvent.setup();
    renderWithProviders(<UsersActionsCell user={activeUser} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByText('Deactivate'));

    await waitFor(() => {
      expect(screen.getByText('Deactivate user')).toBeInTheDocument();
    });
    expect(
      screen.getByText(/Are you sure you want to deactivate user@example.com/),
    ).toBeInTheDocument();
  });

  it('should show delete confirmation dialog', async () => {
    setupAuthStore();
    const user = userEvent.setup();
    renderWithProviders(<UsersActionsCell user={activeUser} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(screen.getByText('Delete user')).toBeInTheDocument();
    });
    expect(
      screen.getByText(/permanently delete user@example.com/),
    ).toBeInTheDocument();
  });

  it('should hide deactivate and delete for own profile', async () => {
    setupAuthStore();
    const selfUser: UserProfileDto = {
      ...activeUser,
      id: '1', // Same as current user
    };
    const user = userEvent.setup();
    renderWithProviders(<UsersActionsCell user={selfUser} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByText('View details')).toBeInTheDocument();
    expect(screen.queryByText('Deactivate')).toBeNull();
    expect(screen.queryByText('Delete')).toBeNull();
  });
});
