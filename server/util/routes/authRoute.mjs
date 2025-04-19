import express from 'express';
import { register, login, logout } from '../controllers/authController.mjs';
import authenticateToken from '../middleware/authMiddleware.mjs';

const router = express.Router();


router.post('/register', register);


router.post('/login', login);


router.post('/logout', logout);


router.get('/profile', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Profile data', user: req.user });
});

export default router;

