import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wishlistApi } from '../lib/api/newApis';

interface WishlistState {
  items: string[];
  loading: boolean;
  error: string | null;
  syncWithBackend: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

/**
 * Wishlist Store
 * 
 * This store manages wishlist items both locally (for quick access)
 * and syncs with the backend API when user is authenticated.
 * 
 * - Items are stored locally for offline access
 * - When authenticated, syncs with backend for persistence across devices
 * - Falls back to local storage if backend sync fails
 */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,
      
      /**
       * Sync local wishlist with backend
       * Fetches wishlist items from server and updates local state
       */
      syncWithBackend: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          // Not authenticated, skip sync
          return;
        }

        set({ loading: true, error: null });
        try {
          const backendItems = await wishlistApi.getWishlist();
          // Extract product IDs from backend items
          const productIds = backendItems.map((item: any) => item.product_id);
          set({ items: productIds, loading: false, error: null });
        } catch (error) {
          console.error('Sync wishlist with backend error:', error);
          // Don't update error state - allow local storage to work
          set({ loading: false });
        }
      },
      
      /**
       * Add item to wishlist
       * Adds locally first, then syncs with backend if authenticated
       */
      addItem: async (productId: string) => {
        const { items } = get();
        
        // Check if already in wishlist
        if (items.includes(productId)) {
          return;
        }

        // Update local state immediately
        set({ items: [...items, productId] });

        // Sync with backend if authenticated
        const token = localStorage.getItem('auth_token');
        if (token) {
          try {
            await wishlistApi.addToWishlist(productId);
          } catch (error) {
            console.error('Add to wishlist backend error:', error);
            // Revert local change on backend error
            set({ items: items });
            set({ error: error instanceof Error ? error.message : 'Failed to add to wishlist' });
            throw error;
          }
        }
      },
      
      /**
       * Remove item from wishlist
       * Removes locally first, then syncs with backend if authenticated
       */
      removeItem: async (productId: string) => {
        const { items } = get();
        const updatedItems = items.filter(id => id !== productId);
        
        // Update local state immediately
        set({ items: updatedItems });

        // Sync with backend if authenticated
        // Note: We need the wishlist item ID from backend, not just product ID
        // For now, we'll just sync the entire list
        const token = localStorage.getItem('auth_token');
        if (token) {
          try {
            // Fetch current wishlist to find item ID
            const backendItems = await wishlistApi.getWishlist();
            const itemToRemove = backendItems.find((item: any) => item.product_id === productId);
            if (itemToRemove) {
              await wishlistApi.removeFromWishlist(itemToRemove.id);
            }
          } catch (error) {
            console.error('Remove from wishlist backend error:', error);
            // Revert local change on backend error
            set({ items: items });
            set({ error: error instanceof Error ? error.message : 'Failed to remove from wishlist' });
            throw error;
          }
        }
      },
      
      /**
       * Clear entire wishlist
       * Clears locally first, then syncs with backend if authenticated
       */
      clearWishlist: async () => {
        const { items } = get();
        
        // Update local state immediately
        set({ items: [] });

        // Sync with backend if authenticated
        const token = localStorage.getItem('auth_token');
        if (token) {
          try {
            await wishlistApi.clearWishlist();
          } catch (error) {
            console.error('Clear wishlist backend error:', error);
            // Revert local change on backend error
            set({ items: items });
            set({ error: error instanceof Error ? error.message : 'Failed to clear wishlist' });
            throw error;
          }
        }
      },
      
      /**
       * Check if product is in wishlist
       */
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