import { Router } from 'express';
import { googleAuth, refreshToken, authMe } from '../controllers/authentication.js';

const router = Router();

router.post('/', googleAuth);
router.post('/refresh-token', refreshToken);
router.get('/me', authMe);

export default router;