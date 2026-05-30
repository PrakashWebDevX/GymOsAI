import { Router } from 'express';
import * as profileController from '../controllers/profileController.js';
import { validate, profileSchemas } from '../validators/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', profileController.getProfile);
router.put('/update', validate(profileSchemas.update), profileController.updateProfile);
router.put('/social-links', validate(profileSchemas.socialLinks), profileController.updateSocialLinks);

export default router;
