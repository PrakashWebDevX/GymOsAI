import supabase from '../config/supabase.js';
import { NotFoundError } from '../utils/errors.js';

export class BaseRepository {
  constructor(tableName) {
    this.table = tableName;
  }

  async findById(id) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new NotFoundError(`${this.table} not found`);
    return data;
  }

  async findByUserId(userId, options = {}) {
    let query = supabase.from(this.table).select(options.select || '*').eq('user_id', userId);

    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? false });
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async create(record) {
    const { data, error } = await supabase
      .from(this.table)
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id, updates) {
    const { data, error } = await supabase
      .from(this.table)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await supabase.from(this.table).delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}

export class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createUser(userData) {
    return this.create(userData);
  }
}

export class ProfileRepository extends BaseRepository {
  constructor() {
    super('profiles');
  }

  async findByUserId(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, social_links(*)')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async upsertByUserId(userId, profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ user_id: userId, ...profileData, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export class WorkoutRepository extends BaseRepository {
  constructor() {
    super('workout_plans');
  }

  async getHistory(userId, limit = 20) {
    return this.findByUserId(userId, { orderBy: 'created_at', limit });
  }
}

export class NutritionRepository extends BaseRepository {
  constructor() {
    super('nutrition_plans');
  }

  async getHistory(userId, limit = 20) {
    return this.findByUserId(userId, { orderBy: 'created_at', limit });
  }

  async getActiveMealPlan(userId) {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
}

export class ProgressRepository extends BaseRepository {
  constructor() {
    super('progress_logs');
  }

  async getLogs(userId, limit = 30) {
    return this.findByUserId(userId, { orderBy: 'logged_at', limit });
  }

  async getPhotos(userId) {
    const { data, error } = await supabase
      .from('progress_photos')
      .select('*')
      .eq('user_id', userId)
      .order('taken_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async addPhoto(userId, photoData) {
    const { data, error } = await supabase
      .from('progress_photos')
      .insert({ user_id: userId, ...photoData })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export class AchievementRepository extends BaseRepository {
  constructor() {
    super('achievements');
  }

  async getUserAchievements(userId) {
    return this.findByUserId(userId, { orderBy: 'earned_at' });
  }
}

export class StreakRepository extends BaseRepository {
  constructor() {
    super('streaks');
  }

  async getUserStreaks(userId) {
    return this.findByUserId(userId);
  }

  async updateStreak(userId, streakType, increment = true) {
    const { data: existing } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('streak_type', streakType)
      .single();

    if (existing) {
      const newCount = increment ? existing.current_count + 1 : 0;
      return this.update(existing.id, {
        current_count: newCount,
        longest_count: Math.max(existing.longest_count, newCount),
        last_activity: new Date().toISOString(),
      });
    }

    return this.create({
      user_id: userId,
      streak_type: streakType,
      current_count: 1,
      longest_count: 1,
      last_activity: new Date().toISOString(),
    });
  }
}

export const userRepository = new UserRepository();
export const profileRepository = new ProfileRepository();
export const workoutRepository = new WorkoutRepository();
export const nutritionRepository = new NutritionRepository();
export const progressRepository = new ProgressRepository();
export const achievementRepository = new AchievementRepository();
export const streakRepository = new StreakRepository();
