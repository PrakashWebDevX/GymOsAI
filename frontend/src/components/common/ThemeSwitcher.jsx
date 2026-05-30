import { FiSun, FiMoon } from 'react-icons/fi';
import { useThemeStore } from '../../store';
import styles from './ThemeSwitcher.module.css';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      className={styles.switcher}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <FiSun /> : <FiMoon />}
    </button>
  );
}
