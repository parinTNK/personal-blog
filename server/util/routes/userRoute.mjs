import express from 'express';
import { getCurrentUser } from '../controllers/userController.mjs';
import { authenticateToken } from '../middleware/authMiddleware.mjs';

const router = express.Router();

// User routes
router.get('/profile', authenticateToken, getCurrentUser);

// Export router
export default router;