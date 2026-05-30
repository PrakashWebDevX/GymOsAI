import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          const { user, token } = response.data;
          localStorage.setItem('gymos_token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
          return response;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(data);
          const { user, token } = response.data;
          localStorage.setItem('gymos_token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
          return response;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      googleLogin: async (accessToken) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.googleLogin({ accessToken });
          const { user, token } = response.data;
          localStorage.setItem('gymos_token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
          return response;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // Continue logout even if API fails
        }
        localStorage.removeItem('gymos_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'gymos-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
