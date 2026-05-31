import { supabaseAnon } from '../config/supabase.js';
import supabase from '../config/supabase.js';
import { userRepository, profileRepository } from '../repositories/index.js';
import { generateToken } from '../utils/jwt.js';
import { AppError, UnauthorizedError } from '../utils/errors.js';

export class AuthService {
  async register({ email, password, fullName }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const { data: authData, error: authError } = await supabaseAnon.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (authError) throw new AppError(authError.message, 400);

    const user = await userRepository.createUser({
      id: authData.user.id,
      email,
      full_name: fullName,
      role: 'user',
      is_active: true,
    });

    await profileRepository.create({
      user_id: user.id,
      full_name: fullName,
    });

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    return { user, token };
  }

  async login({ email, password }) {
    const { data: authData, error: authError } = await supabaseAnon.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw new UnauthorizedError('Invalid email or password');

    const user = await userRepository.findByEmail(email);
    if (!user?.is_active) throw new UnauthorizedError('Account is inactive');

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    return { user, token };
  }

  async googleLogin({ accessToken }) {
    const { data: { user: supabaseUser }, error: authError } =
      await supabaseAnon.auth.getUser(accessToken);

    if (authError || !supabaseUser?.email) {
      throw new UnauthorizedError('Google authentication failed');
    }

    let user = await userRepository.findByEmail(supabaseUser.email);

    if (!user) {
      user = await userRepository.createUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        full_name:
          supabaseUser.user_metadata?.full_name ||
          supabaseUser.user_metadata?.name ||
          supabaseUser.email.split('@')[0],
        avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
        role: 'user',
        is_active: true,
        auth_provider: 'google',
      });

      await profileRepository.create({
        user_id: user.id,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
      });
    } else if (!user.is_active) {
      throw new UnauthorizedError('Account is inactive');
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    return { user, token };
  }

  async logout(userId) {
    await supabase.auth.admin.signOut(userId);
    return { message: 'Logged out successfully' };
  }
}

export const authService = new AuthService();
