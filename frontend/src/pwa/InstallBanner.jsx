import { useState, useEffect } from 'react';
import { Button } from '../components/common';
import styles from './InstallBanner.module.css';

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <span className={styles.icon}>💪</span>
        <div>
          <strong>Install GYMOS AI</strong>
          <p>Get the full app experience on your device</p>
        </div>
      </div>
      <div className={styles.actions}>
        <Button size="sm" onClick={handleInstall}>Install</Button>
        <button className={styles.dismiss} onClick={() => setShow(false)}>Later</button>
      </div>
    </div>
  );
}
