'use client';

import React, { useState } from 'react';
import { useTableStore } from '@/store/table';
import type { OrderItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';
import { StatusSelect } from './status-select';
import { ScrollArea } from './ui/scroll-area';

export function CommonOrderCard() {
  const commonOrder = useTableStore((state) => state.table?.commonOrder);
  const addCommonOrderItem = useTableStore((state) => state.addCommonOrderItem);
  const updateCommonOrderItemStatus = useTableStore((state) => state.updateCommonOrderItemStatus);
  const removeCommonOrderItem = useTableStore((state) => state.removeCommonOrderItem);

  const [newItemName, setNewItemName] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      addCommonOrderItem(newItemName.trim());
      setNewItemName('');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Общее на стол</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddItem} className="mb-4 flex gap-2">
          <Input
            placeholder="Напр. Вода, Хлеб"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <Button type="submit" size="icon" aria-label="Добавить позицию">
            <PlusCircle />
          </Button>
        </form>
        <ScrollArea className="h-40 md:h-48">
          <div className="space-y-2 pr-4">
            {commonOrder && commonOrder.length > 0 ? (
              commonOrder.map((item: OrderItem) => (
                <div key={item.id} className="flex items-center justify-between gap-2 rounded-lg bg-muted p-2">
                  <span className="flex-1 font-medium">{item.name}</span>
                  <StatusSelect
                    value={item.status}
                    onValueChange={(status) => updateCommonOrderItemStatus(item.id, status)}
                  />
                   <Button variant="ghost" size="icon" onClick={() => removeCommonOrderItem(item.id)} aria-label="Удалить">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">Нет общих заказов.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
