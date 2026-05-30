import { Router } from 'express';
import * as workoutController from '../controllers/workoutController.js';
import { validate, workoutSchemas } from '../validators/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/generate', validate(workoutSchemas.generate), workoutController.generateWorkout);
router.get('/history', workoutController.getHistory);
router.put('/update', validate(workoutSchemas.update), workoutController.updateWorkout);

export default router;
