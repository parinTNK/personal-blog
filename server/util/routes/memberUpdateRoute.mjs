import express from 'express';
import { userEditName, resetPassword } from '../controllers/memberUpdateController.mjs';
import { authenticateToken } from '../middleware/authMiddleware.mjs';

console.log('memberUpdateRoute loaded');

const router = express.Router();

router.put('/edit', authenticateToken, userEditName);
router.put('/reset-password', authenticateToken, resetPassword);

export default router;