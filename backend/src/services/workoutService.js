import { workoutRepository, profileRepository, streakRepository } from '../repositories/index.js';
import { generateWorkoutPlan } from '../ai/geminiService.js';
import { NotFoundError, AppError } from '../utils/errors.js';

export class WorkoutService {
  async generateWorkout(userId, params) {
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    let profile = null;
    try {
      profile = await profileRepository.findByUserId(userId);
    } catch {
      profile = null;
    }

    const aiPlan = await generateWorkoutPlan({
      ...params,
      userProfile: profile,
    });

    let plan;
    try {
      plan = await workoutRepository.create({
        user_id: userId,
        title: aiPlan.title || `${params.goal} Workout`,
        description: aiPlan.description || '',
        workout_type: params.goal,
        duration_minutes: params.duration,
        plan_data: aiPlan,
        is_active: true,
      });
    } catch (err) {
      throw new AppError(
        `Failed to save workout: ${err.message}. Ensure database schema is applied in Supabase.`,
        500
      );
    }

    try {
      await streakRepository.updateStreak(userId, 'workout');
    } catch {
      // Non-critical — workout was saved
    }

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
