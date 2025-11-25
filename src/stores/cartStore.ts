import { create } from 'zustand';
import { cartApi } from '../lib/api';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  size: string | null;
  color: string | null;
  material: string | null;
  product?: {
    name: string;
    price: number;
    images: string[];
    slug: string;
  };
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const items = await cartApi.getCart();
      set({ items: Array.isArray(items) ? items : [], loading: false });
    } catch (error) {
      console.error('Fetch cart error:', error);
      // Keep existing items on error to maintain UI state
      set({ loading: false });
      // Optionally show error toast/notification here
      throw error;
    }
  },

  addItem: async (item: Omit<CartItem, 'id'>) => {
    const existing = get().items.find(
      (i) =>
        i.product_id === item.product_id &&
        i.size === item.size &&
        i.color === item.color &&
        i.material === item.material
    );

    if (existing) {
      await get().updateQuantity(existing.id, existing.quantity + item.quantity);
    } else {
      try {
        const newItem = await cartApi.addToCart(
          item.product_id,
          item.quantity,
          item.size || undefined,
          item.color || undefined,
          item.material || undefined
        );
        set({ items: [...get().items, newItem] });
      } catch (error) {
        console.error('Add to cart error:', error);
        // Optionally show error toast/notification here
        throw error;
      }
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await get().removeItem(itemId);
      return;
    }

    const currentItems = get().items;
    
    try {
      // Optimistic update
      set({
        items: currentItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      });
      
      await cartApi.updateQuantity(itemId, quantity);
    } catch (error) {
      console.error('Update quantity error:', error);
      // Revert optimistic update on error
      set({ items: currentItems });
      // Optionally show error toast/notification here
      throw error;
    }
  },

  removeItem: async (itemId: string) => {
    const currentItems = get().items;
    const itemToRemove = currentItems.find(item => item.id === itemId);
    
    try {
      // Optimistic update
      set({ items: currentItems.filter((item) => item.id !== itemId) });
      
      await cartApi.removeFromCart(itemId);
    } catch (error) {
      console.error('Remove item error:', error);
      // Revert optimistic update on error
      if (itemToRemove) {
        set({ items: currentItems });
      }
      // Optionally show error toast/notification here
      throw error;
    }
  },

  clearCart: async () => {
    const currentItems = get().items;
    
    try {
      // Optimistic update
      set({ items: [] });
      
      await cartApi.clearCart();
    } catch (error) {
      console.error('Clear cart error:', error);
      // Revert optimistic update on error
      set({ items: currentItems });
      // Optionally show error toast/notification here
      throw error;
    }
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  },
}));
