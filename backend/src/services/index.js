import { aiService } from '../ai/gemini.service.js';
import {
  workoutRepo,
  nutritionRepo,
  progressRepo,
  progressPhotosRepo,
  achievementRepo,
  streakRepo,
  socialLinksRepo,
  notificationRepo,
} from '../repositories/index.js';
import { paginate } from '../utils/helpers.js';

export const workoutService = {
  async generate(userId, params) {
    const plan = await aiService.generateWorkout(params);
    const saved = await workoutRepo.create({
      user_id: userId,
      title: plan.title,
      description: plan.description,
      difficulty: plan.difficulty || params.fitnessLevel,
      duration_minutes: plan.duration_minutes || params.durationMinutes,
      exercises: plan.exercises,
      ai_generated: true,
      is_active: true,
    });
    await streakRepo.updateStreak(userId);
    return saved;
  },

  async getHistory(userId, query) {
    const { page, limit, offset } = paginate(query);
    const data = await workoutRepo.findByUserId(userId, {
      orderBy: 'created_at',
      limit,
      offset,
    });
    return { data, page, limit };
  },

  async update(userId, id, updates) {
    const workout = await workoutRepo.findById(id);
    if (workout.user_id !== userId) throw new Error('Forbidden');
    const mapped = {
      title: updates.title,
      exercises: updates.exercises,
      completed: updates.completed,
      is_active: updates.isActive,
    };
    const cleaned = Object.fromEntries(
      Object.entries(mapped).filter(([, v]) => v !== undefined)
    );
    if (updates.completed) await streakRepo.updateStreak(userId);
    return workoutRepo.update(id, cleaned);
  },
};

export const nutritionService = {
  async generate(userId, params) {
    const plan = await aiService.generateNutritionPlan(params);
    const saved = await nutritionRepo.create({
      user_id: userId,
      title: plan.title,
      description: plan.description,
      daily_calories: plan.daily_calories,
      protein_g: plan.protein_g,
      carbs_g: plan.carbs_g,
      fats_g: plan.fats_g,
      meals: plan.meals,
      ai_generated: true,
      is_active: true,
      start_date: new Date().toISOString().split('T')[0],
    });
    return saved;
  },

  async getHistory(userId, query) {
    const { page, limit, offset } = paginate(query);
    const data = await nutritionRepo.findByUserId(userId, {
      orderBy: 'created_at',
      limit,
      offset,
    });
    return { data, page, limit };
  },

  async getMealPlan(userId, planId) {
    if (planId) return nutritionRepo.findById(planId);
    const plans = await nutritionRepo.findByUserId(userId, {
      orderBy: 'created_at',
      limit: 1,
    });
    return plans[0] || null;
  },
};

export const progressService = {
  async getProgress(userId, query) {
    const { page, limit, offset } = paginate(query);
    const data = await progressRepo.findByUserId(userId, {
      orderBy: 'logged_at',
      limit,
      offset,
    });
    return { data, page, limit };
  },

  async createLog(userId, logData) {
    return progressRepo.create({
      user_id: userId,
      log_type: logData.logType,
      value: logData.value,
      unit: logData.unit,
      notes: logData.notes,
      metadata: logData.metadata || {},
    });
  },

  async addPhoto(userId, photoData) {
    return progressPhotosRepo.create({
      user_id: userId,
      photo_url: photoData.photoUrl,
      photo_type: photoData.photoType,
      notes: photoData.notes,
    });
  },

  async getPhotos(userId) {
    return progressPhotosRepo.findByUserId(userId, { orderBy: 'taken_at' });
  },

  async getWeeklyReport(userId) {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const logs = await progressRepo.findByUserId(userId, { orderBy: 'logged_at', limit: 100 });
    const weekLogs = logs.filter((l) => l.logged_at >= weekAgo);
    const workouts = await workoutRepo.findByUserId(userId, { limit: 50 });
    const weekWorkouts = workouts.filter((w) => w.created_at >= weekAgo);

    return {
      period: 'weekly',
      totalLogs: weekLogs.length,
      workoutsCompleted: weekWorkouts.filter((w) => w.completed).length,
      logs: weekLogs,
      summary: {
        weightChange: weekLogs.filter((l) => l.log_type === 'weight').length,
        avgMood: weekLogs.filter((l) => l.log_type === 'mood').length
          ? weekLogs.filter((l) => l.log_type === 'mood').reduce((s, l) => s + l.value, 0) /
            weekLogs.filter((l) => l.log_type === 'mood').length
          : null,
      },
    };
  },
};

export const achievementService = {
  async getAchievements(userId) {
    return achievementRepo.findByUserId(userId, { orderBy: 'earned_at' });
  },

  async getStreaks(userId) {
    return streakRepo.findByUserId(userId);
  },
};

export const socialLinksService = {
  async updateLinks(userId, links) {
    await socialLinksRepo.db.from('social_links').delete().eq('user_id', userId);
    const records = links.map((l) => ({
      user_id: userId,
      platform: l.platform,
      url: l.url,
    }));
    const { data, error } = await socialLinksRepo.db
      .from('social_links')
      .insert(records)
      .select();
    if (error) throw error;
    return data;
  },

  async getLinks(userId) {
    return socialLinksRepo.findByUserId(userId);
  },
};

export const aiControllerService = {
  analyzeBody: (params) => aiService.analyzeBody(params),
  generatePlan: (params) => aiService.generateFullPlan(params),
  recommendFoods: (params) => aiService.recommendFoods(params),
  supplementAdvice: (params) => aiService.supplementAdvice(params),
};

export const notificationService = {
  async create(userId, { title, message, type, actionUrl }) {
    return notificationRepo.create({
      user_id: userId,
      title,
      message,
      type: type || 'info',
      action_url: actionUrl,
    });
  },
};
