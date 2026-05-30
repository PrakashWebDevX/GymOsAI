import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';

export default function AuthLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.branding}>
        <div className={styles.brandContent}>
          <span className={styles.logo}>💪</span>
          <h1 className={styles.title}>GYMOS AI</h1>
          <p className={styles.tagline}>
            Your AI-powered fitness coach. Personalized workouts, nutrition plans, and progress tracking.
          </p>
        </div>
      </div>
      <div className={styles.formSection}>
        <Outlet />
      </div>
    </div>
  );
}
