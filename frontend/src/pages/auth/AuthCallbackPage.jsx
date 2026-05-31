import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader } from '../../components/common';
import { supabase } from '../../services/supabase';
import { useAuthStore } from '../../store';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const googleLogin = useAuthStore((s) => s.googleLogin);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const finishSignIn = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const errorDescription = params.get('error_description');

        if (errorDescription) {
          throw new Error(errorDescription);
        }

        // PKCE flow: exchange ?code= for a session
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session?.access_token) {
          throw new Error('Sign-in session not found. Please try again.');
        }

        await googleLogin(session.access_token);
        toast.success('Welcome to GYMOS AI!');
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('OAuth callback error:', err);
        toast.error(err.message || 'Google sign-in failed');
        navigate('/auth/login', { replace: true });
      }
    };

    finishSignIn();
  }, [navigate, googleLogin]);

  return <Loader fullScreen text="Completing Google sign in..." />;
}
