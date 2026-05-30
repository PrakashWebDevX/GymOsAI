import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar, Footer } from '../components/common';
import { useThemeStore } from '../store';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout() {
  const { sidebarOpen } = useThemeStore();

  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.body}>
        <Sidebar />
        <main className={`${styles.main} ${sidebarOpen ? '' : styles.fullWidth}`}>
          <div className={styles.content}>
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
