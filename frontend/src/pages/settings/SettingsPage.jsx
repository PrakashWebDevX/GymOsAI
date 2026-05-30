import { Card, ThemeSwitcher } from '../../components/common';
import { useThemeStore } from '../../store';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Settings</h1>
        <p>Customize your GYMOS AI experience</p>
      </header>

      <div className={styles.grid}>
        <Card title="Appearance" padding="lg">
          <div className={styles.setting}>
            <div>
              <h4>Theme</h4>
              <p>Choose your preferred color scheme</p>
            </div>
            <div className={styles.themeOptions}>
              <button
                className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`}
                onClick={() => setTheme('dark')}
              >
                Dark
              </button>
              <button
                className={`${styles.themeBtn} ${theme === 'light' ? styles.active : ''}`}
                onClick={() => setTheme('light')}
              >
                Light
              </button>
              <ThemeSwitcher />
            </div>
          </div>
        </Card>

        <Card title="Notifications" padding="lg">
          <div className={styles.setting}>
            <div>
              <h4>Push Notifications</h4>
              <p>Get reminders for workouts and meals</p>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" defaultChecked />
              <span className={styles.slider} />
            </label>
          </div>
        </Card>

        <Card title="Account" padding="lg">
          <div className={styles.links}>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/support">Support</a>
          </div>
        </Card>
      </div>
    </div>
  );
}
