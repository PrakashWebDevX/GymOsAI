import {
  analyzeBodyMetrics,
  generateComprehensivePlan,
  recommendFoods,
  getSupplementAdvice,
  generateWeeklyReport,
} from '../ai/geminiService.js';
import { profileRepository, progressRepository, workoutRepository, nutritionRepository } from '../repositories/index.js';
import supabase from '../config/supabase.js';

export class AIService {
  async analyzeBody(userId, metrics) {
    const analysis = await analyzeBodyMetrics(metrics);

    await supabase.from('body_metrics').insert({
      user_id: userId,
      ...metrics,
      bmi: analysis.bmi,
      bmr: analysis.bmr,
      tdee: analysis.tdee,
      analysis_data: analysis,
    });

    return analysis;
  }

  async generatePlan(userId, params) {
    const profile = await profileRepository.findByUserId(userId);
    return generateComprehensivePlan({ ...params, userProfile: profile });
  }

  async recommendFoods(userId, params) {
    const profile = await profileRepository.findByUserId(userId);
    return recommendFoods({ ...params, userProfile: profile });
  }

  async supplementAdvice(userId, params) {
    const profile = await profileRepository.findByUserId(userId);
    const advice = await getSupplementAdvice({ ...params, userProfile: profile });

    await supabase.from('supplements').insert({
      user_id: userId,
      recommendations: advice,
      goal: params.goal,
    });

    return advice;
  }

  async weeklyReport(userId) {
    const [profile, progress, workouts, nutrition] = await Promise.all([
      profileRepository.findByUserId(userId),
      progressRepository.getLogs(userId, 7),
      workoutRepository.getHistory(userId, 7),
      nutritionRepository.getHistory(userId, 7),
    ]);

    return generateWeeklyReport({ profile, progress, workouts, nutrition });
  }
}

export const aiService = new AIService();
