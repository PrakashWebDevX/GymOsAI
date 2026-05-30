import { workoutService } from '../services/workoutService.js';
import { asyncHandler, successResponse } from '../utils/asyncHandler.js';

export const generateWorkout = asyncHandler(async (req, res) => {
  const plan = await workoutService.generateWorkout(req.user.userId, req.body);
  successResponse(res, plan, 'Workout plan generated', 201);
});

export const getHistory = asyncHandler(async (req, res) => {
  const history = await workoutService.getHistory(req.user.userId, parseInt(req.query.limit, 10) || 20);
  successResponse(res, history, 'Workout history retrieved');
});

export const updateWorkout = asyncHandler(async (req, res) => {
  const plan = await workoutService.updateWorkout(req.user.userId, req.body);
  successResponse(res, plan, 'Workout updated');
});
