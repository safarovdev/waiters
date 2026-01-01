'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { OrderItemStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusSelectProps {
  value: OrderItemStatus;
  onValueChange: (value: OrderItemStatus) => void;
}

const statusConfig: Record<OrderItemStatus, { label: string; className: string }> = {
  ordered: { label: 'Заказано', className: 'bg-blue-500 text-white' },
  preparing: { label: 'Готовится', className: 'bg-accent text-accent-foreground' },
  served: { label: 'Подано', className: 'bg-success text-success-foreground' },
  canceled: { label: 'Отменено', className: 'bg-destructive text-destructive-foreground' },
};

export function StatusSelect({ value, onValueChange }: StatusSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[150px] p-0 border-none bg-transparent focus:ring-0">
        <SelectValue asChild>
          <Badge variant="outline" className={cn("border-0", statusConfig[value].className)}>
            {statusConfig[value].label}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.keys(statusConfig).map((status) => (
          <SelectItem key={status} value={status}>
            <span className="flex items-center gap-2">
              <span className={cn('h-2 w-2 rounded-full', statusConfig[status as OrderItemStatus].className)} />
              {statusConfig[status as OrderItemStatus].label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
