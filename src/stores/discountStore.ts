import { create } from 'zustand';

interface Discount {
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

interface DiscountState {
  appliedDiscount: Discount | null;
  setDiscount: (discount: Discount | null) => void;
  removeDiscount: () => void;
  validateDiscount: (discount: Discount) => boolean;
}

export const useDiscountStore = create<DiscountState>((set, get) => ({
  appliedDiscount: null,
  
  setDiscount: (discount) => {
    if (discount && get().validateDiscount(discount)) {
      set({ appliedDiscount: discount });
    }
  },
  
  removeDiscount: () => {
    set({ appliedDiscount: null });
  },
  
  validateDiscount: (discount) => {
    const now = new Date();
    // Check if discount is active
    if (!discount.startDate || !discount.endDate) return false;
    
    // Check if discount is within date range
    if (now < new Date(discount.startDate) || now > new Date(discount.endDate)) {
      return false;
    }
    
    return true;
  }
}));