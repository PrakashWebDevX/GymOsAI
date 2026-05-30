import { useEffect, useState } from 'react';
import { Card, Loader } from '../../components/common';
import { useThemeStore } from '../../store';
import { achievementApi } from '../../api';
import styles from './AchievementsPage.module.css';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [streaks, setStreaks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      achievementApi.getAll().then((r) => setAchievements(r.data || [])),
      achievementApi.getStreaks().then((r) => setStreaks(r.data || [])),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen text="Loading achievements..." />;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Achievements & Streaks</h1>
        <p>Celebrate your fitness milestones</p>
      </header>

      <div className={styles.streaksGrid}>
        {streaks.length > 0 ? streaks.map((s) => (
          <Card key={s.id} padding="md" className={styles.streakCard}>
            <span className={styles.streakEmoji}>🔥</span>
            <span className={styles.streakCount}>{s.current_count}</span>
            <span className={styles.streakLabel}>{s.streak_type} streak</span>
            <span className={styles.streakBest}>Best: {s.longest_count}</span>
          </Card>
        )) : (
          <Card padding="lg">
            <p className={styles.empty}>Complete workouts and log nutrition to build streaks!</p>
          </Card>
        )}
      </div>

      <Card title="Achievements" className={styles.achievements}>
        {achievements.length > 0 ? (
          <div className={styles.achievementGrid}>
            {achievements.map((a) => (
              <div key={a.id} className={styles.achievement}>
                <span className={styles.icon}>{a.icon || '🏆'}</span>
                <div>
                  <h4>{a.title}</h4>
                  <p>{a.description}</p>
                  <span className={styles.date}>
                    {new Date(a.earned_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No achievements yet. Keep pushing!</p>
        )}
      </Card>
    </div>
  );
}
