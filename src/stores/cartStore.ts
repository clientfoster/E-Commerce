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
  fetchCart: (userId: string) => Promise<void>;
  addItem: (userId: string, item: Omit<CartItem, 'id'>) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async (userId: string) => {
    set({ loading: true });
    try {
      const items = await cartApi.getCart(userId);
      set({ items, loading: false });
    } catch (error) {
      console.error('Fetch cart error:', error);
      set({ loading: false });
    }
  },

  addItem: async (userId: string, item: Omit<CartItem, 'id'>) => {
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
          userId,
          item.product_id,
          item.quantity,
          item.size || undefined,
          item.color || undefined,
          item.material || undefined
        );
        set({ items: [...get().items, newItem] });
      } catch (error) {
        console.error('Add to cart error:', error);
      }
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await get().removeItem(itemId);
      return;
    }

    try {
      await cartApi.updateQuantity(itemId, quantity);
      set({
        items: get().items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      });
    } catch (error) {
      console.error('Update quantity error:', error);
    }
  },

  removeItem: async (itemId: string) => {
    try {
      await cartApi.removeFromCart(itemId);
      set({ items: get().items.filter((item) => item.id !== itemId) });
    } catch (error) {
      console.error('Remove item error:', error);
    }
  },

  clearCart: async (userId: string) => {
    try {
      await cartApi.clearCart(userId);
      set({ items: [] });
    } catch (error) {
      console.error('Clear cart error:', error);
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
