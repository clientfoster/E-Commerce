import type { Coupon } from '../../stores/couponStore';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface CouponResponse {
  success: boolean;
  data?: Coupon;
  message?: string;
}

interface ValidateCouponResponse {
  success: boolean;
  data?: {
    coupon: Coupon;
    discountAmount: number;
  };
  message?: string;
}

export const couponApi = {
  // Validate a coupon code
  validateCoupon: async (code: string, subtotal: number): Promise<ValidateCouponResponse> => {
    try {
      const response = await fetch(`${API_URL}/coupons/validate/${code}?subtotal=${subtotal}`);
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to validate coupon'
      };
    }
  },

  // Apply a coupon to the cart
  applyCoupon: async (code: string): Promise<CouponResponse> => {
    try {
      const response = await fetch(`${API_URL}/coupons/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to apply coupon'
      };
    }
  },

  // Remove a coupon from the cart
  removeCoupon: async (): Promise<CouponResponse> => {
    try {
      const response = await fetch(`${API_URL}/coupons/remove`, {
        method: 'DELETE',
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to remove coupon'
      };
    }
  },

  // Get all available coupons (for admin)
  getAllCoupons: async (): Promise<{ success: boolean; data?: Coupon[]; message?: string }> => {
    try {
      const response = await fetch(`${API_URL}/coupons`);
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to fetch coupons'
      };
    }
  },

  // Create a new coupon (for admin)
  createCoupon: async (couponData: Partial<Coupon>): Promise<CouponResponse> => {
    try {
      const response = await fetch(`${API_URL}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponData),
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to create coupon'
      };
    }
  },

  // Update a coupon (for admin)
  updateCoupon: async (id: string, couponData: Partial<Coupon>): Promise<CouponResponse> => {
    try {
      const response = await fetch(`${API_URL}/coupons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponData),
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to update coupon'
      };
    }
  },

  // Delete a coupon (for admin)
  deleteCoupon: async (id: string): Promise<CouponResponse> => {
    try {
      const response = await fetch(`${API_URL}/coupons/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to delete coupon'
      };
    }
  }
};