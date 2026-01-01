'use client';

import React, { useState, useEffect } from 'react';
import { useTableStore } from '@/store/table';
import { LandingPage } from '@/components/landing-page';
import { TableView } from '@/components/table-view';
import { CreateTableDialog } from '@/components/create-table-dialog';

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const table = useTableStore((state) => state.table);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      {table ? (
        <TableView />
      ) : (
        <LandingPage onCreateTable={() => setCreateDialogOpen(true)} />
      )}
      <CreateTableDialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen} />
    </main>
  );
}
