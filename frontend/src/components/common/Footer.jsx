import { APP_NAME } from '../../constants';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p className={styles.copyright}>
          &copy; {year} {APP_NAME}. All rights reserved.
        </p>
        <div className={styles.links}>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/support">Support</a>
        </div>
      </div>
    </footer>
  );
}
