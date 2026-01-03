export type OrderItemStatus = 'ordered' | 'preparing' | 'served' | 'canceled';

export type OrderItem = {
  id: string;
  name: string;
  status: OrderItemStatus;
};

export type GuestStatus = 'active' | 'all_served' | 'paid';

export type Guest = {
  id: number;
  orders: OrderItem[];
  status: GuestStatus;
  name: string;
};

export type TableShape = 'round' | 'rectangular';

export type Table = {
  shape: TableShape;
  seats: number;
  guests: Guest[];
  commonOrder: OrderItem[];
};

export interface AppState {
  table: Table | null;
}
