'use client';

import React, { useMemo } from 'react';
import type { Table, Guest, GuestGender } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CircleDollarSign, CheckCircle2, User, UserRound, UserCircle } from 'lucide-react';

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

const getGuestGenderIcon = (gender: GuestGender) => {
    switch(gender) {
        case 'male':
            return <User className="h-5 w-5" />;
        case 'female':
            return <UserCircle className="h-5 w-5" />;
        default:
            return <UserRound className="h-5 w-5" />;
    }
}


export function TableRepresentation({ table, onSeatClick }: TableRepresentationProps) {
  const seatPositions = useMemo(() => {
    const positions = [];
    const numSeats = table.seats;
    const containerSize = 320; // Corresponds to w-80 and h-80
    const chairSize = 64; // Corresponds to w-16 and h-16

    if (table.shape === 'round') {
      const tableRadius = containerSize / 3.5;
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
        let remainingSeats = numSeats;

        if (numSeats === 1) {
            seatsOnTop = 1;
            seatsOnBottom = 0;
        } else if (numSeats === 2) {
            seatsOnTop = 1;
            seatsOnBottom = 1;
        } else if (numSeats > 2) {
            if (numSeats % 2 !== 0) {
              seatOnRight = true;
              remainingSeats = numSeats - 1;
              seatsOnTop = remainingSeats / 2;
              seatsOnBottom = remainingSeats / 2;
            } else {
              seatOnLeft = true;
              seatOnRight = true;
              remainingSeats = numSeats - 2;
              seatsOnTop = remainingSeats / 2;
              seatsOnBottom = remainingSeats / 2;
            }
        }

        let currentSeat = 0;
        const placeSeat = (x: number, y: number) => {
          if (currentSeat < numSeats) {
            positions.push({ top: `${y}px`, left: `${x}px` });
            currentSeat++;
          }
        }

        // Seat on the left
        if (seatOnLeft) {
            const x = (containerSize - tableWidth) / 2 - chairSize;
            const y = containerSize / 2 - chairSize / 2;
            placeSeat(x, y);
        }
        
        // Seats on top
        for (let i = 0; i < seatsOnTop; i++) {
            const x = (containerSize - tableWidth) / 2 + (tableWidth * (i + 0.5)) / (seatsOnTop) - chairSize/2;
            const y = topOffset;
            placeSeat(x, y);
        }
        
        // Seat on the right
        if (seatOnRight) {
            const x = (containerSize + tableWidth) / 2;
            const y = containerSize / 2 - chairSize / 2;
            placeSeat(x, y);
        }
        
        // Seats on bottom
        for (let i = 0; i < seatsOnBottom; i++) {
            const x = (containerSize - tableWidth) / 2 + (tableWidth * (i + 0.5)) / (seatsOnBottom) - chairSize/2;
            const y = bottomOffset;
            placeSeat(x,y);
        }

        // Fallback for single seat
        if(numSeats === 1){
          const x = containerSize/2 - chairSize/2;
          const y = topOffset;
          placeSeat(x, y);
        }
    }
    return positions;
  }, [table.shape, table.seats]);

  return (
    <div className="relative h-80 w-80 my-4 md:my-8">
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted border-2 border-primary shadow-lg',
          table.shape === 'round' ? 'rounded-full w-32 h-32' : 'w-48 h-24'
        )}
      />
      {table.guests.map((guest, index) => {
        const lastOrder = guest.orders.length > 0 ? guest.orders[guest.orders.length - 1] : null;

        return (
          <button
            key={guest.id}
            onClick={() => onSeatClick(guest.id)}
            className={cn(
              'absolute flex flex-col items-center justify-center w-16 h-16 bg-card border shadow-md transition-all hover:shadow-lg hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-center p-1',
              { 'border-green-500': guest.status === 'paid', 'border-blue-500': guest.status === 'all_served'}
            )}
            style={seatPositions[index]}
            aria-label={`Гость ${guest.id}`}
          >
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm">{guest.id}</span>
              {getGuestGenderIcon(guest.gender)}
              {getGuestStatusIcon(guest.status)}
            </div>
            {lastOrder && <span className="text-xs text-muted-foreground truncate w-full">{lastOrder.name}</span>}
          </button>
        )
      })}
    </div>
  );
}
