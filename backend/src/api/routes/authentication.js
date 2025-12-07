import { Router } from 'express';
import { googleAuth, refreshToken } from '../controllers/authentication.js';

const router = Router();

router.post('/', googleAuth);
router.post('/refresh-token', refreshToken);

export default router;