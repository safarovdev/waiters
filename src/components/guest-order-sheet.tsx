'use client';

import React, { useState, useMemo } from 'react';
import { useTableStore } from '@/store/table';
import type { OrderItem, GuestStatus, OrderItemStatus } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';
import { StatusSelect } from './status-select';
import { ScrollArea } from './ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GuestOrderSheetProps {
  guestId: number | null;
  onOpenChange: (open: boolean) => void;
}

export function GuestOrderSheet({ guestId, onOpenChange }: GuestOrderSheetProps) {
  const table = useTableStore((state) => state.table);
  const { addOrderItem, updateOrderItemStatus, removeOrderItem, updateGuestStatus } = useTableStore();
  const guest = useMemo(() => table?.guests.find((g) => g.id === guestId), [table, guestId]);

  const [newItemName, setNewItemName] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim() && guestId) {
      addOrderItem(guestId, newItemName.trim());
      setNewItemName('');
    }
  };

  const handleGuestStatusChange = (status: GuestStatus) => {
    if (guestId) {
      updateGuestStatus(guestId, status);
    }
  };

  const guestStatusText: Record<GuestStatus, string> = {
    active: 'Активен',
    all_served: 'Все блюда поданы',
    paid: 'Оплачено',
  };

  return (
    <Sheet open={!!guestId} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Заказ гостя №{guest?.id}</SheetTitle>
          <SheetDescription>Добавляйте и отслеживайте позиции заказа.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4 pr-6">
            <div>
              <Label>Статус гостя</Label>
              <Select
                value={guest?.status}
                onValueChange={(value: GuestStatus) => handleGuestStatusChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Активен</SelectItem>
                  <SelectItem value="all_served">Все блюда поданы</SelectItem>
                  <SelectItem value="paid">Оплачено</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <form onSubmit={handleAddItem} className="flex gap-2">
              <Input
                placeholder="Название блюда"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
              <Button type="submit" size="icon" aria-label="Добавить позицию">
                <PlusCircle />
              </Button>
            </form>

            <h3 className="font-semibold">Позиции</h3>
            <ScrollArea className="h-[calc(100vh-24rem)]">
              <div className="space-y-2 pr-2">
                {guest?.orders && guest.orders.length > 0 ? (
                  guest.orders.map((item: OrderItem) => (
                    <div key={item.id} className="flex items-center justify-between gap-2 rounded-lg bg-muted p-2">
                      <span className="flex-1 font-medium">{item.name}</span>
                       <StatusSelect
                        value={item.status}
                        onValueChange={(status: OrderItemStatus) =>
                          guestId && updateOrderItemStatus(guestId, item.id, status)
                        }
                      />
                       <Button variant="ghost" size="icon" onClick={() => guestId && removeOrderItem(guestId, item.id)} aria-label="Удалить">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">У гостя нет заказов.</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <SheetFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">Закрыть</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
