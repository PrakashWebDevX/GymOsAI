import { HTTP_STATUS } from '../constants/index.js';
import { authService, profileService } from '../services/auth.service.js';
import {
  workoutService,
  nutritionService,
  progressService,
  achievementService,
  socialLinksService,
  aiControllerService,
} from '../services/index.js';

const sendSuccess = (res, data, status = HTTP_STATUS.OK) =>
  res.status(status).json({ success: true, data });

export const authController = {
  register: async (req, res) => {
    const result = await authService.register(req.body);
    sendSuccess(res, result, HTTP_STATUS.CREATED);
  },
  login: async (req, res) => {
    const result = await authService.login(req.body);
    sendSuccess(res, result);
  },
  google: async (req, res) => {
    const result = await authService.googleLogin(req.body);
    sendSuccess(res, result);
  },
  logout: async (req, res) => {
    const result = await authService.logout(req.user.id);
    sendSuccess(res, result);
  },
};

export const profileController = {
  get: async (req, res) => {
    const profile = await profileService.getProfile(req.user.id);
    sendSuccess(res, profile);
  },
  update: async (req, res) => {
    const profile = await profileService.updateProfile(req.user.id, req.body);
    sendSuccess(res, profile);
  },
  updateSocialLinks: async (req, res) => {
    const links = await socialLinksService.updateLinks(req.user.id, req.body.links);
    sendSuccess(res, links);
  },
};

export const workoutController = {
  generate: async (req, res) => {
    const plan = await workoutService.generate(req.user.id, req.body);
    sendSuccess(res, plan, HTTP_STATUS.CREATED);
  },
  history: async (req, res) => {
    const result = await workoutService.getHistory(req.user.id, req.query);
    sendSuccess(res, result);
  },
  update: async (req, res) => {
    const plan = await workoutService.update(req.user.id, req.params.id, req.body);
    sendSuccess(res, plan);
  },
};

export const nutritionController = {
  generate: async (req, res) => {
    const plan = await nutritionService.generate(req.user.id, req.body);
    sendSuccess(res, plan, HTTP_STATUS.CREATED);
  },
  history: async (req, res) => {
    const result = await nutritionService.getHistory(req.user.id, req.query);
    sendSuccess(res, result);
  },
  mealPlan: async (req, res) => {
    const plan = await nutritionService.getMealPlan(req.user.id, req.query.planId);
    sendSuccess(res, plan);
  },
};

export const aiController = {
  analyzeBody: async (req, res) => {
    const analysis = await aiControllerService.analyzeBody(req.body);
    sendSuccess(res, analysis);
  },
  generatePlan: async (req, res) => {
    const plan = await aiControllerService.generatePlan(req.body);
    sendSuccess(res, plan);
  },
  recommendFoods: async (req, res) => {
    const foods = await aiControllerService.recommendFoods(req.body);
    sendSuccess(res, foods);
  },
  supplementAdvice: async (req, res) => {
    const advice = await aiControllerService.supplementAdvice(req.body);
    sendSuccess(res, advice);
  },
};

export const progressController = {
  get: async (req, res) => {
    const result = await progressService.getProgress(req.user.id, req.query);
    sendSuccess(res, result);
  },
  create: async (req, res) => {
    const log = await progressService.createLog(req.user.id, req.body);
    sendSuccess(res, log, HTTP_STATUS.CREATED);
  },
  photos: async (req, res) => {
    if (req.method === 'GET') {
      const photos = await progressService.getPhotos(req.user.id);
      return sendSuccess(res, photos);
    }
    const photo = await progressService.addPhoto(req.user.id, req.body);
    sendSuccess(res, photo, HTTP_STATUS.CREATED);
  },
  weeklyReport: async (req, res) => {
    const report = await progressService.getWeeklyReport(req.user.id);
    sendSuccess(res, report);
  },
};

export const achievementController = {
  getAll: async (req, res) => {
    const achievements = await achievementService.getAchievements(req.user.id);
    sendSuccess(res, achievements);
  },
  getStreaks: async (req, res) => {
    const streaks = await achievementService.getStreaks(req.user.id);
    sendSuccess(res, streaks);
  },
};
