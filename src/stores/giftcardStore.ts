import { create } from 'zustand';
import { giftcardApi } from '../lib/api/giftcardApi';
import type { IGiftCard } from '../models/GiftCard';

interface GiftCardState {
  giftCards: IGiftCard[];
  activeGiftCard: IGiftCard | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  createGiftCard: (giftCardData: Partial<IGiftCard>) => Promise<boolean>;
  applyGiftCard: (code: string) => Promise<boolean>;
  getGiftCardByCode: (code: string) => Promise<IGiftCard | null>;
  getUserGiftCards: (userId: string) => Promise<void>;
  clearError: () => void;
  setActiveGiftCard: (giftCard: IGiftCard | null) => void;
}

export const useGiftCardStore = create<GiftCardState>((set, get) => ({
  giftCards: [],
  activeGiftCard: null,
  loading: false,
  error: null,
  
  createGiftCard: async (giftCardData) => {
    set({ loading: true, error: null });
    try {
      const response = await giftcardApi.createGiftCard(giftCardData);
      if (response.success && response.data) {
        set({ loading: false });
        return true;
      } else {
        set({ loading: false, error: response.message || 'Failed to create gift card' });
        return false;
      }
    } catch (error) {
      set({ loading: false, error: 'An unexpected error occurred' });
      return false;
    }
  },
  
  applyGiftCard: async (code) => {
    set({ loading: true, error: null });
    try {
      const response = await giftcardApi.getGiftCardByCode(code);
      if (response.success && response.data) {
        // Check if gift card is valid
        const giftCard = response.data;
        const now = new Date();
        
        if (giftCard.isRedeemed) {
          set({ loading: false, error: 'This gift card has already been redeemed' });
          return false;
        }
        
        if (new Date(giftCard.expiresAt) < now) {
          set({ loading: false, error: 'This gift card has expired' });
          return false;
        }
        
        if (giftCard.balance <= 0) {
          set({ loading: false, error: 'This gift card has no remaining balance' });
          return false;
        }
        
        set({ 
          loading: false, 
          activeGiftCard: giftCard,
          error: null 
        });
        return true;
      } else {
        set({ loading: false, error: response.message || 'Invalid gift card code' });
        return false;
      }
    } catch (error) {
      set({ loading: false, error: 'An unexpected error occurred' });
      return false;
    }
  },
  
  getGiftCardByCode: async (code) => {
    set({ loading: true, error: null });
    try {
      const response = await giftcardApi.getGiftCardByCode(code);
      set({ loading: false });
      return response.success ? response.data || null : null;
    } catch (error) {
      set({ loading: false, error: 'Failed to fetch gift card' });
      return null;
    }
  },
  
  getUserGiftCards: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await giftcardApi.getUserGiftCards(userId);
      if (response.success && response.data) {
        set({ 
          loading: false, 
          giftCards: response.data 
        });
      } else {
        set({ loading: false, error: response.message || 'Failed to fetch gift cards' });
      }
    } catch (error) {
      set({ loading: false, error: 'An unexpected error occurred' });
    }
  },
  
  clearError: () => set({ error: null }),
  
  setActiveGiftCard: (giftCard) => set({ activeGiftCard: giftCard })
}));