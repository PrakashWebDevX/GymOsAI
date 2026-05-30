import { create } from 'zustand';
import { progressApi } from '../api';

export const useProgressStore = create((set) => ({
  logs: [],
  photos: [],
  weeklyReport: null,
  isLoading: false,
  error: null,

  fetchProgress: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await progressApi.get();
      set({
        logs: response.data.logs || [],
        photos: response.data.photos || [],
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addLog: async (data) => {
    try {
      const response = await progressApi.addLog(data);
      set((state) => ({ logs: [response.data, ...state.logs] }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  addPhoto: async (data) => {
    try {
      const response = await progressApi.addPhoto(data);
      set((state) => ({ photos: [response.data, ...state.photos] }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  fetchWeeklyReport: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await progressApi.getWeeklyReport();
      set({ weeklyReport: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearProgress: () => set({ logs: [], photos: [], weeklyReport: null }),
}));

export default useProgressStore;
