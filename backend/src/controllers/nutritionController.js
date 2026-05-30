import { nutritionService } from '../services/nutritionService.js';
import { asyncHandler, successResponse } from '../utils/asyncHandler.js';

export const generatePlan = asyncHandler(async (req, res) => {
  const plan = await nutritionService.generatePlan(req.user.userId, req.body);
  successResponse(res, plan, 'Nutrition plan generated', 201);
});

export const getHistory = asyncHandler(async (req, res) => {
  const history = await nutritionService.getHistory(req.user.userId, parseInt(req.query.limit, 10) || 20);
  successResponse(res, history, 'Nutrition history retrieved');
});

export const getMealPlan = asyncHandler(async (req, res) => {
  const plan = await nutritionService.getMealPlan(req.user.userId);
  successResponse(res, plan, 'Active meal plan retrieved');
});
