import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.mjs';
import { isAdmin } from '../middleware/adminMiddleware.mjs';
import { updateUserByAdmin, resetPasswordByAdmin } from '../controllers/adminController.mjs';

const router = express.Router();

router.put(
    '/users/:userId',
    authenticateToken,
    isAdmin,
    updateUserByAdmin
);

router.post(
    '/users/:userId/reset-password',
    authenticateToken,
    isAdmin,
    resetPasswordByAdmin
);

export default router;
