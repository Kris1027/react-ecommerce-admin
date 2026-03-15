import { cn } from '@/lib/utils';
import { formatMoney } from '@/lib/utils';

type MoneyDisplayProps = {
  amount: number;
  className?: string;
};

const MoneyDisplay = ({ amount, className }: MoneyDisplayProps) => {
  return <span className={cn(className)}>{formatMoney(amount)}</span>;
};

export { MoneyDisplay };
