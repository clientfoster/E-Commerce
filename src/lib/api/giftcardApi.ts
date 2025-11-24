import axios from 'axios';
import type { IGiftCard } from '../../models/GiftCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface GiftCardResponse {
  success: boolean;
  data?: IGiftCard;
  message?: string;
}

interface GiftCardsResponse {
  success: boolean;
  data?: IGiftCard[];
  message?: string;
}

export const giftcardApi = {
  // Create a new gift card
  createGiftCard: async (giftCardData: Partial<IGiftCard>): Promise<GiftCardResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/giftcards`, giftCardData);
      return response.data;
    } catch (error) {
      console.error('Create gift card error:', error);
      return {
        success: false,
        message: 'Failed to create gift card'
      };
    }
  },

  // Get gift card by code
  getGiftCardByCode: async (code: string): Promise<GiftCardResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/giftcards/code/${code}`);
      return response.data;
    } catch (error) {
      console.error('Get gift card error:', error);
      return {
        success: false,
        message: 'Gift card not found'
      };
    }
  },

  // Redeem a gift card
  redeemGiftCard: async (code: string, amount: number): Promise<GiftCardResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/giftcards/redeem`, { code, amount });
      return response.data;
    } catch (error) {
      console.error('Redeem gift card error:', error);
      return {
        success: false,
        message: 'Failed to redeem gift card'
      };
    }
  },

  // Get user's gift cards (if we implement user-specific gift cards)
  getUserGiftCards: async (userId: string): Promise<GiftCardsResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/giftcards`);
      return response.data;
    } catch (error) {
      console.error('Get user gift cards error:', error);
      return {
        success: false,
        message: 'Failed to fetch gift cards'
      };
    }
  }
};