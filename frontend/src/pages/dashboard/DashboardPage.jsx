import { useEffect } from 'react';
import { FiActivity, FiCoffee, FiTrendingUp, FiAward } from 'react-icons/fi';
import { Card, Loader, ProgressBar } from '../../components/common';
import { useUserStore, useWorkoutStore, useNutritionStore, useProgressStore } from '../../store';
import { achievementApi } from '../../api';
import { useState } from 'react';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { profile, fetchProfile } = useUserStore();
  const { history: workouts, fetchHistory: fetchWorkouts } = useWorkoutStore();
  const { mealPlan, fetchMealPlan } = useNutritionStore();
  const { logs, fetchProgress } = useProgressStore();
  const [streaks, setStreaks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all([
          fetchProfile(),
          fetchWorkouts(5),
          fetchMealPlan().catch(() => {}),
          fetchProgress(),
          achievementApi.getStreaks().then((r) => setStreaks(r.data || [])).catch(() => {}),
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader fullScreen text="Loading dashboard..." />;

  const stats = [
    { label: 'Workouts', value: workouts?.length || 0, icon: FiActivity, color: 'primary' },
    { label: 'Meal Plans', value: mealPlan ? 1 : 0, icon: FiCoffee, color: 'success' },
    { label: 'Progress Logs', value: logs?.length || 0, icon: FiTrendingUp, color: 'warning' },
    { label: 'Streaks', value: streaks?.length || 0, icon: FiAward, color: 'danger' },
  ];

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.greeting}>
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Athlete'}!
          </h1>
          <p className={styles.subtitle}>Here&apos;s your fitness overview for today</p>
        </div>
      </header>

      <div className={styles.statsGrid}>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} hover padding="md" className={styles.statCard}>
            <div className={styles.statIcon} data-color={color}>
              <Icon />
            </div>
            <div>
              <p className={styles.statValue}>{value}</p>
              <p className={styles.statLabel}>{label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.grid}>
        <Card title="Today's Goals" subtitle="Track your daily progress">
          <div className={styles.goals}>
            <ProgressBar label="Workout" value={workouts?.[0]?.is_completed ? 100 : 0} />
            <ProgressBar label="Nutrition" value={mealPlan ? 75 : 0} color="success" />
            <ProgressBar label="Hydration" value={60} color="warning" />
          </div>
        </Card>

        <Card title="Recent Workouts" subtitle="Your latest training sessions">
          {workouts?.length > 0 ? (
            <ul className={styles.list}>
              {workouts.slice(0, 3).map((w) => (
                <li key={w.id} className={styles.listItem}>
                  <span>{w.title}</span>
                  <span className={styles.badge}>{w.workout_type}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>No workouts yet. Generate your first AI workout!</p>
          )}
        </Card>

        <Card title="Active Streaks" subtitle="Keep the momentum going">
          {streaks?.length > 0 ? (
            <div className={styles.streaks}>
              {streaks.map((s) => (
                <div key={s.id} className={styles.streak}>
                  <span className={styles.streakCount}>{s.current_count}</span>
                  <span className={styles.streakType}>{s.streak_type}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>Complete activities to build streaks!</p>
          )}
        </Card>
      </div>
    </div>
  );
}
