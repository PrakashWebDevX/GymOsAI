import api from './client';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (data) => api.post('/auth/google', data),
  logout: () => api.post('/auth/logout'),
};

export const profileApi = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile/update', data),
  updateSocialLinks: (links) => api.put('/profile/social-links', { links }),
};

export const workoutApi = {
  generate: (data) => api.post('/workout/generate', data, { timeout: 120000 }),
  getHistory: (limit) => api.get('/workout/history', { params: { limit } }),
  update: (data) => api.put('/workout/update', data),
};

export const nutritionApi = {
  generate: (data) => api.post('/nutrition/generate', data, { timeout: 120000 }),
  getHistory: (limit) => api.get('/nutrition/history', { params: { limit } }),
  getMealPlan: () => api.get('/nutrition/meal-plan'),
};

export const aiApi = {
  analyzeBody: (data) => api.post('/ai/analyze-body', data, { timeout: 120000 }),
  generatePlan: (data) => api.post('/ai/generate-plan', data, { timeout: 120000 }),
  recommendFoods: (data) => api.post('/ai/recommend-foods', data, { timeout: 120000 }),
  supplementAdvice: (data) => api.post('/ai/supplement-advice', data, { timeout: 120000 }),
};

export const progressApi = {
  get: () => api.get('/progress'),
  addLog: (data) => api.post('/progress', data),
  addPhoto: (data) => api.post('/progress/photos', data),
  getWeeklyReport: () => api.get('/progress/weekly-report'),
};

export const achievementApi = {
  getAll: () => api.get('/achievements'),
  getStreaks: () => api.get('/streaks'),
};
