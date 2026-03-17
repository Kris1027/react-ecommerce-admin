import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBadge } from './status-badge';
import {
  ORDER_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  REVIEW_STATUS_MAP,
} from './status-maps';

describe('StatusBadge', () => {
  it('should render order status text', () => {
    render(<StatusBadge status='PENDING' statusMap={ORDER_STATUS_MAP} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('should render payment status text', () => {
    render(<StatusBadge status='SUCCEEDED' statusMap={PAYMENT_STATUS_MAP} />);
    expect(screen.getByText('Succeeded')).toBeInTheDocument();
  });

  it('should render review status text', () => {
    render(<StatusBadge status='APPROVED' statusMap={REVIEW_STATUS_MAP} />);
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('should fall back to raw status for unknown values', () => {
    render(
      <StatusBadge status='UNKNOWN_STATUS' statusMap={ORDER_STATUS_MAP} />,
    );
    expect(screen.getByText('UNKNOWN_STATUS')).toBeInTheDocument();
  });
});
