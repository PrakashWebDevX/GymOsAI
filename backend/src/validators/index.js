import Joi from 'joi';
import { ValidationError } from '../utils/errors.js';

export const validate = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message,
    }));
    throw new ValidationError('Validation failed', details);
  }

  req.body = value;
  next();
};

export const authSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    fullName: Joi.string().min(2).max(100).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  google: Joi.object({
    accessToken: Joi.string().required(),
  }),
};

export const profileSchemas = {
  update: Joi.object({
    fullName: Joi.string().min(2).max(100),
    bio: Joi.string().max(500).allow(''),
    dateOfBirth: Joi.date().iso(),
    gender: Joi.string().valid('male', 'female', 'other', 'prefer_not_to_say'),
    heightCm: Joi.number().min(50).max(300),
    weightKg: Joi.number().min(20).max(500),
    activityLevel: Joi.string().valid('sedentary', 'light', 'moderate', 'active', 'very_active'),
    fitnessGoal: Joi.string().valid('weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness'),
    avatarUrl: Joi.string().uri().allow(''),
  }),
  socialLinks: Joi.object({
    links: Joi.array().items(
      Joi.object({
        platform: Joi.string().required(),
        url: Joi.string().uri().required(),
      })
    ).max(10),
  }),
};

export const workoutSchemas = {
  generate: Joi.object({
    goal: Joi.string().valid('strength', 'cardio', 'hiit', 'flexibility', 'mixed').required(),
    duration: Joi.number().min(15).max(120).default(45),
    equipment: Joi.array().items(Joi.string()).default([]),
    experienceLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').default('intermediate'),
    focusAreas: Joi.array().items(Joi.string()).default([]),
  }),
  update: Joi.object({
    planId: Joi.string().uuid().required(),
    completed: Joi.boolean(),
    exercises: Joi.array(),
    notes: Joi.string().max(1000).allow(''),
  }),
};

export const nutritionSchemas = {
  generate: Joi.object({
    calories: Joi.number().min(800).max(10000),
    dietType: Joi.string().valid('balanced', 'keto', 'vegan', 'vegetarian', 'paleo', 'mediterranean').default('balanced'),
    mealsPerDay: Joi.number().min(2).max(6).default(3),
    allergies: Joi.array().items(Joi.string()).default([]),
    preferences: Joi.array().items(Joi.string()).default([]),
  }),
};

export const aiSchemas = {
  analyzeBody: Joi.object({
    heightCm: Joi.number().min(50).max(300).required(),
    weightKg: Joi.number().min(20).max(500).required(),
    age: Joi.number().min(13).max(120).required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    activityLevel: Joi.string().valid('sedentary', 'light', 'moderate', 'active', 'very_active').required(),
  }),
  generatePlan: Joi.object({
    goal: Joi.string().required(),
    durationWeeks: Joi.number().min(1).max(52).default(12),
    includeNutrition: Joi.boolean().default(true),
    includeWorkout: Joi.boolean().default(true),
  }),
  recommendFoods: Joi.object({
    goal: Joi.string().required(),
    dietaryRestrictions: Joi.array().items(Joi.string()).default([]),
    mealType: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack'),
  }),
  supplementAdvice: Joi.object({
    goal: Joi.string().required(),
    currentSupplements: Joi.array().items(Joi.string()).default([]),
    healthConditions: Joi.array().items(Joi.string()).default([]),
  }),
};

export const progressSchemas = {
  log: Joi.object({
    weightKg: Joi.number().min(20).max(500),
    bodyFatPercent: Joi.number().min(1).max(60),
    muscleMassKg: Joi.number().min(10).max(200),
    notes: Joi.string().max(1000).allow(''),
    measurements: Joi.object({
      chest: Joi.number(),
      waist: Joi.number(),
      hips: Joi.number(),
      arms: Joi.number(),
      thighs: Joi.number(),
    }),
  }),
};
