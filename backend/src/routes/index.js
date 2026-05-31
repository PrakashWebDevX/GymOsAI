import { Router } from 'express';
import config from '../config/index.js';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import workoutRoutes from './workoutRoutes.js';
import nutritionRoutes from './nutritionRoutes.js';
import aiRoutes from './aiRoutes.js';
import progressRoutes from './progressRoutes.js';
import achievementRoutes from './achievementRoutes.js';

const router = Router();

router.get('/health', (_req, res) => {
  const hasGemini = Boolean(config.gemini.apiKey && config.gemini.apiKey !== 'your-gemini-api-key');
  res.json({
    success: true,
    message: 'GYMOS AI API is running',
    aiEngine: hasGemini ? 'gemini + local fallback' : 'free built-in (no API key)',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/workout', workoutRoutes);
router.use('/nutrition', nutritionRoutes);
router.use('/ai', aiRoutes);
router.use('/progress', progressRoutes);
router.use('/achievements', achievementRoutes);
router.use('/streaks', achievementRoutes);

export default router;
