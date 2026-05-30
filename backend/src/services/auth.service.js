import { supabaseAdmin } from '../config/supabase.js';
import { generateToken } from '../utils/jwt.js';
import { UnauthorizedError, ValidationError } from '../utils/errors.js';
import { userRepo, profileRepo } from '../repositories/index.js';

export const authService = {
  async register({ email, password, fullName }) {
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new ValidationError('Email already registered');

    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) throw new ValidationError(error.message);

    const token = generateToken({ userId: data.user.id, email: data.user.email });
    return { user: { id: data.user.id, email: data.user.email }, token };
  },

  async login({ email, password }) {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    if (error) throw new UnauthorizedError('Invalid email or password');

    const token = generateToken({ userId: data.user.id, email: data.user.email });
    return { user: { id: data.user.id, email: data.user.email }, token, session: data.session };
  },

  async googleLogin({ idToken }) {
    const { data, error } = await supabaseAdmin.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    if (error) throw new UnauthorizedError('Google authentication failed');

    const token = generateToken({ userId: data.user.id, email: data.user.email });
    return { user: { id: data.user.id, email: data.user.email }, token, session: data.session };
  },

  async logout(userId) {
    await supabaseAdmin.auth.admin.signOut(userId);
    return { message: 'Logged out successfully' };
  },
};

export const profileService = {
  async getProfile(userId) {
    const profile = await profileRepo.findByUserId(userId);
    const user = await userRepo.findById(userId);
    return { ...profile, email: user.email };
  },

  async updateProfile(userId, data) {
    const mapped = {
      full_name: data.fullName,
      bio: data.bio,
      date_of_birth: data.dateOfBirth,
      gender: data.gender,
      height_cm: data.heightCm,
      weight_kg: data.weightKg,
      fitness_level: data.fitnessLevel,
      activity_level: data.activityLevel,
      timezone: data.timezone,
    };
    const cleaned = Object.fromEntries(
      Object.entries(mapped).filter(([, v]) => v !== undefined)
    );
    return profileRepo.upsertByUserId(userId, cleaned);
  },
};
