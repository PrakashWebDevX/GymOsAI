import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';
import { AppError } from '../utils/errors.js';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const parseJsonResponse = (text) => {
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } catch {
      return { raw: text };
    }
  }
  return { raw: text };
};

export const generateWorkoutPlan = async (params) => {
  const { goal, duration, equipment, experienceLevel, focusAreas, userProfile } = params;

  const prompt = `You are an expert fitness coach. Generate a detailed workout plan as JSON.

User Profile: ${JSON.stringify(userProfile || {})}
Goal: ${goal}
Duration: ${duration} minutes
Equipment: ${equipment.join(', ') || 'bodyweight only'}
Experience: ${experienceLevel}
Focus Areas: ${focusAreas.join(', ') || 'full body'}

Return JSON with this structure:
{
  "title": "string",
  "description": "string",
  "warmup": [{"name": "string", "duration": "string", "instructions": "string"}],
  "exercises": [{"name": "string", "sets": number, "reps": "string", "rest": "string", "instructions": "string", "muscleGroup": "string"}],
  "cooldown": [{"name": "string", "duration": "string", "instructions": "string"}],
  "estimatedCalories": number,
  "difficulty": "string"
}`;

  const result = await model.generateContent(prompt);
  return parseJsonResponse(result.response.text());
};

export const generateNutritionPlan = async (params) => {
  const { calories, dietType, mealsPerDay, allergies, preferences, userProfile } = params;

  const prompt = `You are an expert nutritionist. Generate a daily meal plan as JSON.

User Profile: ${JSON.stringify(userProfile || {})}
Target Calories: ${calories || 'calculate based on profile'}
Diet Type: ${dietType}
Meals Per Day: ${mealsPerDay}
Allergies: ${allergies.join(', ') || 'none'}
Preferences: ${preferences.join(', ') || 'none'}

Return JSON with this structure:
{
  "title": "string",
  "totalCalories": number,
  "macros": {"protein": number, "carbs": number, "fat": number},
  "meals": [{"type": "breakfast|lunch|dinner|snack", "name": "string", "calories": number, "protein": number, "carbs": number, "fat": number, "ingredients": ["string"], "instructions": "string"}],
  "tips": ["string"]
}`;

  const result = await model.generateContent(prompt);
  return parseJsonResponse(result.response.text());
};

export const analyzeBodyMetrics = async (params) => {
  const prompt = `You are a fitness and health analyst. Analyze these body metrics and provide recommendations as JSON.

Metrics: ${JSON.stringify(params)}

Return JSON with:
{
  "bmi": number,
  "bmiCategory": "string",
  "bmr": number,
  "tdee": number,
  "recommendedCalories": number,
  "bodyComposition": {"assessment": "string", "recommendations": ["string"]},
  "healthInsights": ["string"],
  "targetWeight": {"min": number, "max": number, "ideal": number}
}`;

  const result = await model.generateContent(prompt);
  return parseJsonResponse(result.response.text());
};

export const generateComprehensivePlan = async (params) => {
  const prompt = `You are an elite fitness coach and nutritionist. Create a comprehensive fitness plan as JSON.

Parameters: ${JSON.stringify(params)}

Return JSON with:
{
  "overview": "string",
  "durationWeeks": number,
  "weeklySchedule": [{"week": number, "workoutDays": number, "focus": "string", "workouts": [{"day": "string", "type": "string", "description": "string"}]}],
  "nutritionGuidelines": {"dailyCalories": number, "macros": {}, "mealTiming": ["string"], "hydration": "string"},
  "milestones": [{"week": number, "goal": "string", "metrics": {}}],
  "tips": ["string"]
}`;

  const result = await model.generateContent(prompt);
  return parseJsonResponse(result.response.text());
};

export const recommendFoods = async (params) => {
  const prompt = `Recommend foods for fitness goals as JSON.

Parameters: ${JSON.stringify(params)}

Return JSON with:
{
  "recommendations": [{"name": "string", "category": "string", "benefits": ["string"], "servingSize": "string", "calories": number, "protein": number}],
  "mealSuggestions": [{"name": "string", "ingredients": ["string"], "prepTime": "string"}],
  "foodsToAvoid": ["string"],
  "tips": ["string"]
}`;

  const result = await model.generateContent(prompt);
  return parseJsonResponse(result.response.text());
};

export const getSupplementAdvice = async (params) => {
  const prompt = `Provide evidence-based supplement advice as JSON. Always include disclaimer about consulting healthcare providers.

Parameters: ${JSON.stringify(params)}

Return JSON with:
{
  "recommended": [{"name": "string", "dosage": "string", "timing": "string", "benefits": ["string"], "evidence": "string"}],
  "optional": [{"name": "string", "dosage": "string", "benefits": ["string"]}],
  "avoid": [{"name": "string", "reason": "string"}],
  "interactions": ["string"],
  "disclaimer": "string"
}`;

  const result = await model.generateContent(prompt);
  return parseJsonResponse(result.response.text());
};

export const generateWeeklyReport = async (userData) => {
  const prompt = `Generate a weekly fitness progress report as JSON based on this user data.

Data: ${JSON.stringify(userData)}

Return JSON with:
{
  "summary": "string",
  "highlights": ["string"],
  "areasForImprovement": ["string"],
  "workoutStats": {"completed": number, "total": number, "streakDays": number},
  "nutritionStats": {"avgCalories": number, "proteinAvg": number},
  "recommendations": ["string"],
  "nextWeekGoals": ["string"]
}`;

  const result = await model.generateContent(prompt);
  return parseJsonResponse(result.response.text());
};

export default {
  generateWorkoutPlan,
  generateNutritionPlan,
  analyzeBodyMetrics,
  generateComprehensivePlan,
  recommendFoods,
  getSupplementAdvice,
  generateWeeklyReport,
};
