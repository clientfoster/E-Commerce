import { create } from 'zustand';
import { supabase } from '../lib/supabase';

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
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(name, price, images, slug)
      `)
      .eq('user_id', userId);

    if (!error && data) {
      set({ items: data as CartItem[], loading: false });
    } else {
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
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          ...item,
        })
        .select(`
          *,
          product:products(name, price, images, slug)
        `)
        .single();

      if (!error && data) {
        set({ items: [...get().items, data as CartItem] });
      }
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await get().removeItem(itemId);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (!error) {
      set({
        items: get().items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      });
    }
  },

  removeItem: async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (!error) {
      set({ items: get().items.filter((item) => item.id !== itemId) });
    }
  },

  clearCart: async (userId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (!error) {
      set({ items: [] });
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
