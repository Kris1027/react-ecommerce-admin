import { cn } from '@/lib/utils';

type MoneyDisplayProps = {
  amount: number;
  className?: string;
};

const formatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
});

const MoneyDisplay = ({ amount, className }: MoneyDisplayProps) => {
  return <span className={cn(className)}>{formatter.format(amount)}</span>;
};

export { MoneyDisplay };
