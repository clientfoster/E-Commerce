import type { IGiftCard } from '../../models/GiftCard';

const API_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function to create auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

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

/**
 * Gift Card API
 * 
 * Note: This API file is kept for compatibility but should use the giftCardApi
 * from newApis.ts which has the proper implementation matching backend routes.
 * 
 * @deprecated Use giftCardApi from '../lib/api/newApis' instead
 */
export const giftcardApi = {
  /**
   * Create a new gift card (purchase)
   * @deprecated Use giftCardApi.purchaseGiftCard from newApis.ts
   */
  createGiftCard: async (giftCardData: Partial<IGiftCard>): Promise<GiftCardResponse> => {
    try {
      const { initialAmount, recipientEmail, recipientName, message } = giftCardData;
      
      if (!initialAmount || initialAmount < 10) {
        return {
          success: false,
          message: 'Minimum gift card amount is $10'
        };
      }

      const response = await fetch(`${API_URL}/giftcards/purchase`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount: initialAmount, recipientEmail, recipientName, message }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to purchase gift card' }));
        return {
          success: false,
          message: error.error || 'Failed to purchase gift card'
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.gift_card,
      };
    } catch (error) {
      console.error('Create gift card error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create gift card'
      };
    }
  },

  /**
   * Get gift card by code
   * @deprecated Use giftCardApi.validateGiftCard from newApis.ts
   */
  getGiftCardByCode: async (code: string): Promise<GiftCardResponse> => {
    try {
      const response = await fetch(`${API_URL}/giftcards/balance/${code}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        return {
          success: false,
          message: 'Gift card not found'
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data as any,
      };
    } catch (error) {
      console.error('Get gift card error:', error);
      return {
        success: false,
        message: 'Gift card not found'
      };
    }
  },

  /**
   * Redeem a gift card
   * @deprecated Use giftCardApi.redeemGiftCard from newApis.ts
   */
  redeemGiftCard: async (code: string, amount: number): Promise<GiftCardResponse> => {
    try {
      const response = await fetch(`${API_URL}/giftcards/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, amount }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to redeem gift card' }));
        return {
          success: false,
          message: error.error || 'Failed to redeem gift card'
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data as any,
      };
    } catch (error) {
      console.error('Redeem gift card error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to redeem gift card'
      };
    }
  },

  /**
   * Get user's gift cards
   * Note: This endpoint doesn't exist in the backend yet
   * @deprecated This endpoint is not implemented in the backend
   */
  getUserGiftCards: async (): Promise<GiftCardsResponse> => {
    console.warn('getUserGiftCards is not implemented in the backend');
    return {
      success: false,
      message: 'This endpoint is not implemented'
    };
  }
};