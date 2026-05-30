import Joi from 'joi';
import { FITNESS_LEVELS, GOAL_TYPES, SOCIAL_PLATFORMS } from '../constants/index.js';

export const authSchemas = {
  register: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(128).required(),
      fullName: Joi.string().min(2).max(100).required(),
    }),
  }),
  login: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  google: Joi.object({
    body: Joi.object({
      idToken: Joi.string().required(),
    }),
  }),
};

export const profileSchemas = {
  update: Joi.object({
    body: Joi.object({
      fullName: Joi.string().min(2).max(100),
      bio: Joi.string().max(500),
      dateOfBirth: Joi.date().iso(),
      gender: Joi.string().valid('male', 'female', 'other', 'prefer_not_to_say'),
      heightCm: Joi.number().min(50).max(300),
      weightKg: Joi.number().min(20).max(500),
      fitnessLevel: Joi.string().valid(...FITNESS_LEVELS),
      activityLevel: Joi.string().valid('sedentary', 'light', 'moderate', 'active', 'very_active'),
      timezone: Joi.string(),
    }).min(1),
  }),
  socialLinks: Joi.object({
    body: Joi.object({
      links: Joi.array().items(
        Joi.object({
          platform: Joi.string().valid(...SOCIAL_PLATFORMS).required(),
          url: Joi.string().uri().required(),
        })
      ).required(),
    }),
  }),
};

export const workoutSchemas = {
  generate: Joi.object({
    body: Joi.object({
      goalType: Joi.string().valid(...GOAL_TYPES).required(),
      fitnessLevel: Joi.string().valid(...FITNESS_LEVELS).required(),
      durationMinutes: Joi.number().min(15).max(180).default(60),
      equipment: Joi.array().items(Joi.string()).default([]),
      focusAreas: Joi.array().items(Joi.string()).default([]),
    }),
  }),
  update: Joi.object({
    params: Joi.object({ id: Joi.string().uuid().required() }),
    body: Joi.object({
      title: Joi.string(),
      exercises: Joi.array(),
      completed: Joi.boolean(),
      isActive: Joi.boolean(),
    }).min(1),
  }),
};

export const nutritionSchemas = {
  generate: Joi.object({
    body: Joi.object({
      goalType: Joi.string().valid(...GOAL_TYPES).required(),
      dailyCalories: Joi.number().min(1000).max(10000),
      dietaryRestrictions: Joi.array().items(Joi.string()).default([]),
      mealsPerDay: Joi.number().min(3).max(6).default(4),
    }),
  }),
  mealPlan: Joi.object({
    query: Joi.object({
      planId: Joi.string().uuid(),
    }),
  }),
};

export const aiSchemas = {
  analyzeBody: Joi.object({
    body: Joi.object({
      weightKg: Joi.number().required(),
      heightCm: Joi.number().required(),
      bodyFatPercent: Joi.number().min(1).max(60),
      age: Joi.number().min(13).max(120),
      gender: Joi.string().valid('male', 'female', 'other'),
      activityLevel: Joi.string().valid('sedentary', 'light', 'moderate', 'active', 'very_active'),
    }),
  }),
  generatePlan: Joi.object({
    body: Joi.object({
      goalType: Joi.string().valid(...GOAL_TYPES).required(),
      fitnessLevel: Joi.string().valid(...FITNESS_LEVELS).required(),
      durationWeeks: Joi.number().min(1).max(52).default(4),
    }),
  }),
  recommendFoods: Joi.object({
    body: Joi.object({
      goalType: Joi.string().valid(...GOAL_TYPES).required(),
      dietaryRestrictions: Joi.array().items(Joi.string()).default([]),
      calorieTarget: Joi.number().min(1000).max(10000),
    }),
  }),
  supplementAdvice: Joi.object({
    body: Joi.object({
      goalType: Joi.string().valid(...GOAL_TYPES).required(),
      currentSupplements: Joi.array().items(Joi.string()).default([]),
      healthConditions: Joi.array().items(Joi.string()).default([]),
    }),
  }),
};

export const progressSchemas = {
  create: Joi.object({
    body: Joi.object({
      logType: Joi.string().valid('weight', 'workout', 'nutrition', 'measurement', 'mood', 'energy').required(),
      value: Joi.number(),
      unit: Joi.string(),
      notes: Joi.string().max(1000),
      metadata: Joi.object(),
    }),
  }),
  photo: Joi.object({
    body: Joi.object({
      photoUrl: Joi.string().uri().required(),
      photoType: Joi.string().valid('front', 'back', 'side', 'other').default('front'),
      notes: Joi.string().max(500),
    }),
  }),
};
