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
    const tableRadius = table.shape === 'round' ? containerSize / 4 : containerSize / 3;
    const chairSize = 48; // Corresponds to w-12 and h-12

    if (table.shape === 'round') {
      const angleStep = (2 * Math.PI) / numSeats;
      for (let i = 0; i < numSeats; i++) {
        const angle = angleStep * i - Math.PI / 2;
        const x = containerSize / 2 + tableRadius * Math.cos(angle) - chairSize / 2;
        const y = containerSize / 2 + tableRadius * Math.sin(angle) - chairSize / 2;
        positions.push({ top: `${y}px`, left: `${x}px` });
      }
    } else { // square
        const seatsPerSide = Math.floor(numSeats / 4);
        const extraSeats = numSeats % 4;
        const sideCounts = [seatsPerSide, seatsPerSide, seatsPerSide, seatsPerSide];
        for (let i = 0; i < extraSeats; i++) sideCounts[i]++;

        let seatIndex = 0;
        const placeOnSide = (count: number, side: 'top' | 'right' | 'bottom' | 'left') => {
            for (let i = 0; i < count; i++) {
                const pos = (i + 1) * (containerSize / (count + 1));
                let x = 0, y = 0;
                if (side === 'top') { x = pos - chairSize/2; y = 0 - chairSize/2; }
                if (side === 'bottom') { x = pos - chairSize/2; y = containerSize - chairSize/2; }
                if (side === 'left') { y = pos - chairSize/2; x = 0 - chairSize/2; }
                if (side === 'right') { y = pos - chairSize/2; x = containerSize - chairSize/2; }
                positions[seatIndex++] = { top: `${y}px`, left: `${x}px` };
            }
        };
        placeOnSide(sideCounts[0], 'top');
        placeOnSide(sideCounts[1], 'right');
        placeOnSide(sideCounts[2], 'bottom');
        placeOnSide(sideCounts[3], 'left');
    }

    return positions;
  }, [table.shape, table.seats]);

  return (
    <div className="relative h-80 w-80 my-8">
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/20 border-2 border-primary shadow-lg',
          table.shape === 'round' ? 'rounded-full w-32 h-32' : 'rounded-md w-32 h-32'
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
