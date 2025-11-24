import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

interface RecentlyViewedState {
  items: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearAll: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addProduct: (product: Product) => {
        const { items } = get();
        // Remove if already exists
        const filteredItems = items.filter(item => item.id !== product.id);
        // Add to the beginning
        const newItems = [product, ...filteredItems];
        // Keep only the last 10 items
        const limitedItems = newItems.slice(0, 10);
        set({ items: limitedItems });
      },
      
      removeProduct: (productId: string) => {
        const { items } = get();
        set({ items: items.filter(item => item.id !== productId) });
      },
      
      clearAll: () => {
        set({ items: [] });
      }
    }),
    {
      name: 'recently-viewed-storage',
    }
  )
);