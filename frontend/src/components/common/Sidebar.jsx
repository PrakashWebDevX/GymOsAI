import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiActivity, FiCoffee, FiTrendingUp, FiAward, FiUser, FiSettings, FiLogOut,
} from 'react-icons/fi';
import { NAV_ITEMS } from '../../constants';
import { useAuthStore, useThemeStore } from '../../store';
import styles from './Sidebar.module.css';

const ICON_MAP = {
  dashboard: FiGrid,
  workout: FiActivity,
  nutrition: FiCoffee,
  progress: FiTrendingUp,
  achievements: FiAward,
  profile: FiUser,
  settings: FiSettings,
};

export default function Sidebar() {
  const { sidebarOpen, sidebarCollapsed } = useThemeStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  if (!sidebarOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={() => useThemeStore.getState().toggleSidebar()} />
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ path, label, icon }) => {
            const Icon = ICON_MAP[icon];
            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              >
                {Icon && <Icon className={styles.icon} />}
                <span className={styles.label}>{label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <FiLogOut className={styles.icon} />
          <span className={styles.label}>Logout</span>
        </button>
      </aside>
    </>
  );
}
