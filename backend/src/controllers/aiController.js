import { aiService } from '../services/aiService.js';
import { asyncHandler, successResponse } from '../utils/asyncHandler.js';

export const analyzeBody = asyncHandler(async (req, res) => {
  const analysis = await aiService.analyzeBody(req.user.userId, req.body);
  successResponse(res, analysis, 'Body analysis complete');
});

export const generatePlan = asyncHandler(async (req, res) => {
  const plan = await aiService.generatePlan(req.user.userId, req.body);
  successResponse(res, plan, 'Comprehensive plan generated');
});

export const recommendFoods = asyncHandler(async (req, res) => {
  const recommendations = await aiService.recommendFoods(req.user.userId, req.body);
  successResponse(res, recommendations, 'Food recommendations generated');
});

export const supplementAdvice = asyncHandler(async (req, res) => {
  const advice = await aiService.supplementAdvice(req.user.userId, req.body);
  successResponse(res, advice, 'Supplement advice generated');
});
