import { profileRepository } from '../repositories/index.js';
import supabase from '../config/supabase.js';

export class ProfileService {
  async getProfile(userId) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      return profileRepository.create({ user_id: userId });
    }
    return profile;
  }

  async updateProfile(userId, updates) {
    return profileRepository.upsertByUserId(userId, updates);
  }

  async updateSocialLinks(userId, links) {
    await supabase.from('social_links').delete().eq('user_id', userId);

    if (links.length > 0) {
      const { data, error } = await supabase
        .from('social_links')
        .insert(links.map((link) => ({ user_id: userId, ...link })))
        .select();

      if (error) throw error;
      return data;
    }

    return [];
  }
}

export const profileService = new ProfileService();
