import { create } from 'zustand';
import { profileApi } from '../api';

export const useUserStore = create((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await profileApi.get();
      set({ profile: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await profileApi.update(data);
      set({ profile: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateSocialLinks: async (links) => {
    try {
      const response = await profileApi.updateSocialLinks(links);
      set((state) => ({
        profile: { ...state.profile, social_links: response.data },
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  clearProfile: () => set({ profile: null }),
}));

export default useUserStore;
