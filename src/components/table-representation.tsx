'use client';

import React, { useMemo } from 'react';
import type { Table, Guest, GuestGender } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CircleDollarSign, CheckCircle2 } from 'lucide-react';
import { MaleIcon } from './icons/male-icon';
import { FemaleIcon } from './icons/female-icon';

interface TableRepresentationProps {
  table: Table;
  onSeatClick: (guestId: number) => void;
}

const getGuestStatusIcon = (status: Guest['status']) => {
  switch (status) {
    case 'paid':
      return <CircleDollarSign className="h-3 w-3 text-green-500" />;
    case 'all_served':
      return <CheckCircle2 className="h-3 w-3 text-blue-500" />;
    default:
      return null;
  }
};

const getGuestGenderIcon = (gender: GuestGender) => {
    switch(gender) {
        case 'male':
            return <MaleIcon className="h-4 w-4" />;
        case 'female':
            return <FemaleIcon className="h-4 w-4" />;
    }
}


export function TableRepresentation({ table, onSeatClick }: TableRepresentationProps) {
  const seatPositions = useMemo(() => {
    const positions = [];
    const containerSize = 288; // w-72
    const chairSize = 56; // w-14

    if (table.shape === 'round') {
      const tableRadius = containerSize / 4;
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
        const topOffset = (containerSize - tableHeight) / 2 - chairSize;
        const bottomOffset = (containerSize + tableHeight) / 2;

        let seatsOnTop: number;
        let seatsOnBottom: number;
        let seatOnLeft = false;
        let seatOnRight = false;
        let remainingSeats = table.seats;

        if (table.seats % 2 !== 0 && table.seats > 1) {
            seatOnRight = true;
            remainingSeats--;
        }
        if (table.seats % 2 === 0 && table.seats > 2) {
            seatOnLeft = true;
            seatOnRight = true;
            remainingSeats -= 2;
        }

        seatsOnTop = Math.ceil(remainingSeats / 2);
        seatsOnBottom = Math.floor(remainingSeats / 2);

        if(table.seats === 1) seatsOnTop = 1;


        let currentSeat = 0;
        const placeSeat = (x: number, y: number) => {
          if (currentSeat < table.seats) {
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
            const denominator = seatsOnTop > 0 ? seatsOnTop : 1;
            const x = (containerSize - tableWidth) / 2 + (tableWidth * (i + 0.5)) / denominator - chairSize/2;
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
          const denominator = seatsOnBottom > 0 ? seatsOnBottom : 1;
            const x = (containerSize - tableWidth) / 2 + (tableWidth * (i + 0.5)) / denominator - chairSize/2;
            const y = bottomOffset;
            placeSeat(x,y);
        }

    }
    return positions;
  }, [table.shape, table.seats]);

  return (
    <div className="relative h-72 w-72 my-4 md:my-8">
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted border-2 border-primary shadow-lg',
          table.shape === 'round' ? 'rounded-full w-28 h-28' : 'w-40 h-20'
        )}
      />
      {table.guests.map((guest, index) => {
        const lastOrder = guest.orders.length > 0 ? guest.orders[guest.orders.length - 1] : null;

        return (
          <button
            key={guest.id}
            onClick={() => onSeatClick(guest.id)}
            className={cn(
              'absolute flex flex-col items-center justify-center w-14 h-14 bg-card border shadow-md transition-all hover:shadow-lg hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-center p-1',
              { 'border-green-500': guest.status === 'paid', 'border-blue-500': guest.status === 'all_served'}
            )}
            style={seatPositions[index]}
            aria-label={`Гость ${guest.id}`}
          >
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs">{guest.id}</span>
              {getGuestGenderIcon(guest.gender)}
              {getGuestStatusIcon(guest.status)}
            </div>
            {lastOrder && <span className="text-[10px] text-muted-foreground truncate w-full">{lastOrder.name}</span>}
          </button>
        )
      })}
    </div>
  );
}
