import { Router } from 'express';
import * as aiController from '../controllers/aiController.js';
import { validate, aiSchemas } from '../validators/index.js';
import { authenticate } from '../middleware/auth.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authenticate);
router.use(aiRateLimiter);

router.post('/analyze-body', validate(aiSchemas.analyzeBody), aiController.analyzeBody);
router.post('/generate-plan', validate(aiSchemas.generatePlan), aiController.generatePlan);
router.post('/recommend-foods', validate(aiSchemas.recommendFoods), aiController.recommendFoods);
router.post('/supplement-advice', validate(aiSchemas.supplementAdvice), aiController.supplementAdvice);

export default router;
