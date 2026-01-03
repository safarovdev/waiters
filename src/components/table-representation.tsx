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
        const topOffset = (containerSize - tableHeight) / 2 - chairSize;
        const bottomOffset = (containerSize + tableHeight) / 2;

        let seatsOnTop: number;
        let seatsOnBottom: number;
        let seatOnLeft = false;
        let seatOnRight = false;
        
        if (numSeats === 1) {
            seatsOnTop = 1;
            seatsOnBottom = 0;
        } else if (numSeats === 2) {
            seatsOnTop = 1;
            seatsOnBottom = 1;
        } else if (numSeats % 2 === 0) { // even number of seats >= 4
            seatOnLeft = true;
            seatOnRight = true;
            seatsOnTop = (numSeats - 2) / 2;
            seatsOnBottom = (numSeats - 2) / 2;
        } else { // odd number of seats >= 3
            seatOnLeft = true;
            seatsOnTop = Math.ceil((numSeats - 1) / 2);
            seatsOnBottom = Math.floor((numSeats - 1) / 2);
        }

        let currentSeat = 0;

        // Seat on the left
        if (seatOnLeft) {
            const x = (containerSize - tableWidth) / 2 - chairSize;
            const y = containerSize / 2 - chairSize / 2;
            positions.push({ top: `${y}px`, left: `${x}px`, 'data-guest-id': table.guests[currentSeat]?.id });
            currentSeat++;
        }

        // Seats on top
        for (let i = 0; i < seatsOnTop; i++) {
            const x = (containerSize - tableWidth) / 2 + (tableWidth * (i + 1)) / (seatsOnTop + 1) - chairSize/2;
            const y = topOffset;
            positions.push({ top: `${y}px`, left: `${x}px`, 'data-guest-id': table.guests[currentSeat]?.id });
            currentSeat++;
        }
        
        // Seat on the right
        if (seatOnRight) {
            const x = (containerSize + tableWidth) / 2;
            const y = containerSize / 2 - chairSize / 2;
            positions.push({ top: `${y}px`, left: `${x}px`, 'data-guest-id': table.guests[currentSeat]?.id });
            currentSeat++;
        }
        
        // Seats on bottom
        for (let i = 0; i < seatsOnBottom; i++) {
            const x = (containerSize - tableWidth) / 2 + (tableWidth * (i + 1)) / (seatsOnBottom + 1) - chairSize/2;
            const y = bottomOffset;
            positions.push({ top: `${y}px`, left: `${x}px`, 'data-guest-id': table.guests[currentSeat]?.id });
            currentSeat++;
        }
    }

    return positions;
  }, [table.shape, table.seats, table.guests]);

  return (
    <div className="relative h-80 w-80 my-4 md:my-8">
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted border-2 border-primary shadow-lg',
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
