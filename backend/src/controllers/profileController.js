import { profileService } from '../services/profileService.js';
import { asyncHandler, successResponse } from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getProfile(req.user.userId);
  successResponse(res, profile, 'Profile retrieved');
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.updateProfile(req.user.userId, req.body);
  successResponse(res, profile, 'Profile updated');
});

export const updateSocialLinks = asyncHandler(async (req, res) => {
  const links = await profileService.updateSocialLinks(req.user.userId, req.body.links);
  successResponse(res, links, 'Social links updated');
});
