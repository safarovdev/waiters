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
      return <User className="h-4 w-4 text-muted-foreground" />;
  }
};


export function TableRepresentation({ table, onSeatClick }: TableRepresentationProps) {
  const seatPositions = useMemo(() => {
    const positions = [];
    const numSeats = table.seats;
    const containerSize = 320; // Corresponds to w-80 and h-80
    const chairSize = 48; // Corresponds to w-12 and h-12

    if (table.shape === 'round') {
      const tableRadius = containerSize / 4;
      const angleStep = (2 * Math.PI) / numSeats;
      for (let i = 0; i < numSeats; i++) {
        const angle = angleStep * i - Math.PI / 2;
        const x = containerSize / 2 + tableRadius * Math.cos(angle) - chairSize / 2;
        const y = containerSize / 2 + tableRadius * Math.sin(angle) - chairSize / 2;
        positions.push({ top: `${y}px`, left: `${x}px` });
      }
    } else { // rectangular
        const tableWidth = containerSize / 1.5;
        const tableHeight = containerSize / 3;

        const remainingSeats = numSeats - 2;
        const seatsPerLongSide = Math.ceil(remainingSeats / 2);
        const seatsTop = seatsPerLongSide;
        const seatsBottom = remainingSeats - seatsPerLongSide;
        
        let seatIndex = 0;

        // Top side
        for (let i = 0; i < seatsTop; i++) {
            const x = (containerSize / 2) - (tableWidth / 2) + (i + 1) * (tableWidth / (seatsTop + 1)) - chairSize / 2;
            const y = (containerSize / 2) - (tableHeight / 2) - chairSize;
            positions.push({ top: `${y}px`, left: `${x}px` });
        }
        
        // Right side
        if (numSeats >= 2) {
            const x = (containerSize / 2) + (tableWidth / 2);
            const y = containerSize / 2 - chairSize / 2;
            positions.push({ top: `${y}px`, left: `${x}px` });
        }

        // Bottom side
        for (let i = 0; i < seatsBottom; i++) {
            const x = (containerSize / 2) - (tableWidth / 2) + (i + 1) * (tableWidth / (seatsBottom + 1)) - chairSize / 2;
            const y = (containerSize / 2) + (tableHeight / 2);
            positions.push({ top: `${y}px`, left: `${x}px` });
        }

        // Left side
        if (numSeats >= 1) {
            const x = (containerSize / 2) - (tableWidth / 2) - chairSize;
            const y = containerSize / 2 - chairSize / 2;
            positions.push({ top: `${y}px`, left: `${x}px` });
        }
    }

    return positions;
  }, [table.shape, table.seats]);

  return (
    <div className="relative h-80 w-80 my-4 md:my-8">
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/20 border-2 border-primary shadow-lg',
          table.shape === 'round' ? 'rounded-full w-32 h-32' : 'rounded-md w-48 h-24'
        )}
      />
      {table.guests.map((guest, index) => (
        <button
          key={guest.id}
          onClick={() => onSeatClick(guest.id)}
          className={cn(
            'absolute flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-card border shadow-md transition-all hover:shadow-lg hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
            { 'border-green-500': guest.status === 'paid', 'border-blue-500': guest.status === 'all_served'}
          )}
          style={seatPositions[index]}
          aria-label={`Гость ${guest.id}`}
        >
          <span className="font-bold text-sm">{guest.id}</span>
          {getGuestStatusIcon(guest.status)}
        </button>
      ))}
    </div>
  );
}
