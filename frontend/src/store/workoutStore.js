import { create } from 'zustand';
import { workoutApi } from '../api';

export const useWorkoutStore = create((set) => ({
  currentPlan: null,
  history: [],
  isLoading: false,
  error: null,

  generateWorkout: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workoutApi.generate(params);
      set({ currentPlan: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchHistory: async (limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workoutApi.getHistory(limit);
      set({ history: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateWorkout: async (data) => {
    try {
      const response = await workoutApi.update(data);
      set((state) => ({
        currentPlan: state.currentPlan?.id === data.planId ? response.data : state.currentPlan,
        history: state.history.map((w) => (w.id === data.planId ? response.data : w)),
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  clearWorkout: () => set({ currentPlan: null, history: [] }),
}));

export default useWorkoutStore;
