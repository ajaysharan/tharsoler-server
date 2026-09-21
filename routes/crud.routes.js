import { Router } from 'express';
import { createCrudController } from '../controllers/crudController.js';
import { authenticate } from '../middleware/auth.js';

export function createCrudRouter(resourceKey, { readOnly = false } = {}) {
  const router = Router();
  const ctrl = createCrudController(resourceKey);

  router.use(authenticate);
  router.get('/', ctrl.list);

  if (!readOnly) {
    router.post('/', ctrl.create);
    router.patch('/:id', ctrl.update);
    router.delete('/', ctrl.removeMany);
  }

  return router;
}
