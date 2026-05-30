import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button, Card, Loader } from '../../components/common';
import { useWorkoutStore } from '../../store';
import { WORKOUT_TYPES } from '../../constants';
import styles from './WorkoutPage.module.css';

export default function WorkoutPage() {
  const { currentPlan, history, generateWorkout, fetchHistory, updateWorkout, isLoading } = useWorkoutStore();
  const [form, setForm] = useState({
    goal: 'strength',
    duration: 45,
    experienceLevel: 'intermediate',
    equipment: [],
    focusAreas: [],
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGenerate = async () => {
    try {
      await generateWorkout(form);
      toast.success('Workout plan generated!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleComplete = async () => {
    if (!currentPlan) return;
    try {
      await updateWorkout({ planId: currentPlan.id, completed: true });
      toast.success('Workout marked as complete!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>AI Workout Generator</h1>
        <p>Get personalized workout plans powered by AI</p>
      </header>

      <div className={styles.grid}>
        <Card title="Generate Workout" padding="lg">
          <div className={styles.form}>
            <div className={styles.field}>
              <label>Workout Type</label>
              <select
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
              >
                {WORKOUT_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Duration (minutes): {form.duration}</label>
              <input
                type="range"
                min="15"
                max="120"
                step="5"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
              />
            </div>

            <div className={styles.field}>
              <label>Experience Level</label>
              <select
                value={form.experienceLevel}
                onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <Button onClick={handleGenerate} loading={isLoading} fullWidth>
              Generate AI Workout
            </Button>
          </div>
        </Card>

        <Card title="Current Plan" padding="lg">
          {isLoading ? (
            <Loader text="Generating workout..." />
          ) : currentPlan ? (
            <div className={styles.plan}>
              <h3>{currentPlan.title}</h3>
              <p>{currentPlan.description}</p>
              {currentPlan.plan_data?.exercises && (
                <ul className={styles.exercises}>
                  {currentPlan.plan_data.exercises.map((ex, i) => (
                    <li key={i}>
                      <strong>{ex.name}</strong> — {ex.sets} sets × {ex.reps}
                    </li>
                  ))}
                </ul>
              )}
              {!currentPlan.is_completed && (
                <Button onClick={handleComplete} variant="secondary" fullWidth>
                  Mark Complete
                </Button>
              )}
            </div>
          ) : (
            <p className={styles.empty}>Generate a workout to see your plan here</p>
          )}
        </Card>
      </div>

      {history?.length > 0 && (
        <Card title="Workout History" className={styles.history}>
          <div className={styles.historyGrid}>
            {history.map((w) => (
              <div key={w.id} className={styles.historyItem}>
                <h4>{w.title}</h4>
                <span className={styles.meta}>{w.workout_type} · {w.duration_minutes}min</span>
                {w.is_completed && <span className={styles.completed}>Completed</span>}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
