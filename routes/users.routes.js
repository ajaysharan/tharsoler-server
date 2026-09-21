import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', userController.list);
router.post('/', authorize('admin'), userController.create);
router.patch('/:id', authorize('admin'), userController.update);
router.delete('/', authorize('admin'), userController.removeMany);

export default router;
