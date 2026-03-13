import type { VariantProps } from 'class-variance-authority';

import { Badge, type badgeVariants } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

type StatusConfig = {
  label: string;
  variant: BadgeVariant;
  className?: string;
};

type StatusBadgeProps = {
  status: string;
  statusMap: Record<string, StatusConfig>;
  className?: string;
};

const StatusBadge = ({ status, statusMap, className }: StatusBadgeProps) => {
  const config = statusMap[status];

  if (!config) {
    return (
      <Badge variant='outline' className={className}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};

export { StatusBadge };
export type { StatusConfig, BadgeVariant };
