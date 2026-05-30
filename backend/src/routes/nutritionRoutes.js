import { Router } from 'express';
import * as nutritionController from '../controllers/nutritionController.js';
import { validate, nutritionSchemas } from '../validators/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/generate', validate(nutritionSchemas.generate), nutritionController.generatePlan);
router.get('/history', nutritionController.getHistory);
router.get('/meal-plan', nutritionController.getMealPlan);

export default router;
