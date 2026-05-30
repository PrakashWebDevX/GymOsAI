import { create } from 'zustand';
import { nutritionApi } from '../api';

export const useNutritionStore = create((set) => ({
  currentPlan: null,
  mealPlan: null,
  history: [],
  isLoading: false,
  error: null,

  generatePlan: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await nutritionApi.generate(params);
      set({ currentPlan: response.data, mealPlan: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchMealPlan: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await nutritionApi.getMealPlan();
      set({ mealPlan: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchHistory: async (limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await nutritionApi.getHistory(limit);
      set({ history: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearNutrition: () => set({ currentPlan: null, mealPlan: null, history: [] }),
}));

export default useNutritionStore;
