import { Router } from 'express';
import menuRoutes from './menuRoutes.js';

const router = Router();

router.use('/menu', menuRoutes);
router.use('/employees', employeeRoutes);
router.use('/auth', authRoutes);

export default router;