import { create } from 'zustand';

interface UIState {
  cartOpen: boolean;
  authModalOpen: boolean;
  authMode: 'signin' | 'signup';
  mobileMenuOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setAuthModalOpen: (open: boolean, mode?: 'signin' | 'signup') => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  authModalOpen: false,
  authMode: 'signin',
  mobileMenuOpen: false,

  setCartOpen: (open) => set({ cartOpen: open }),

  setAuthModalOpen: (open, mode = 'signin') =>
    set({ authModalOpen: open, authMode: mode }),

  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
}));
