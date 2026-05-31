import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { UnauthorizedError } from '../utils/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import supabase from '../config/supabase.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role, is_active')
      .eq('id', decoded.userId)
      .single();

    if (error || !user || !user.is_active) {
      throw new UnauthorizedError('Invalid or inactive user');
    }

    req.user = { ...decoded, ...user, userId: user.id || decoded.userId };
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
});

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
  } catch {
    // Optional auth - continue without user
  }

  next();
});
