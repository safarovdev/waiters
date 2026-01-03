'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onCreateTable: () => void;
}

export function LandingPage({ onCreateTable }: LandingPageProps) {
  return (
    <div className="flex h-screen w-screen flex-col bg-background">
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-md w-full">
          <h1 className="text-6xl md:text-7xl font-bold text-primary tracking-tighter mb-4">
            Azer
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Ваш незаменимый помощник для управления заказами в ресторане. Быстро, просто и эффективно.
          </p>
          <Button onClick={onCreateTable} size="lg" className="w-full h-14 text-lg group">
            Начать работу
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </main>
      <footer className="py-6 px-4 text-center text-sm text-muted-foreground">
        <p>Разработано с ❤️</p>
      </footer>
    </div>
  );
}
