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
           <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent tracking-tighter mb-4 animate-gradient-x">
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

// Add this to your globals.css or a suitable CSS file
/*
@keyframes gradient-x {
    0%, 100% {
        background-size: 200% 200%;
        background-position: left center;
    }
    50% {
        background-size: 200% 200%;
        background-position: right center;
    }
}
.animate-gradient-x {
    animation: gradient-x 5s ease infinite;
}
*/
