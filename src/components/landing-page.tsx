'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface LandingPageProps {
  onCreateTable: () => void;
}

export function LandingPage({ onCreateTable }: LandingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-4xl font-headline font-bold text-primary">
            TableFlow
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-8">
          <p className="mb-8 text-lg text-muted-foreground">
            Простой и удобный сервис для ведения заказов официантом.
          </p>
          <Button onClick={onCreateTable} className="w-full h-16 text-xl" size="lg">
            Создать стол
          </Button>
        </CardContent>
      </Card>
      <footer className="mt-12 text-center text-muted-foreground">
        <p>Связаться с создателем</p>
        <p className="font-semibold">contact@tableflow.app</p>
      </footer>
    </div>
  );
}
