import { Router } from 'express';
import { createPost, getAllPosts, getPostById, updatePost, deletePost, updatePostById } from '../controllers/postController.mjs';
// หรือตรวจสอบว่าฟังก์ชันชื่ออะไรกันแน่
// อาจจะเป็น:
// import { createPost, getAllPosts, getPostById, updatePost, deletePost } from '../controllers/postController.mjs';
import { authenticateToken } from '../middleware/authMiddleware.mjs';

const router = Router();

// Post routes
router.post('/posts', authenticateToken, createPost);
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', authenticateToken, updatePost);
router.delete('/posts/:id', authenticateToken, deletePost);

// ตรวจสอบว่ามี route สำหรับอัปเดตบทความ
router.put('/:id', authenticateToken, updatePost); // ใช้ updatePost

// หรือถ้ามี function updatePostById อยู่แล้ว ก็ให้ใช้
// router.put('/:id', authenticateToken, updatePostById);

// Export router
export default router;