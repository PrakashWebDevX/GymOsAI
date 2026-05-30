import { achievementService } from '../services/achievementService.js';
import { asyncHandler, successResponse } from '../utils/asyncHandler.js';

export const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await achievementService.getAchievements(req.user.userId);
  successResponse(res, achievements, 'Achievements retrieved');
});

export const getStreaks = asyncHandler(async (req, res) => {
  const streaks = await achievementService.getStreaks(req.user.userId);
  successResponse(res, streaks, 'Streaks retrieved');
});
