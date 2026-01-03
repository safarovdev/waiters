'use client';

import type { Guest } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { User as UserIcon, CheckCircle2, CircleDollarSign } from 'lucide-react';

interface GuestListProps {
  guests: Guest[];
  onGuestClick: (guestId: number) => void;
}

const statusConfig: Record<Guest['status'], { label: string; className: string; icon: React.ReactNode }> = {
  active: { label: 'Активен', className: 'bg-blue-500/20 text-blue-500 border-blue-500/50', icon: <UserIcon className="h-3 w-3" /> },
  all_served: { label: 'Подано', className: 'bg-green-500/20 text-green-500 border-green-500/50', icon: <CheckCircle2 className="h-3 w-3" /> },
  paid: { label: 'Оплачено', className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50', icon: <CircleDollarSign className="h-3 w-3" /> },
};


export function GuestList({ guests, onGuestClick }: GuestListProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Список гостей</CardTitle>
      </CardHeader>
      <CardContent>
          <div className="space-y-2">
            {guests.map((guest) => (
              <button
                key={guest.id}
                onClick={() => onGuestClick(guest.id)}
                className="w-full flex items-center justify-between gap-2 rounded-lg bg-muted p-3 text-left transition-colors hover:bg-muted/80"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-background">
                     <UserIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{guest.name}</p>
                    <p className="text-xs text-muted-foreground">Гость №{guest.id}</p>
                  </div>
                </div>
                 <Badge variant="outline" className={cn("flex items-center gap-1.5 border text-xs", statusConfig[guest.status].className)}>
                  {statusConfig[guest.status].icon}
                  {statusConfig[guest.status].label}
                </Badge>
              </button>
            ))}
          </div>
      </CardContent>
    </Card>
  );
}
