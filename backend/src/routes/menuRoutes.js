import { Router } from 'express';
import * as menuController from '../controllers/menuController.js';

const router = Router();

router.get('/', menuController.getMenu);
router.post('/', menuController.createMenuItem);

export default router;