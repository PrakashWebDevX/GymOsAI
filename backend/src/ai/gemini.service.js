import { geminiModel, geminiProModel } from '../config/gemini.js';
import { AppError } from '../utils/errors.js';

const parseJsonResponse = (text) => {
  const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!jsonMatch) throw new AppError('Failed to parse AI response');
  return JSON.parse(jsonMatch[0]);
};

export const aiService = {
  async generateWorkout({ goalType, fitnessLevel, durationMinutes, equipment, focusAreas }) {
    const prompt = `You are an expert fitness coach. Generate a workout plan as JSON.
Goal: ${goalType}, Level: ${fitnessLevel}, Duration: ${durationMinutes} minutes
Equipment: ${equipment.join(', ') || 'bodyweight only'}
Focus areas: ${focusAreas.join(', ') || 'full body'}

Return JSON: { "title": string, "description": string, "difficulty": string, "duration_minutes": number, "exercises": [{ "name": string, "sets": number, "reps": string, "rest_seconds": number, "notes": string }] }`;

    const result = await geminiModel.generateContent(prompt);
    return parseJsonResponse(result.response.text());
  },

  async generateNutritionPlan({ goalType, dailyCalories, dietaryRestrictions, mealsPerDay }) {
    const prompt = `You are an expert nutritionist. Generate a meal plan as JSON.
Goal: ${goalType}, Daily calories: ${dailyCalories || 'calculate based on goal'}
Restrictions: ${dietaryRestrictions.join(', ') || 'none'}
Meals per day: ${mealsPerDay}

Return JSON: { "title": string, "description": string, "daily_calories": number, "protein_g": number, "carbs_g": number, "fats_g": number, "meals": [{ "name": string, "time": string, "foods": [{ "item": string, "quantity": string, "calories": number, "protein_g": number, "carbs_g": number, "fats_g": number }] }] }`;

    const result = await geminiModel.generateContent(prompt);
    return parseJsonResponse(result.response.text());
  },

  async analyzeBody({ weightKg, heightCm, bodyFatPercent, age, gender, activityLevel }) {
    const prompt = `Analyze this body composition data and provide fitness insights as JSON.
Weight: ${weightKg}kg, Height: ${heightCm}cm, Body fat: ${bodyFatPercent || 'unknown'}%
Age: ${age || 'unknown'}, Gender: ${gender || 'unknown'}, Activity: ${activityLevel || 'moderate'}

Return JSON: { "bmi": number, "bmi_category": string, "body_fat_category": string, "recommended_calories": number, "recommended_protein_g": number, "insights": [string], "recommendations": [string] }`;

    const result = await geminiProModel.generateContent(prompt);
    return parseJsonResponse(result.response.text());
  },

  async generateFullPlan({ goalType, fitnessLevel, durationWeeks }) {
    const prompt = `Create a comprehensive ${durationWeeks}-week fitness plan as JSON.
Goal: ${goalType}, Level: ${fitnessLevel}

Return JSON: { "title": string, "overview": string, "weeks": [{ "week": number, "focus": string, "workouts": [{ "day": string, "type": string, "exercises": [string] }], "nutrition_tips": [string] }], "milestones": [string] }`;

    const result = await geminiProModel.generateContent(prompt);
    return parseJsonResponse(result.response.text());
  },

  async recommendFoods({ goalType, dietaryRestrictions, calorieTarget }) {
    const prompt = `Recommend foods for fitness goal as JSON.
Goal: ${goalType}, Restrictions: ${dietaryRestrictions.join(', ') || 'none'}, Target: ${calorieTarget || 'auto'} calories

Return JSON: { "recommendations": [{ "category": string, "foods": [{ "name": string, "benefits": string, "serving": string, "calories": number }] }], "tips": [string] }`;

    const result = await geminiModel.generateContent(prompt);
    return parseJsonResponse(result.response.text());
  },

  async supplementAdvice({ goalType, currentSupplements, healthConditions }) {
    const prompt = `Provide supplement advice as JSON. Always include disclaimer about consulting a doctor.
Goal: ${goalType}, Current: ${currentSupplements.join(', ') || 'none'}, Conditions: ${healthConditions.join(', ') || 'none'}

Return JSON: { "recommended": [{ "name": string, "dosage": string, "purpose": string, "timing": string }], "avoid": [string], "interactions": [string], "disclaimer": string }`;

    const result = await geminiModel.generateContent(prompt);
    return parseJsonResponse(result.response.text());
  },
};
