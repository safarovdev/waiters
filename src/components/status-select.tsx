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
  ordered: { label: 'Заказано', className: 'bg-blue-500/20 text-blue-500 border-blue-500/50' },
  preparing: { label: 'Готовится', className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' },
  served: { label: 'Подано', className: 'bg-green-500/20 text-green-500 border-green-500/50' },
  canceled: { label: 'Отменено', className: 'bg-red-500/20 text-red-500 border-red-500/50' },
};

export function StatusSelect({ value, onValueChange }: StatusSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[150px] p-0 border-none bg-transparent focus:ring-0">
        <SelectValue asChild>
          <Badge variant="outline" className={cn("border", statusConfig[value].className)}>
            {statusConfig[value].label}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.keys(statusConfig).map((status) => (
          <SelectItem key={status} value={status}>
            <span className="flex items-center gap-2">
              <span className={cn('h-2 w-2 rounded-full', statusConfig[status as OrderItemStatus].className.replace(/text-(.*)-500/, 'bg-$1-500').replace(/border-(.*)-500\/50/, ''))} />
              {statusConfig[status as OrderItemStatus].label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
