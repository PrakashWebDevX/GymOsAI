import { Router } from 'express';
import * as progressController from '../controllers/progressController.js';
import { validate, progressSchemas } from '../validators/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', progressController.getProgress);
router.post('/', validate(progressSchemas.log), progressController.addLog);
router.post('/photos', progressController.addPhoto);
router.get('/weekly-report', progressController.getWeeklyReport);

export default router;
