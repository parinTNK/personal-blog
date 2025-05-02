import express from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/authController.mjs'; // เพิ่ม getCurrentUser
import { authenticateToken } from '../middleware/authMiddleware.mjs'; // Import middleware

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateToken, getCurrentUser); // เปิดใช้งาน endpoint /me

export default router;

