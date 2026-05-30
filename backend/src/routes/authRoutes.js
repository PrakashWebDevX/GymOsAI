import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validate, authSchemas } from '../validators/index.js';
import { authenticate } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authRateLimiter, validate(authSchemas.register), authController.register);
router.post('/login', authRateLimiter, validate(authSchemas.login), authController.login);
router.post('/google', authRateLimiter, validate(authSchemas.google), authController.googleLogin);
router.post('/logout', authenticate, authController.logout);

export default router;
