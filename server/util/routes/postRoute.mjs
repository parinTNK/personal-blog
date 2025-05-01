import express from 'express';
import multer from 'multer';
import { createPost, getAllPosts, getPostById, updatePost, deletePost, uploadImage } from '../controllers/postController.mjs';
import { authenticateToken } from '../middleware/authMiddleware.mjs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // เก็บไฟล์ชั่วคราวในโฟลเดอร์ uploads

// Routes
router.get('/', getAllPosts);  // ตรวจสอบว่ามีการลงทะเบียน route นี้หรือไม่
router.get('/:id', getPostById);
router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);

router.post('/upload-image', authenticateToken, upload.single('image'), uploadImage);

// Export router
export default router;