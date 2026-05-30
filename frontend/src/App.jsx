import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';
import InstallBanner from './pwa/InstallBanner';
import { useThemeStore } from './store';
import './styles/global.css';

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppRoutes />
        <InstallBanner />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
            },
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
