'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTableStore } from '@/store/table';
import type { OrderItem, GuestStatus, OrderItemStatus, GuestGender } from '@/lib/types';
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
import { PlusCircle, Trash2, UserRound, User, UserCircle } from 'lucide-react';
import { StatusSelect } from './status-select';
import { ScrollArea } from './ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface GuestOrderSheetProps {
  guestId: number | null;
  onOpenChange: (open: boolean) => void;
}

export function GuestOrderSheet({ guestId, onOpenChange }: GuestOrderSheetProps) {
  const table = useTableStore((state) => state.table);
  const { addOrderItem, updateOrderItemStatus, removeOrderItem, updateGuestStatus, updateGuestDetails } = useTableStore();
  const guest = useMemo(() => table?.guests.find((g) => g.id === guestId), [table, guestId]);

  const [newItemName, setNewItemName] = useState('');
  const [guestName, setGuestName] = useState(guest?.name || '');
  
  useEffect(() => {
    if (guest) {
      setGuestName(guest.name);
    }
  }, [guest]);

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
  
  const handleGuestDetailsChange = (details: { name?: string; gender?: GuestGender}) => {
    if (guestId) {
        updateGuestDetails(guestId, details);
    }
  }

  const handleNameBlur = () => {
    if (guest && guestName !== guest.name) {
      handleGuestDetailsChange({ name: guestName });
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

        <div className="flex-1 -mx-6 overflow-y-auto">
          <div className="space-y-6 px-6 py-4 h-full flex flex-col">
            <div className="space-y-2">
              <Label htmlFor="guest-name">Имя / Комментарий</Label>
              <Input 
                id="guest-name"
                value={guestName} 
                onChange={(e) => setGuestName(e.target.value)}
                onBlur={handleNameBlur}
                placeholder='Напр. Анна, в красной кофте'
              />
            </div>

             <div className="space-y-3">
              <Label>Пол</Label>
              <RadioGroup
                value={guest?.gender}
                onValueChange={(gender: GuestGender) => handleGuestDetailsChange({ gender })}
                className="grid grid-cols-3 gap-4"
              >
                <Label htmlFor="gender-male" className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:border-accent has-[[data-state=checked]]:border-accent cursor-pointer transition-colors h-24">
                  <RadioGroupItem value="male" id="gender-male" className="sr-only" />
                  <User className="h-8 w-8 text-accent" />
                  Муж.
                </Label>
                <Label htmlFor="gender-female" className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:border-accent has-[[data-state=checked]]:border-accent cursor-pointer transition-colors h-24">
                  <RadioGroupItem value="female" id="gender-female" className="sr-only" />
                  <UserCircle className="h-8 w-8 text-accent" />
                  Жен.
                </Label>
                <Label htmlFor="gender-other" className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:border-accent has-[[data-state=checked]]:border-accent cursor-pointer transition-colors h-24">
                  <RadioGroupItem value="other" id="gender-other" className="sr-only" />
                  <UserRound className="h-8 w-8 text-accent" />
                  Другой
                </Label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
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

            <div className="flex flex-col flex-1 min-h-0">
                <h3 className="font-semibold mb-2">Позиции</h3>
                <ScrollArea className="flex-1 -mr-6">
                  <div className="space-y-2 pr-6">
                    {guest?.orders && guest.orders.length > 0 ? (
                      guest.orders.map((item: OrderItem) => (
                        <div key={item.id} className="flex items-center justify-between gap-2 rounded-lg bg-muted p-2">
                          <span className="flex-1 font-medium break-all">{item.name}</span>
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
        </div>

        <SheetFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">Закрыть</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
