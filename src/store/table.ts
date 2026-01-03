'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState, Guest, OrderItem, TableShape, GuestStatus, OrderItemStatus, GuestGender } from '@/lib/types';

interface TableActions {
  createTable: (shape: TableShape, seats: number) => void;
  resetTable: () => void;
  addOrderItem: (guestId: number, itemName: string) => void;
  updateOrderItemStatus: (guestId: number, itemId: string, status: OrderItemStatus) => void;
  removeOrderItem: (guestId: number, itemId: string) => void;
  updateGuestStatus: (guestId: number, status: GuestStatus) => void;
  updateGuestDetails: (guestId: number, details: { name?: string; gender?: GuestGender }) => void;
  addCommonOrderItem: (itemName: string) => void;
  updateCommonOrderItemStatus: (itemId: string, status: OrderItemStatus) => void;
  removeCommonOrderItem: (itemId: string) => void;
}

export const useTableStore = create<AppState & TableActions>()(
  persist(
    (set, get) => ({
      table: null,
      createTable: (shape, seats) => {
        const guests: Guest[] = Array.from({ length: seats }, (_, i) => ({
          id: i + 1,
          orders: [],
          status: 'active',
          gender: 'female',
          name: `Гость ${i + 1}`,
        }));
        set({ table: { shape, seats, guests, commonOrder: [] } });
      },
      resetTable: () => set({ table: null }),
      
      updateGuestStatus: (guestId, status) => {
        set((state) => {
          if (!state.table) return {};
          const newGuests = state.table.guests.map((g) =>
            g.id === guestId ? { ...g, status } : g
          );
          return { table: { ...state.table, guests: newGuests } };
        });
      },

      updateGuestDetails: (guestId, details) => {
        set((state) => {
          if (!state.table) return {};
          const newGuests = state.table.guests.map((g) => 
            g.id === guestId ? { ...g, ...details } : g
          );
          return { table: { ...state.table, guests: newGuests } };
        })
      },

      addOrderItem: (guestId, itemName) => {
        set((state) => {
          if (!state.table) return {};
          const newItem: OrderItem = { id: Date.now().toString(), name: itemName, status: 'ordered' };
          const newGuests = state.table.guests.map((g) =>
            g.id === guestId ? { ...g, orders: [...g.orders, newItem] } : g
          );
          return { table: { ...state.table, guests: newGuests } };
        });
      },

      updateOrderItemStatus: (guestId, itemId, status) => {
        set((state) => {
          if (!state.table) return {};
          let targetGuest: Guest | undefined;
          const newGuests = state.table.guests.map((g) => {
            if (g.id === guestId) {
              const newOrders = g.orders.map((item) =>
                item.id === itemId ? { ...item, status } : item
              );
              targetGuest = { ...g, orders: newOrders };
              return targetGuest;
            }
            return g;
          });

          // Auto-update guest status if all items are served
          if (targetGuest) {
            const allServed = targetGuest.orders.every((item) => item.status === 'served' || item.status === 'canceled');
            if (allServed && targetGuest.orders.length > 0 && targetGuest.status === 'active') {
              targetGuest.status = 'all_served';
              const finalGuests = state.table.guests.map(g => g.id === guestId ? targetGuest! : g);
              return { table: { ...state.table, guests: finalGuests } };
            }
          }

          return { table: { ...state.table, guests: newGuests } };
        });
      },

      removeOrderItem: (guestId, itemId) => {
        set(state => {
            if (!state.table) return {};
            const newGuests = state.table.guests.map(g => {
                if (g.id === guestId) {
                    return {...g, orders: g.orders.filter(item => item.id !== itemId)};
                }
                return g;
            });
            return { table: { ...state.table, guests: newGuests }};
        });
      },

      addCommonOrderItem: (itemName) => {
        set((state) => {
          if (!state.table) return {};
          const newItem: OrderItem = { id: Date.now().toString(), name: itemName, status: 'ordered' };
          return {
            table: {
              ...state.table,
              commonOrder: [...state.table.commonOrder, newItem],
            },
          };
        });
      },

      updateCommonOrderItemStatus: (itemId, status) => {
        set((state) => {
          if (!state.table) return {};
          const newCommonOrder = state.table.commonOrder.map((item) =>
            item.id === itemId ? { ...item, status } : item
          );
          return { table: { ...state.table, commonOrder: newCommonOrder } };
        });
      },

      removeCommonOrderItem: (itemId: string) => {
        set(state => {
            if (!state.table) return {};
            return {
                table: {
                    ...state.table,
                    commonOrder: state.table.commonOrder.filter(item => item.id !== itemId)
                }
            }
        })
      },
    }),
    {
      name: 'tableflow-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
