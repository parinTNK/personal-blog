import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.mjs';
import { isAdmin } from '../middleware/adminMiddleware.mjs';
import { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController.mjs';

const router = express.Router();

// Public route - anyone can view categories
router.get('/', getAllCategories);

// Admin routes - protected
router.post('/', authenticateToken, isAdmin, createCategory);
router.put('/:id', authenticateToken, isAdmin, updateCategory);
router.delete('/:id', authenticateToken, isAdmin, deleteCategory);

export default router;