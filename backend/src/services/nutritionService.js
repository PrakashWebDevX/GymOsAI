import { nutritionRepository, profileRepository, streakRepository } from '../repositories/index.js';
import { generateNutritionPlan } from '../ai/geminiService.js';

export class NutritionService {
  async generatePlan(userId, params) {
    const profile = await profileRepository.findByUserId(userId);

    const aiPlan = await generateNutritionPlan({
      ...params,
      userProfile: profile,
    });

    await nutritionRepository.findByUserId(userId).then(async (plans) => {
      if (plans?.length) {
        for (const plan of plans.filter((p) => p.is_active)) {
          await nutritionRepository.update(plan.id, { is_active: false });
        }
      }
    });

    const plan = await nutritionRepository.create({
      user_id: userId,
      title: aiPlan.title || 'Daily Meal Plan',
      diet_type: params.dietType,
      target_calories: aiPlan.totalCalories,
      plan_data: aiPlan,
      is_active: true,
    });

    await streakRepository.updateStreak(userId, 'nutrition');

    return plan;
  }

  async getHistory(userId, limit) {
    return nutritionRepository.getHistory(userId, limit);
  }

  async getMealPlan(userId) {
    return nutritionRepository.getActiveMealPlan(userId);
  }
}

export const nutritionService = new NutritionService();
