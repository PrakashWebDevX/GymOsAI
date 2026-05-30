import { achievementRepository, streakRepository } from '../repositories/index.js';

export class AchievementService {
  async getAchievements(userId) {
    return achievementRepository.getUserAchievements(userId);
  }

  async getStreaks(userId) {
    return streakRepository.getUserStreaks(userId);
  }

  async awardAchievement(userId, achievementData) {
    return achievementRepository.create({
      user_id: userId,
      ...achievementData,
      earned_at: new Date().toISOString(),
    });
  }
}

export const achievementService = new AchievementService();
