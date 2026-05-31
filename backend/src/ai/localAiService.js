/**
 * 100% FREE built-in workout generator — no API key required.
 * Used when GEMINI_API_KEY is missing or Gemini API fails.
 */

const WORKOUT_TEMPLATES = {
  strength: {
    title: 'Strength Builder',
    description: 'Build muscle and power with compound movements and progressive overload.',
    warmup: [
      { name: 'Arm Circles', duration: '2 min', instructions: 'Forward and backward, 30 seconds each direction.' },
      { name: 'Bodyweight Squats', duration: '2 min', instructions: '15 slow controlled reps to warm up legs.' },
      { name: 'Jumping Jacks', duration: '1 min', instructions: 'Light cardio to raise heart rate.' },
    ],
    exercises: [
      { name: 'Push-ups', sets: 4, reps: '10-15', rest: '60s', instructions: 'Keep core tight, chest to floor.', muscleGroup: 'Chest' },
      { name: 'Squats', sets: 4, reps: '12-15', rest: '60s', instructions: 'Feet shoulder-width, knees track over toes.', muscleGroup: 'Legs' },
      { name: 'Dumbbell Rows', sets: 3, reps: '10-12', rest: '45s', instructions: 'Pull elbow back, squeeze shoulder blade.', muscleGroup: 'Back' },
      { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '45s', instructions: 'Step forward, back knee nearly touches floor.', muscleGroup: 'Legs' },
      { name: 'Plank', sets: 3, reps: '30-45 sec', rest: '30s', instructions: 'Straight line from head to heels.', muscleGroup: 'Core' },
      { name: 'Shoulder Press', sets: 3, reps: '10-12', rest: '45s', instructions: 'Press overhead without arching lower back.', muscleGroup: 'Shoulders' },
    ],
    cooldown: [
      { name: 'Hamstring Stretch', duration: '2 min', instructions: 'Hold each leg 30 seconds.' },
      { name: 'Child\'s Pose', duration: '2 min', instructions: 'Breathe deeply, relax lower back.' },
    ],
    estimatedCalories: 350,
    difficulty: 'intermediate',
  },
  cardio: {
    title: 'Cardio Burn',
    description: 'Improve cardiovascular endurance and burn calories efficiently.',
    warmup: [
      { name: 'March in Place', duration: '2 min', instructions: 'Gradually increase pace.' },
      { name: 'Leg Swings', duration: '2 min', instructions: 'Front-to-back and side-to-side, 10 each.' },
    ],
    exercises: [
      { name: 'Jump Rope', sets: 3, reps: '2 min', rest: '30s', instructions: 'Light on feet, steady rhythm.', muscleGroup: 'Full Body' },
      { name: 'High Knees', sets: 4, reps: '30 sec', rest: '30s', instructions: 'Drive knees to hip height.', muscleGroup: 'Legs' },
      { name: 'Burpees', sets: 3, reps: '10', rest: '45s', instructions: 'Full push-up at bottom, jump at top.', muscleGroup: 'Full Body' },
      { name: 'Mountain Climbers', sets: 4, reps: '30 sec', rest: '30s', instructions: 'Fast alternating knee drives.', muscleGroup: 'Core' },
      { name: 'Jump Squats', sets: 3, reps: '15', rest: '45s', instructions: 'Explosive jump, soft landing.', muscleGroup: 'Legs' },
      { name: 'Shadow Boxing', sets: 3, reps: '1 min', rest: '30s', instructions: 'Jab, cross, hook combinations.', muscleGroup: 'Upper Body' },
    ],
    cooldown: [
      { name: 'Walking', duration: '3 min', instructions: 'Slow pace to lower heart rate.' },
      { name: 'Deep Breathing', duration: '2 min', instructions: '4 counts in, 6 counts out.' },
    ],
    estimatedCalories: 400,
    difficulty: 'intermediate',
  },
  hiit: {
    title: 'HIIT Power Session',
    description: 'High-intensity intervals for maximum fat burn in minimum time.',
    warmup: [
      { name: 'Dynamic Stretching', duration: '3 min', instructions: 'Leg swings, arm circles, torso twists.' },
    ],
    exercises: [
      { name: 'Sprint in Place', sets: 5, reps: '30 sec', rest: '15s', instructions: 'Maximum effort, pump arms.', muscleGroup: 'Full Body' },
      { name: 'Jump Squats', sets: 5, reps: '30 sec', rest: '15s', instructions: 'Explosive upward movement.', muscleGroup: 'Legs' },
      { name: 'Push-up to T', sets: 4, reps: '30 sec', rest: '15s', instructions: 'Push-up then rotate to side plank.', muscleGroup: 'Chest' },
      { name: 'Skater Hops', sets: 4, reps: '30 sec', rest: '15s', instructions: 'Leap side to side, touch floor.', muscleGroup: 'Legs' },
      { name: 'Plank Jacks', sets: 4, reps: '30 sec', rest: '15s', instructions: 'Jump feet in and out in plank.', muscleGroup: 'Core' },
    ],
    cooldown: [
      { name: 'Static Stretching', duration: '5 min', instructions: 'Hold each major muscle group 30 seconds.' },
    ],
    estimatedCalories: 450,
    difficulty: 'advanced',
  },
  flexibility: {
    title: 'Flexibility & Mobility',
    description: 'Improve range of motion, reduce stiffness, and aid recovery.',
    warmup: [
      { name: 'Neck Rolls', duration: '1 min', instructions: 'Slow circles, both directions.' },
      { name: 'Shoulder Rolls', duration: '1 min', instructions: 'Forward and backward.' },
    ],
    exercises: [
      { name: 'Cat-Cow Stretch', sets: 3, reps: '10', rest: '15s', instructions: 'Arch and round spine with breath.', muscleGroup: 'Spine' },
      { name: 'Hip Flexor Stretch', sets: 2, reps: '45 sec each', rest: '15s', instructions: 'Kneeling lunge, push hips forward.', muscleGroup: 'Hips' },
      { name: 'Pigeon Pose', sets: 2, reps: '60 sec each', rest: '15s', instructions: 'Deep hip opener, breathe into stretch.', muscleGroup: 'Hips' },
      { name: 'Downward Dog', sets: 3, reps: '30 sec', rest: '15s', instructions: 'Heels toward floor, lengthen spine.', muscleGroup: 'Full Body' },
      { name: 'Seated Forward Fold', sets: 2, reps: '45 sec', rest: '15s', instructions: 'Reach for toes, relax neck.', muscleGroup: 'Hamstrings' },
      { name: 'Thoracic Rotation', sets: 3, reps: '10 each side', rest: '15s', instructions: 'On all fours, rotate upper body.', muscleGroup: 'Back' },
    ],
    cooldown: [
      { name: 'Savasana', duration: '3 min', instructions: 'Lie flat, full body relaxation.' },
    ],
    estimatedCalories: 150,
    difficulty: 'beginner',
  },
  mixed: {
    title: 'Full Body Fusion',
    description: 'Balanced blend of strength, cardio, and core for total fitness.',
    warmup: [
      { name: 'Light Jog in Place', duration: '2 min', instructions: 'Easy pace.' },
      { name: 'Dynamic Lunges', duration: '2 min', instructions: '10 each leg with torso twist.' },
    ],
    exercises: [
      { name: 'Push-ups', sets: 3, reps: '12', rest: '45s', instructions: 'Modify on knees if needed.', muscleGroup: 'Chest' },
      { name: 'Goblet Squats', sets: 3, reps: '15', rest: '45s', instructions: 'Hold weight at chest, deep squat.', muscleGroup: 'Legs' },
      { name: 'Bicycle Crunches', sets: 3, reps: '20 each side', rest: '30s', instructions: 'Elbow to opposite knee.', muscleGroup: 'Core' },
      { name: 'Jumping Jacks', sets: 3, reps: '45 sec', rest: '30s', instructions: 'Steady pace cardio burst.', muscleGroup: 'Full Body' },
      { name: 'Dumbbell Deadlift', sets: 3, reps: '12', rest: '45s', instructions: 'Hinge at hips, flat back.', muscleGroup: 'Posterior Chain' },
      { name: 'Plank Hold', sets: 3, reps: '40 sec', rest: '30s', instructions: 'Engage glutes and core.', muscleGroup: 'Core' },
    ],
    cooldown: [
      { name: 'Full Body Stretch', duration: '5 min', instructions: 'Quads, hamstrings, chest, shoulders.' },
    ],
    estimatedCalories: 380,
    difficulty: 'intermediate',
  },
};

const EXPERIENCE_MODIFIERS = {
  beginner: { setsMultiplier: 0.7, restMultiplier: 1.5, difficulty: 'beginner' },
  intermediate: { setsMultiplier: 1, restMultiplier: 1, difficulty: 'intermediate' },
  advanced: { setsMultiplier: 1.3, restMultiplier: 0.8, difficulty: 'advanced' },
};

export const generateLocalWorkoutPlan = (params) => {
  const {
    goal = 'mixed',
    duration = 45,
    experienceLevel = 'intermediate',
    userProfile,
  } = params;

  const template = WORKOUT_TEMPLATES[goal] || WORKOUT_TEMPLATES.mixed;
  const modifier = EXPERIENCE_MODIFIERS[experienceLevel] || EXPERIENCE_MODIFIERS.intermediate;

  const exercises = template.exercises.map((ex) => ({
    ...ex,
    sets: Math.max(2, Math.round(ex.sets * modifier.setsMultiplier)),
  }));

  const userName = userProfile?.full_name?.split(' ')[0] || 'Athlete';

  return {
    title: `${template.title} — ${duration} min`,
    description: `${template.description} Personalized for ${userName} at ${experienceLevel} level.`,
    warmup: template.warmup,
    exercises,
    cooldown: template.cooldown,
    estimatedCalories: Math.round(template.estimatedCalories * (duration / 45)),
    difficulty: modifier.difficulty,
    source: 'gymos-local-ai',
  };
};

const MEAL_TEMPLATES = {
  balanced: {
    title: 'Balanced Daily Plan',
    meals: [
      { type: 'breakfast', name: 'Oatmeal Power Bowl', calories: 420, protein: 18, carbs: 55, fat: 12, ingredients: ['Oats', 'Banana', 'Almond butter', 'Honey', 'Berries'], instructions: 'Cook oats, top with sliced banana, berries, and almond butter.' },
      { type: 'lunch', name: 'Grilled Chicken Salad', calories: 520, protein: 42, carbs: 30, fat: 22, ingredients: ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Olive oil', 'Quinoa'], instructions: 'Grill chicken, serve over quinoa and greens with olive oil dressing.' },
      { type: 'dinner', name: 'Salmon with Vegetables', calories: 580, protein: 38, carbs: 35, fat: 28, ingredients: ['Salmon fillet', 'Broccoli', 'Sweet potato', 'Lemon', 'Garlic'], instructions: 'Bake salmon at 200°C for 15 min with roasted vegetables.' },
      { type: 'snack', name: 'Greek Yogurt & Nuts', calories: 220, protein: 15, carbs: 18, fat: 10, ingredients: ['Greek yogurt', 'Walnuts', 'Honey'], instructions: 'Mix yogurt with crushed walnuts and drizzle honey.' },
    ],
    tips: ['Drink 2-3 liters of water daily', 'Eat protein within 30 min post-workout', 'Prep meals on Sunday for the week'],
  },
  keto: {
    title: 'Keto Meal Plan',
    meals: [
      { type: 'breakfast', name: 'Avocado Egg Scramble', calories: 450, protein: 22, carbs: 8, fat: 38, ingredients: ['Eggs', 'Avocado', 'Butter', 'Spinach', 'Cheese'], instructions: 'Scramble eggs with spinach, serve with sliced avocado.' },
      { type: 'lunch', name: 'Caesar Salad with Chicken', calories: 520, protein: 40, carbs: 10, fat: 35, ingredients: ['Chicken', 'Romaine', 'Parmesan', 'Caesar dressing'], instructions: 'Grill chicken, toss with romaine and dressing.' },
      { type: 'dinner', name: 'Steak with Asparagus', calories: 620, protein: 45, carbs: 12, fat: 42, ingredients: ['Ribeye steak', 'Asparagus', 'Butter', 'Garlic'], instructions: 'Pan-sear steak, sauté asparagus in garlic butter.' },
    ],
    tips: ['Keep net carbs under 50g', 'Supplement electrolytes', 'Track macros consistently'],
  },
  vegan: {
    title: 'Vegan Power Plan',
    meals: [
      { type: 'breakfast', name: 'Smoothie Bowl', calories: 380, protein: 14, carbs: 58, fat: 10, ingredients: ['Banana', 'Spinach', 'Plant protein', 'Almond milk', 'Granola'], instructions: 'Blend fruits and protein, top with granola.' },
      { type: 'lunch', name: 'Buddha Bowl', calories: 490, protein: 20, carbs: 62, fat: 16, ingredients: ['Chickpeas', 'Brown rice', 'Roasted vegetables', 'Tahini'], instructions: 'Roast chickpeas and veggies, serve over rice with tahini.' },
      { type: 'dinner', name: 'Lentil Curry', calories: 510, protein: 24, carbs: 55, fat: 14, ingredients: ['Red lentils', 'Coconut milk', 'Curry spices', 'Rice'], instructions: 'Simmer lentils in coconut curry sauce, serve with rice.' },
    ],
    tips: ['Combine legumes and grains for complete protein', 'Take B12 supplement', 'Include iron-rich foods with vitamin C'],
  },
};

export const generateLocalNutritionPlan = (params) => {
  const { dietType = 'balanced', calories = 2000, mealsPerDay = 3, userProfile } = params;
  const template = MEAL_TEMPLATES[dietType] || MEAL_TEMPLATES.balanced;
  const meals = template.meals.slice(0, mealsPerDay);
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const scale = calories / totalCalories;

  const scaledMeals = meals.map((m) => ({
    ...m,
    calories: Math.round(m.calories * scale),
    protein: Math.round(m.protein * scale),
    carbs: Math.round(m.carbs * scale),
    fat: Math.round(m.fat * scale),
  }));

  const totalProtein = scaledMeals.reduce((s, m) => s + m.protein, 0);
  const totalCarbs = scaledMeals.reduce((s, m) => s + m.carbs, 0);
  const totalFat = scaledMeals.reduce((s, m) => s + m.fat, 0);

  return {
    title: template.title,
    totalCalories: scaledMeals.reduce((s, m) => s + m.calories, 0),
    macros: { protein: totalProtein, carbs: totalCarbs, fat: totalFat },
    meals: scaledMeals,
    tips: template.tips,
    source: 'gymos-local-ai',
  };
};

export const generateLocalBodyAnalysis = (params) => {
  const { heightCm, weightKg, age, gender, activityLevel } = params;
  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

  let bmiCategory = 'Normal weight';
  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
  else if (bmi >= 30) bmiCategory = 'Obese';

  const bmrBase = gender === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const activityMultipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
  const bmr = Math.round(bmrBase);
  const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));

  return {
    bmi,
    bmiCategory,
    bmr,
    tdee,
    recommendedCalories: tdee,
    bodyComposition: {
      assessment: `BMI of ${bmi} indicates ${bmiCategory.toLowerCase()}.`,
      recommendations: ['Maintain consistent training 3-5x per week', 'Prioritize protein intake', 'Track progress weekly'],
    },
    healthInsights: [`Your estimated daily calorie needs: ${tdee} kcal`, `Basal metabolic rate: ${bmr} kcal`],
    targetWeight: { min: Math.round(heightM * heightM * 18.5), max: Math.round(heightM * heightM * 24.9), ideal: Math.round(heightM * heightM * 22) },
    source: 'gymos-local-ai',
  };
};

export default {
  generateLocalWorkoutPlan,
  generateLocalNutritionPlan,
  generateLocalBodyAnalysis,
};
