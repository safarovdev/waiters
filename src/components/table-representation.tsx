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
    const containerSize = 320; // h-80 w-80, increased size
    const chairSize = 48; // increased size

    if (table.shape === 'round') {
      const tableRadius = containerSize / 3;
      const angleStep = (2 * Math.PI) / table.seats;
      for (let i = 0; i < table.seats; i++) {
        const angle = angleStep * i - Math.PI / 2;
        const x = containerSize / 2 + tableRadius * Math.cos(angle) - chairSize / 2;
        const y = containerSize / 2 + tableRadius * Math.sin(angle) - chairSize / 2;
        positions.push({ top: `${y}px`, left: `${x}px`, width: `${chairSize}px`, height: `${chairSize}px` });
      }
    } else { // rectangular
        const tableWidth = containerSize / 1.25;
        const tableHeight = containerSize / 2.5;
        const tableTopY = (containerSize - tableHeight) / 2;
        const tableBottomY = tableTopY + tableHeight;
        const tableLeftX = (containerSize - tableWidth) / 2;
        const tableRightX = tableLeftX + tableWidth;

        let seatsOnTop: number;
        let seatsOnBottom: number;
        let seatsOnLeft = 0;
        let seatsOnRight = 0;
        let remainingSeats = table.seats;
        
        if (remainingSeats % 2 !== 0 && remainingSeats > 1) {
            seatsOnRight = 1;
            remainingSeats--;
        }
        
        if (remainingSeats >= 2 && remainingSeats / 2 > 4) {
            if (seatsOnRight === 0) {
              seatsOnRight = 1;
              remainingSeats--;
            }
            seatsOnLeft = 1;
            remainingSeats--;
        }

        seatsOnTop = Math.ceil(remainingSeats / 2);
        seatsOnBottom = Math.floor(remainingSeats / 2);

        if(table.seats === 1) {
            seatsOnTop = 1;
            seatsOnBottom = 0;
            seatsOnLeft = 0;
            seatsOnRight = 0;
        };

        let currentSeat = 0;
        const placeSeat = (x: number, y: number) => {
          if (currentSeat < table.seats) {
            positions.push({ 
              top: `${y}px`, 
              left: `${x}px`, 
              width: `${chairSize}px`,
              height: `${chairSize}px`,
            });
            currentSeat++;
          }
        }

        // Seats on top
        for (let i = 0; i < seatsOnTop; i++) {
            const x = tableLeftX + (tableWidth * (i + 0.5)) / seatsOnTop - chairSize / 2;
            const y = tableTopY - chairSize - 8;
            placeSeat(x, y);
        }
        
        // Seats on bottom
        for (let i = 0; i < seatsOnBottom; i++) {
            const x = tableLeftX + (tableWidth * (i + 0.5)) / seatsOnBottom - chairSize / 2;
            const y = tableBottomY + 8;
            placeSeat(x,y);
        }

        // Seat on the left
        if (seatsOnLeft > 0) {
            const x = tableLeftX - chairSize - 8;
            const y = containerSize / 2 - chairSize / 2;
            placeSeat(x, y);
        }
        
        // Seat on the right
        if (seatsOnRight > 0) {
            const x = tableRightX + 8;
            const y = containerSize / 2 - chairSize / 2;
            placeSeat(x, y);
        }

    }
    return positions;
  }, [table.shape, table.seats]);

  return (
    <div className="relative h-80 w-80 my-8">
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted border-2 border-primary shadow-lg',
          table.shape === 'round' ? 'w-32 h-32 rounded-full' : 'w-64 h-32'
        )}
      />
      {table.guests.map((guest, index) => {
        const lastOrder = guest.orders.length > 0 ? guest.orders[guest.orders.length - 1] : null;

        return (
          <button
            key={guest.id}
            onClick={() => onSeatClick(guest.id)}
            className={cn(
              'absolute flex flex-col items-center justify-center bg-card border shadow-md transition-all hover:shadow-lg hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-center p-1',
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
            {lastOrder && <span className="text-[10px] text-muted-foreground truncate w-full">{lastOrder.name}</span>}
          </button>
        )
      })}
    </div>
  );
}
