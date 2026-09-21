import { Router } from 'express';
import authRoutes from './auth.routes.js';
import publicRoutes from './public.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import settingsRoutes from './settings.routes.js';
import usersRoutes from './users.routes.js';
import notificationsRoutes from './notifications.routes.js';
import uploadRoutes from './upload.routes.js';
import mailRoutes from './mail.routes.js';
import { createCrudRouter } from './crud.routes.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ ok: true, service: 'thar-solar-api' }));

router.use('/public', publicRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/settings', settingsRoutes);
router.use('/users', usersRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/upload', uploadRoutes);
router.use('/mail', mailRoutes);

router.use('/inquiries', createCrudRouter('inquiries'));
router.use('/customers', createCrudRouter('customers'));
router.use('/quotes', createCrudRouter('quotes'));
router.use('/projects', createCrudRouter('projects'));
router.use('/products', createCrudRouter('products'));
router.use('/services', createCrudRouter('services'));
router.use('/brands', createCrudRouter('brands'));
router.use('/banners', createCrudRouter('banners'));
router.use('/activity', createCrudRouter('activity'));

export default router;
