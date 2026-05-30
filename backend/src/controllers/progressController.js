import { progressService } from '../services/progressService.js';
import { asyncHandler, successResponse } from '../utils/asyncHandler.js';

export const getProgress = asyncHandler(async (req, res) => {
  const progress = await progressService.getProgress(req.user.userId);
  successResponse(res, progress, 'Progress retrieved');
});

export const addLog = asyncHandler(async (req, res) => {
  const log = await progressService.addLog(req.user.userId, req.body);
  successResponse(res, log, 'Progress logged', 201);
});

export const addPhoto = asyncHandler(async (req, res) => {
  const photo = await progressService.addPhoto(req.user.userId, req.body);
  successResponse(res, photo, 'Photo uploaded', 201);
});

export const getWeeklyReport = asyncHandler(async (req, res) => {
  const report = await progressService.getWeeklyReport(req.user.userId);
  successResponse(res, report, 'Weekly report generated');
});
