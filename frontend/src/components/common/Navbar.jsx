import { Link } from 'react-router-dom';
import { FiMenu, FiBell } from 'react-icons/fi';
import { APP_NAME } from '../../constants';
import { useAuthStore, useThemeStore } from '../../store';
import ThemeSwitcher from './ThemeSwitcher';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user } = useAuthStore();
  const { toggleSidebar } = useThemeStore();

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={toggleSidebar} aria-label="Toggle menu">
          <FiMenu />
        </button>
        <Link to="/dashboard" className={styles.logo}>
          <span className={styles.logoIcon}>💪</span>
          <span className={styles.logoText}>{APP_NAME}</span>
        </Link>
      </div>

      <div className={styles.right}>
        <button className={styles.iconBtn} aria-label="Notifications">
          <FiBell />
        </button>
        <ThemeSwitcher />
        {user && (
          <Link to="/profile" className={styles.avatar}>
            {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
          </Link>
        )}
      </div>
    </header>
  );
}
