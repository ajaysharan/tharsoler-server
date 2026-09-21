import { Router } from 'express';
import * as mailController from '../controllers/mailController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/send', authenticate, mailController.compose);

export default router;
