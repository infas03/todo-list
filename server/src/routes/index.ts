import { Router } from 'express';
import authRoutes from '../api/auth/routes';
import taskRoutes from '../api/tasks/routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export default router;