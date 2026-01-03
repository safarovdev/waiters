'use client';

import React, { useMemo } from 'react';
import type { Table, Guest } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CircleDollarSign, CheckCircle2, User } from 'lucide-react';

interface TableRepresentationProps {
  table: Table;
  onSeatClick: (guestId: number) => void;
}

const getGuestStatusIcon = (status: Guest['status']) => {
  switch (status) {
    case 'paid':
      return <CircleDollarSign className="h-4 w-4 text-green-500" />;
    case 'all_served':
      return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};


export function TableRepresentation({ table, onSeatClick }: TableRepresentationProps) {
  const seatPositions = useMemo(() => {
    const positions = [];
    const containerSize = 400; 
    const chairSize = 56; 
    const chairMargin = 8; 

    if (table.shape === 'round') {
      const tableRadius = containerSize / 3.5;
      const angleStep = (2 * Math.PI) / table.seats;
      for (let i = 0; i < table.seats; i++) {
        const angle = angleStep * i - Math.PI / 2;
        const x = containerSize / 2 + tableRadius * Math.cos(angle) - chairSize / 2;
        const y = containerSize / 2 + tableRadius * Math.sin(angle) - chairSize / 2;
        positions.push({ top: `${y}px`, left: `${x}px` });
      }
    } else { // rectangular
        const tableWidth = containerSize / 1.5;
        const tableHeight = containerSize / 3;
        const tableTopY = (containerSize - tableHeight) / 2;
        const tableBottomY = tableTopY + tableHeight;
        const tableLeftX = (containerSize - tableWidth) / 2;

        let seatsTop = Math.ceil(table.seats / 2);
        let seatsBottom = Math.floor(table.seats / 2);

        const totalWidthTop = seatsTop * (chairSize + chairMargin) - chairMargin;
        const startXTop = tableLeftX + (tableWidth - totalWidthTop) / 2;

        for (let i = 0; i < seatsTop; i++) {
            const x = startXTop + i * (chairSize + chairMargin);
            const y = tableTopY - chairSize - chairMargin;
            positions.push({ top: `${y}px`, left: `${x}px` });
        }

        const totalWidthBottom = seatsBottom * (chairSize + chairMargin) - chairMargin;
        const startXBottom = tableLeftX + (tableWidth - totalWidthBottom) / 2;

        for (let i = 0; i < seatsBottom; i++) {
            const x = startXBottom + i * (chairSize + chairMargin);
            const y = tableBottomY + chairMargin;
            positions.push({ top: `${y}px`, left: `${x}px` });
        }
    }
    return positions;
  }, [table.shape, table.seats]);

  return (
    <div className="relative h-[400px] w-[400px] my-8">
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted border-2 border-primary shadow-lg',
          table.shape === 'round' ? 'w-48 h-48 rounded-full' : 'w-2/3 h-1/3'
        )}
      />
      {table.guests.map((guest, index) => {
        return (
          <button
            key={guest.id}
            onClick={() => onSeatClick(guest.id)}
            className={cn(
              'absolute flex flex-col items-center justify-center bg-card border shadow-md transition-all hover:shadow-lg hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-center p-1 w-14 h-14',
              { 'border-green-500': guest.status === 'paid', 'border-blue-500': guest.status === 'all_served'}
            )}
            style={seatPositions[index]}
            aria-label={`Гость ${guest.id}`}
          >
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm">{guest.id}</span>
              <User className="h-4 w-4" />
              {getGuestStatusIcon(guest.status)}
            </div>
          </button>
        )
      })}
    </div>
  );
}
