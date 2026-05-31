import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';
import { AppError } from '../utils/errors.js';

const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
].filter(Boolean);

const getGenAI = () => {
  if (!config.gemini.apiKey) {
    throw new AppError(
      'Gemini API key is missing. Set GEMINI_API_KEY in backend environment variables.',
      503
    );
  }
  return new GoogleGenerativeAI(config.gemini.apiKey);
};

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

const generateContent = async (prompt) => {
  const genAI = getGenAI();
  let lastError;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text) throw new Error('Empty response from AI model');
      return parseJsonResponse(text);
    } catch (err) {
      lastError = err;
      const message = err.message?.toLowerCase() || '';
      const retryable =
        message.includes('not found') ||
        message.includes('404') ||
        message.includes('model') ||
        message.includes('unsupported');

      if (retryable && MODEL_CANDIDATES.indexOf(modelName) < MODEL_CANDIDATES.length - 1) {
        continue;
      }
      break;
    }
  }

  throw new AppError(
    `AI generation failed: ${lastError?.message || 'Unknown error'}. Check GEMINI_API_KEY on Render.`,
    502
  );
};

export const generateWorkoutPlan = async (params) => {
  const { goal, duration, equipment = [], experienceLevel, focusAreas = [], userProfile } = params;

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

  return generateContent(prompt);
};

export const generateNutritionPlan = async (params) => {
  const { calories, dietType, mealsPerDay, allergies = [], preferences = [], userProfile } = params;

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

  return generateContent(prompt);
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

  return generateContent(prompt);
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

  return generateContent(prompt);
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

  return generateContent(prompt);
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

  return generateContent(prompt);
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

  return generateContent(prompt);
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
