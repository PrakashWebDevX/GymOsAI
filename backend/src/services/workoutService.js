import { workoutRepository, profileRepository, streakRepository } from '../repositories/index.js';
import { generateWorkoutPlan } from '../ai/geminiService.js';
import { NotFoundError } from '../utils/errors.js';

export class WorkoutService {
  async generateWorkout(userId, params) {
    const profile = await profileRepository.findByUserId(userId);

    const aiPlan = await generateWorkoutPlan({
      ...params,
      userProfile: profile,
    });

    const plan = await workoutRepository.create({
      user_id: userId,
      title: aiPlan.title || `${params.goal} Workout`,
      description: aiPlan.description,
      workout_type: params.goal,
      duration_minutes: params.duration,
      plan_data: aiPlan,
      is_active: true,
    });

    await streakRepository.updateStreak(userId, 'workout');

    return plan;
  }

  async getHistory(userId, limit) {
    return workoutRepository.getHistory(userId, limit);
  }

  async updateWorkout(userId, { planId, completed, exercises, notes }) {
    const plan = await workoutRepository.findById(planId);
    if (plan.user_id !== userId) throw new NotFoundError('Workout plan not found');

    const updates = {};
    if (completed !== undefined) {
      updates.is_completed = completed;
      updates.completed_at = completed ? new Date().toISOString() : null;
    }
    if (exercises) updates.plan_data = { ...plan.plan_data, exercises };
    if (notes) updates.notes = notes;

    return workoutRepository.update(planId, updates);
  }
}

export const workoutService = new WorkoutService();
