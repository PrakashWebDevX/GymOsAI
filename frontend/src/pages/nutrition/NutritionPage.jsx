import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button, Card, Loader } from '../../components/common';
import { useNutritionStore } from '../../store';
import { DIET_TYPES } from '../../constants';
import styles from './NutritionPage.module.css';

export default function NutritionPage() {
  const { currentPlan, mealPlan, history, generatePlan, fetchHistory, fetchMealPlan, isLoading } = useNutritionStore();
  const [form, setForm] = useState({
    dietType: 'balanced',
    mealsPerDay: 3,
    calories: 2000,
    allergies: [],
    preferences: [],
  });

  useEffect(() => {
    fetchHistory();
    fetchMealPlan().catch(() => {});
  }, []);

  const handleGenerate = async () => {
    try {
      await generatePlan(form);
      toast.success('Nutrition plan generated!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const plan = currentPlan || mealPlan;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>AI Nutrition Planner</h1>
        <p>Personalized meal plans tailored to your goals</p>
      </header>

      <div className={styles.grid}>
        <Card title="Generate Meal Plan" padding="lg">
          <div className={styles.form}>
            <div className={styles.field}>
              <label>Diet Type</label>
              <select value={form.dietType} onChange={(e) => setForm({ ...form, dietType: e.target.value })}>
                {DIET_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Target Calories: {form.calories}</label>
              <input
                type="range"
                min="1200"
                max="4000"
                step="100"
                value={form.calories}
                onChange={(e) => setForm({ ...form, calories: parseInt(e.target.value) })}
              />
            </div>

            <div className={styles.field}>
              <label>Meals Per Day</label>
              <select value={form.mealsPerDay} onChange={(e) => setForm({ ...form, mealsPerDay: parseInt(e.target.value) })}>
                {[2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} meals</option>
                ))}
              </select>
            </div>

            <Button onClick={handleGenerate} loading={isLoading} fullWidth>
              Generate Meal Plan
            </Button>
          </div>
        </Card>

        <Card title="Today's Meals" padding="lg">
          {isLoading ? (
            <Loader text="Generating plan..." />
          ) : plan?.plan_data?.meals ? (
            <div className={styles.meals}>
              {plan.plan_data.macros && (
                <div className={styles.macros}>
                  <span>P: {plan.plan_data.macros.protein}g</span>
                  <span>C: {plan.plan_data.macros.carbs}g</span>
                  <span>F: {plan.plan_data.macros.fat}g</span>
                </div>
              )}
              {plan.plan_data.meals.map((meal, i) => (
                <div key={i} className={styles.meal}>
                  <div className={styles.mealHeader}>
                    <span className={styles.mealType}>{meal.type}</span>
                    <span className={styles.calories}>{meal.calories} cal</span>
                  </div>
                  <h4>{meal.name}</h4>
                  {meal.ingredients && (
                    <p className={styles.ingredients}>{meal.ingredients.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>Generate a meal plan to see your nutrition here</p>
          )}
        </Card>
      </div>
    </div>
  );
}
