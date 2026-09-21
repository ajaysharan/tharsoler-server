import { Router } from 'express';
import * as settingsController from '../controllers/settingsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin', 'manager'), settingsController.get);
router.put('/', authorize('admin', 'manager'), settingsController.update);
router.post('/test-mail', authorize('admin'), settingsController.testMail);

export default router;
