import { create } from 'zustand';
import { giftcardApi } from '../lib/api/giftcardApi';
import { giftCardApi } from '../lib/api/newApis';
import type { IGiftCard } from '../models/GiftCard';

interface GiftCardState {
  giftCards: any[];
  activeGiftCard: IGiftCard | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  createGiftCard: (giftCardData: Partial<IGiftCard>) => Promise<boolean>;
  applyGiftCard: (code: string) => Promise<boolean>;
  getGiftCardByCode: (code: string) => Promise<IGiftCard | null>;
  getUserGiftCards: () => Promise<void>;
  clearError: () => void;
  setActiveGiftCard: (giftCard: IGiftCard | null) => void;
}

export const useGiftCardStore = create<GiftCardState>((set) => ({
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
        
        if (giftCard.expiresAt && new Date(giftCard.expiresAt) < now) {
          set({ loading: false, error: 'This gift card has expired' });
          return false;
        }
        
        if (giftCard.currentBalance <= 0) {
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
  
  getUserGiftCards: async () => {
    set({ loading: true, error: null });
    try {
      // Use the new API that doesn't require userId (uses token)
      const giftCards = await giftCardApi.getUserGiftCards();
      
      // Transform to match IGiftCard interface
      const transformedCards = giftCards.map((card: any) => ({
        _id: card._id,
        code: card.code,
        initialAmount: card.initialAmount,
        currentBalance: card.currentBalance,
        purchasedBy: undefined, // Will be populated from token
        recipientEmail: card.recipientEmail,
        recipientName: card.recipientName,
        message: card.message,
        expiresAt: card.expiresAt ? new Date(card.expiresAt) : undefined,
        isActive: card.isActive,
        isRedeemed: card.isRedeemed || false,
        redeemedAt: undefined,
        createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
        updatedAt: card.updatedAt ? new Date(card.updatedAt) : new Date(),
      }));
      
      set({ 
        loading: false, 
        giftCards: transformedCards,
        error: null
      });
    } catch (error) {
      console.error('Get user gift cards error:', error);
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch gift cards' 
      });
    }
  },
  
  clearError: () => set({ error: null }),
  
  setActiveGiftCard: (giftCard) => set({ activeGiftCard: giftCard })
}));