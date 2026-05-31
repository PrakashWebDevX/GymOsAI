import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';

const AUTH_STORAGE_KEY = 'gymos-supabase-auth';
export const AUTH_SYNC_KEY = 'gymos_auth_backend_sync';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env'
  );
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '', {
  auth: {
    // Implicit flow avoids PKCE verifier storage issues in SPA redirects
    flowType: 'implicit',
    detectSessionInUrl: true,
    autoRefreshToken: true,
    persistSession: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: AUTH_STORAGE_KEY,
  },
});

export const signInWithGoogle = async () => {
  sessionStorage.removeItem(AUTH_SYNC_KEY);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const signOutSupabase = async () => {
  sessionStorage.removeItem(AUTH_SYNC_KEY);
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export default supabase;
