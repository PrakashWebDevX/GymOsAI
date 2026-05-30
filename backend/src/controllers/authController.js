import { authService } from '../services/authService.js';
import { asyncHandler, successResponse } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  successResponse(res, result, 'Registration successful', 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  successResponse(res, result, 'Login successful');
});

export const googleLogin = asyncHandler(async (req, res) => {
  const result = await authService.googleLogin(req.body);
  successResponse(res, result, 'Google login successful');
});

export const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.user.userId);
  successResponse(res, result, 'Logout successful');
});
