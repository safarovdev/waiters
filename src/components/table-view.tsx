'use client';

import React, { useState } from 'react';
import { useTableStore } from '@/store/table';
import { TableRepresentation } from './table-representation';
import { CommonOrderCard } from './common-order-card';
import { GuestOrderSheet } from './guest-order-sheet';
import { GuestList } from './guest-list';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export function TableView() {
  const table = useTableStore((state) => state.table);
  const resetTable = useTableStore((state) => state.resetTable);
  const [selectedGuestId, setSelectedGuestId] = useState<number | null>(null);

  if (!table) return null;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center p-4 min-h-screen">
      <div className="w-full flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold font-headline text-foreground">Стол №1</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Завершить
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Завершить работу со столом?</AlertDialogTitle>
              <AlertDialogDescription>
                Все данные по этому столу будут удалены. Это действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={resetTable} className="bg-destructive hover:bg-destructive/90">Завершить</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>

      <div className="w-full flex flex-col items-center gap-8">
        <div className="flex-shrink-0 flex items-center justify-center">
          <TableRepresentation table={table} onSeatClick={setSelectedGuestId} />
        </div>
        <div className="w-full flex flex-col gap-8">
          <CommonOrderCard />
          <GuestList guests={table.guests} onGuestClick={setSelectedGuestId} />
        </div>
      </div>
      
      <GuestOrderSheet
        guestId={selectedGuestId}
        onOpenChange={(open) => {
          if (!open) setSelectedGuestId(null);
        }}
      />
    </div>
  );
}
