import express from 'express';
import { listUsers, validateAgency } from '../controllers/adminController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticate, isAdmin);

router.get('/users', listUsers);
router.put('/agencies/:id/validate', validateAgency);

export default router;
