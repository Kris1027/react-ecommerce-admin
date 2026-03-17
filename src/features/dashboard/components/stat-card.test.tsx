import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatCard, StatCardSkeleton } from './stat-card';

describe('StatCard', () => {
  it('should render title and value', () => {
    render(
      <StatCard title='Total Orders' value={42} icon={<span>icon</span>} />,
    );
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(
      <StatCard
        title='Revenue'
        value='$1,000'
        icon={<span>icon</span>}
        description='This month'
      />,
    );
    expect(screen.getByText('This month')).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    const { container } = render(
      <StatCard title='Users' value={100} icon={<span>icon</span>} />,
    );
    const paragraphs = container.querySelectorAll('p');
    // Only title and value paragraphs, no description
    expect(paragraphs).toHaveLength(2);
  });

  it('should render ReactNode as value', () => {
    render(
      <StatCard
        title='Revenue'
        value={<span data-testid='money'>99,99 zł</span>}
        icon={<span>icon</span>}
      />,
    );
    expect(screen.getByTestId('money')).toHaveTextContent('99,99 zł');
  });
});

describe('StatCardSkeleton', () => {
  it('should render skeleton elements', () => {
    const { container } = render(<StatCardSkeleton />);
    // Should have skeleton divs for loading state
    expect(container.querySelector('[class*="animate-pulse"]')).toBeTruthy();
  });
});
