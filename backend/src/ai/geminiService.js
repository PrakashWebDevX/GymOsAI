import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';
import {
  generateLocalWorkoutPlan,
  generateLocalNutritionPlan,
  generateLocalBodyAnalysis,
} from './localAiService.js';

const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
].filter(Boolean);

const hasGeminiKey = () => Boolean(config.gemini.apiKey && config.gemini.apiKey !== 'your-gemini-api-key');

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

const tryGemini = async (prompt) => {
  if (!hasGeminiKey()) return null;

  const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
  let lastError;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text) throw new Error('Empty AI response');
      return parseJsonResponse(text);
    } catch (err) {
      lastError = err;
      const message = err.message?.toLowerCase() || '';
      if (
        (message.includes('not found') || message.includes('404') || message.includes('model')) &&
        MODEL_CANDIDATES.indexOf(modelName) < MODEL_CANDIDATES.length - 1
      ) {
        continue;
      }
      break;
    }
  }

  console.warn('Gemini unavailable, using free built-in AI:', lastError?.message);
  return null;
};

export const generateWorkoutPlan = async (params) => {
  const { goal, duration, equipment = [], experienceLevel, focusAreas = [], userProfile } = params;

  const prompt = `You are an expert fitness coach. Generate a detailed workout plan as JSON.
User Profile: ${JSON.stringify(userProfile || {})}
Goal: ${goal}, Duration: ${duration} min, Equipment: ${equipment.join(', ') || 'bodyweight'}
Experience: ${experienceLevel}, Focus: ${focusAreas.join(', ') || 'full body'}
Return JSON: {"title":"","description":"","warmup":[],"exercises":[],"cooldown":[],"estimatedCalories":0,"difficulty":""}`;

  const geminiResult = await tryGemini(prompt);
  if (geminiResult && !geminiResult.raw) return geminiResult;

  return generateLocalWorkoutPlan(params);
};

export const generateNutritionPlan = async (params) => {
  const { calories, dietType, mealsPerDay, allergies = [], preferences = [], userProfile } = params;

  const prompt = `Generate a daily meal plan as JSON.
Profile: ${JSON.stringify(userProfile || {})}, Calories: ${calories}, Diet: ${dietType}
Meals/day: ${mealsPerDay}, Allergies: ${allergies.join(', ') || 'none'}
Return JSON: {"title":"","totalCalories":0,"macros":{},"meals":[],"tips":[]}`;

  const geminiResult = await tryGemini(prompt);
  if (geminiResult && !geminiResult.raw) return geminiResult;

  return generateLocalNutritionPlan(params);
};

export const analyzeBodyMetrics = async (params) => {
  const prompt = `Analyze body metrics as JSON: ${JSON.stringify(params)}
Return JSON: {"bmi":0,"bmiCategory":"","bmr":0,"tdee":0,"recommendedCalories":0,"bodyComposition":{},"healthInsights":[],"targetWeight":{}}`;

  const geminiResult = await tryGemini(prompt);
  if (geminiResult && !geminiResult.raw) return geminiResult;

  return generateLocalBodyAnalysis(params);
};

export const generateComprehensivePlan = async (params) => {
  const geminiResult = await tryGemini(`Create comprehensive fitness plan as JSON: ${JSON.stringify(params)}`);
  if (geminiResult && !geminiResult.raw) return geminiResult;

  const workout = generateLocalWorkoutPlan({ goal: 'mixed', duration: 45, experienceLevel: 'intermediate' });
  const nutrition = generateLocalNutritionPlan({ dietType: 'balanced', calories: 2000, mealsPerDay: 3 });

  return {
    overview: '12-week balanced fitness program combining strength training and proper nutrition.',
    durationWeeks: params.durationWeeks || 12,
    weeklySchedule: [{ week: 1, workoutDays: 4, focus: 'Foundation building', workouts: [{ day: 'Mon', type: workout.title, description: workout.description }] }],
    nutritionGuidelines: { dailyCalories: nutrition.totalCalories, macros: nutrition.macros, mealTiming: ['Breakfast 8am', 'Lunch 12pm', 'Dinner 7pm'], hydration: '2.5L water daily' },
    milestones: [{ week: 4, goal: 'Complete 16 workouts', metrics: { workouts: 16 } }],
    tips: nutrition.tips,
    source: 'gymos-local-ai',
  };
};

export const recommendFoods = async (params) => {
  const geminiResult = await tryGemini(`Recommend foods as JSON for: ${JSON.stringify(params)}`);
  if (geminiResult && !geminiResult.raw) return geminiResult;

  return {
    recommendations: [
      { name: 'Chicken Breast', category: 'Protein', benefits: ['High protein', 'Low fat'], servingSize: '150g', calories: 165, protein: 31 },
      { name: 'Salmon', category: 'Protein', benefits: ['Omega-3', 'Muscle recovery'], servingSize: '150g', calories: 280, protein: 25 },
      { name: 'Sweet Potato', category: 'Carbs', benefits: ['Complex carbs', 'Fiber'], servingSize: '200g', calories: 180, protein: 4 },
      { name: 'Greek Yogurt', category: 'Dairy', benefits: ['Probiotics', 'Protein'], servingSize: '170g', calories: 100, protein: 17 },
    ],
    mealSuggestions: [{ name: 'Post-Workout Bowl', ingredients: ['Chicken', 'Rice', 'Broccoli'], prepTime: '20 min' }],
    foodsToAvoid: ['Processed sugars', 'Deep fried foods', 'Excessive alcohol'],
    tips: ['Eat protein with every meal', 'Choose whole foods over processed'],
    source: 'gymos-local-ai',
  };
};

export const getSupplementAdvice = async (params) => {
  const geminiResult = await tryGemini(`Supplement advice as JSON: ${JSON.stringify(params)}`);
  if (geminiResult && !geminiResult.raw) return geminiResult;

  return {
    recommended: [
      { name: 'Whey Protein', dosage: '25-30g post-workout', timing: 'After training', benefits: ['Muscle recovery', 'Protein intake'], evidence: 'Well-studied for muscle synthesis' },
      { name: 'Creatine Monohydrate', dosage: '5g daily', timing: 'Any time', benefits: ['Strength', 'Power output'], evidence: 'Most researched supplement' },
    ],
    optional: [{ name: 'Vitamin D', dosage: '1000-2000 IU', benefits: ['Bone health', 'Immune support'] }],
    avoid: [{ name: 'Proprietary blends', reason: 'Unknown ingredient amounts' }],
    interactions: ['Consult doctor if taking medications'],
    disclaimer: 'This is general information only. Consult a healthcare provider before starting supplements.',
    source: 'gymos-local-ai',
  };
};

export const generateWeeklyReport = async (userData) => {
  const geminiResult = await tryGemini(`Weekly fitness report as JSON: ${JSON.stringify(userData)}`);
  if (geminiResult && !geminiResult.raw) return geminiResult;

  return {
    summary: 'Solid week of training. Keep building consistency.',
    highlights: ['Showed up and trained', 'Maintained nutrition awareness'],
    areasForImprovement: ['Increase water intake', 'Add one extra workout day'],
    workoutStats: { completed: userData?.workouts?.length || 0, total: 5, streakDays: 1 },
    nutritionStats: { avgCalories: 2000, proteinAvg: 120 },
    recommendations: ['Schedule workouts in advance', 'Prep meals on Sunday'],
    nextWeekGoals: ['Complete 4 workouts', 'Log progress on Friday'],
    source: 'gymos-local-ai',
  };
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
