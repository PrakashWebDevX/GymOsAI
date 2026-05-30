import { Router } from 'express';
import * as achievementController from '../controllers/achievementController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', achievementController.getAchievements);
router.get('/streaks', achievementController.getStreaks);

export default router;
