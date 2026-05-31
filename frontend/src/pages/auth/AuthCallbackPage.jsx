import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader } from '../../components/common';
import { supabase, AUTH_SYNC_KEY } from '../../services/supabase';
import { useAuthStore } from '../../store';

const MAX_ATTEMPTS = 15;
const RETRY_MS = 400;

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const googleLogin = useAuthStore((s) => s.googleLogin);
  const isRunning = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorDescription = params.get('error_description');

    if (errorDescription) {
      toast.error(errorDescription);
      navigate('/auth/login', { replace: true });
      return;
    }

    const syncWithBackend = async (session) => {
      if (!session?.access_token) return false;

      const syncId = session.user?.id ?? session.access_token;

      if (sessionStorage.getItem(AUTH_SYNC_KEY) === syncId) {
        navigate('/dashboard', { replace: true });
        return true;
      }

      if (isRunning.current) return true;
      isRunning.current = true;

      try {
        await googleLogin(session.access_token);
        sessionStorage.setItem(AUTH_SYNC_KEY, syncId);
        toast.success('Welcome to GYMOS AI!');
        navigate('/dashboard', { replace: true });
        return true;
      } finally {
        isRunning.current = false;
      }
    };

    const waitForSession = async () => {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;
        if (session) {
          return syncWithBackend(session);
        }

        await new Promise((resolve) => setTimeout(resolve, RETRY_MS));
      }

      throw new Error('Sign-in timed out. Please try Google again.');
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (
          (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') &&
          session
        ) {
          try {
            await syncWithBackend(session);
          } catch (err) {
            console.error('OAuth sync error:', err);
            toast.error(err.message || 'Sign-in failed');
            sessionStorage.removeItem(AUTH_SYNC_KEY);
            navigate('/auth/login', { replace: true });
          }
        }
      }
    );

    waitForSession().catch((err) => {
      console.error('OAuth callback error:', err);
      toast.error(err.message || 'Google sign-in failed');
      sessionStorage.removeItem(AUTH_SYNC_KEY);
      navigate('/auth/login', { replace: true });
    });

    return () => subscription.unsubscribe();
  }, [navigate, googleLogin]);

  return <Loader fullScreen text="Completing Google sign in..." />;
}
