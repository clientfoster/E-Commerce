import { create } from 'zustand';
import { authApi, UserProfile } from '../lib/api';

interface AuthState {
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  token: null,

  initialize: async () => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      try {
        const profile = await authApi.getProfile();
        if (profile) {
          set({ 
            user: { id: profile.id, email: profile.email }, 
            profile, 
            token,
            loading: false 
          });
        } else {
          localStorage.removeItem('auth_token');
          set({ loading: false });
        }
      } catch (error) {
        localStorage.removeItem('auth_token');
        set({ loading: false });
      }
    } else {
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    const { user, token, profile } = await authApi.signIn(email, password);
    localStorage.setItem('auth_token', token);
    set({ user, profile, token });
  },

  signUp: async (email: string, password: string, fullName: string) => {
    const { user, token, profile } = await authApi.signUp(email, password, fullName);
    localStorage.setItem('auth_token', token);
    set({ user, profile, token });
  },

  signOut: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, profile: null, token: null });
  },
}));
