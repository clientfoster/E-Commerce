import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (productId: string) => {
        const { items } = get();
        if (!items.includes(productId)) {
          set({ items: [...items, productId] });
        }
      },
      
      removeItem: (productId: string) => {
        const { items } = get();
        set({ items: items.filter(id => id !== productId) });
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
      
      isInWishlist: (productId: string) => {
        const { items } = get();
        return items.includes(productId);
      }
    }),
    {
      name: 'wishlist-storage',
    }
  )
);