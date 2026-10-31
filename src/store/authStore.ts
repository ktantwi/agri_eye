import { create } from 'zustand';
import { UserProfile, UserPlan } from '../types/field';
import { supabase, isSupabaseConfigured, INITIAL_DEMO_PROFILE } from '../lib/supabase';

interface AuthState {
  user: UserProfile | null;
  sessionToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  initializeAuth: () => Promise<void>;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setPlan: (plan: UserPlan) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: INITIAL_DEMO_PROFILE,
  sessionToken: 'demo-jwt-token',
  isLoading: false,
  isAuthenticated: true,

  initializeAuth: async () => {
    if (!isSupabaseConfigured || !supabase) {
      // Offline / standalone demo session
      const stored = localStorage.getItem('agrieye_user_profile');
      if (stored) {
        try {
          const profile = JSON.parse(stored);
          set({ user: profile, isAuthenticated: true, sessionToken: 'demo-jwt-token' });
          return;
        } catch (e) {}
      }
      set({ user: INITIAL_DEMO_PROFILE, isAuthenticated: true, sessionToken: 'demo-jwt-token' });
      return;
    }

    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch profile from supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          set({
            user: {
              id: profile.id,
              email: session.user.email,
              full_name: profile.full_name || session.user.email?.split('@')[0] || 'User',
              company: profile.company,
              plan: profile.plan || 'free',
              role: profile.role || 'user',
              created_at: profile.created_at,
            },
            sessionToken: session.access_token,
            isAuthenticated: true,
          });
        }
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    if (!isSupabaseConfigured || !supabase) {
      // Simulate successful login
      const demoUser: UserProfile = {
        ...INITIAL_DEMO_PROFILE,
        email,
        full_name: email.split('@')[0],
      };
      localStorage.setItem('agrieye_user_profile', JSON.stringify(demoUser));
      set({ user: demoUser, isAuthenticated: true, sessionToken: 'demo-jwt-token', isLoading: false });
      return true;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || 'AgriEye2026!',
      });
      if (error) throw error;
      if (data.session) {
        await get().initializeAuth();
        return true;
      }
    } catch (e: any) {
      alert(e.message || 'Login failed');
      set({ isLoading: false });
      return false;
    }
    return false;
  },

  loginWithGoogle: async () => {
    if (!isSupabaseConfigured || !supabase) {
      // Mock Google sign in
      set({ user: INITIAL_DEMO_PROFILE, isAuthenticated: true });
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/app`,
      },
    });
  },

  signup: async (email, password, fullName) => {
    set({ isLoading: true });
    if (!isSupabaseConfigured || !supabase) {
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        email,
        full_name: fullName,
        plan: 'free',
        role: 'user',
        created_at: new Date().toISOString(),
      };
      localStorage.setItem('agrieye_user_profile', JSON.stringify(newUser));
      set({ user: newUser, isAuthenticated: true, sessionToken: 'demo-jwt-token', isLoading: false });
      return true;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) throw error;
      await get().initializeAuth();
      return true;
    } catch (e: any) {
      alert(e.message || 'Signup failed');
      set({ isLoading: false });
      return false;
    }
  },

  logout: async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('agrieye_user_profile');
    set({ user: null, isAuthenticated: false, sessionToken: null });
  },

  updateProfile: (updates) => {
    if (!get().user) return;
    const updated = { ...get().user!, ...updates };
    localStorage.setItem('agrieye_user_profile', JSON.stringify(updated));
    set({ user: updated });
  },

  setPlan: (plan) => {
    if (!get().user) return;
    const updated: UserProfile = { ...get().user!, plan };
    localStorage.setItem('agrieye_user_profile', JSON.stringify(updated));
    set({ user: updated });
  },
}));
