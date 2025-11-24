import { create } from 'zustand';

export interface Coupon {
  code: string;
  name: string;
  description?: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  startDate: Date;
  endDate: Date;
}

interface CouponState {
  appliedCoupon: Coupon | null;
  setCoupon: (coupon: Coupon | null) => void;
  removeCoupon: () => void;
  validateCoupon: (coupon: Coupon) => boolean;
  calculateDiscount: (coupon: Coupon, subtotal: number) => number;
}

export const useCouponStore = create<CouponState>((set, get) => ({
  appliedCoupon: null,
  
  setCoupon: (coupon) => {
    if (coupon && get().validateCoupon(coupon)) {
      set({ appliedCoupon: coupon });
    }
  },
  
  removeCoupon: () => {
    set({ appliedCoupon: null });
  },
  
  validateCoupon: (coupon) => {
    const now = new Date();
    // Check if coupon is active
    if (!coupon.startDate || !coupon.endDate) return false;
    
    // Check if coupon is within date range
    if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
      return false;
    }
    
    return true;
  },
  
  calculateDiscount: (coupon, subtotal) => {
    if (!coupon || !get().validateCoupon(coupon)) return 0;
    
    // Check minimum amount requirement
    if (coupon.minimumAmount && subtotal < coupon.minimumAmount) {
      return 0;
    }
    
    let discount = 0;
    
    switch (coupon.discountType) {
      case 'percentage':
        discount = subtotal * (coupon.discountValue / 100);
        break;
      case 'fixed':
        discount = coupon.discountValue;
        break;
      case 'free_shipping':
        // Free shipping is handled separately
        return 0;
      default:
        return 0;
    }
    
    // Apply maximum discount limit if specified
    if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
      discount = coupon.maximumDiscount;
    }
    
    return discount;
  }
}));