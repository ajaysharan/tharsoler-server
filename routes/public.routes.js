import { Router } from 'express';
import * as publicController from '../controllers/publicController.js';

const router = Router();

router.get('/site', publicController.getSite);
router.post('/inquiries', publicController.createInquiry);

export default router;
