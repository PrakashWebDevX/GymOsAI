export const APP_NAME = import.meta.env.VITE_APP_NAME || 'GYMOS AI';
export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  AUTH_CALLBACK: '/auth/callback',
  DASHBOARD: '/dashboard',
  WORKOUT: '/workout',
  NUTRITION: '/nutrition',
  PROGRESS: '/progress',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ACHIEVEMENTS: '/achievements',
};

export const FITNESS_GOALS = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'general_fitness', label: 'General Fitness' },
];

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'light', label: 'Lightly Active' },
  { value: 'moderate', label: 'Moderately Active' },
  { value: 'active', label: 'Active' },
  { value: 'very_active', label: 'Very Active' },
];

export const WORKOUT_TYPES = [
  { value: 'strength', label: 'Strength Training' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'hiit', label: 'HIIT' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'mixed', label: 'Mixed' },
];

export const DIET_TYPES = [
  { value: 'balanced', label: 'Balanced' },
  { value: 'keto', label: 'Keto' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'mediterranean', label: 'Mediterranean' },
];

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/workout', label: 'Workout', icon: 'workout' },
  { path: '/nutrition', label: 'Nutrition', icon: 'nutrition' },
  { path: '/progress', label: 'Progress', icon: 'progress' },
  { path: '/achievements', label: 'Achievements', icon: 'achievements' },
  { path: '/profile', label: 'Profile', icon: 'profile' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
];
