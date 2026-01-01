'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTableStore } from '@/store/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Circle, Square } from 'lucide-react';

const formSchema = z.object({
  shape: z.enum(['round', 'square']),
  seats: z.coerce.number().min(1, 'Минимум 1 стул').max(20, 'Максимум 20 стульев'),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTableDialog({ open, onOpenChange }: CreateTableDialogProps) {
  const createTable = useTableStore((state) => state.createTable);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shape: 'round',
      seats: 4,
    },
  });

  const onSubmit = (data: FormValues) => {
    createTable(data.shape, data.seats);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Создать стол</DialogTitle>
            <DialogDescription>Выберите форму стола и количество гостей.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <Controller
              name="shape"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Форма стола</Label>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <Label htmlFor="shape-round" className="flex flex-col items-center gap-2 rounded-md border-2 border-transparent [&:has([data-state=checked])]:border-primary p-4 cursor-pointer">
                      <RadioGroupItem value="round" id="shape-round" className="sr-only" />
                      <Circle className="h-12 w-12" />
                      Круглый
                    </Label>
                    <Label htmlFor="shape-square" className="flex flex-col items-center gap-2 rounded-md border-2 border-transparent [&:has([data-state=checked])]:border-primary p-4 cursor-pointer">
                      <RadioGroupItem value="square" id="shape-square" className="sr-only" />
                      <Square className="h-12 w-12" />
                      Квадратный
                    </Label>
                  </RadioGroup>
                </div>
              )}
            />
            <Controller
              name="seats"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="seats">Количество стульев</Label>
                  <Input id="seats" type="number" {...field} />
                  {errors.seats && <p className="text-sm text-destructive">{errors.seats.message}</p>}
                </div>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">Создать</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
