import express from 'express';
import multer from 'multer';
import { 
  createPost, 
  getAllPosts, 
  getPostById, 
  updatePost, 
  deletePost, 
  uploadImage,
  getPublicPosts 
} from '../controllers/postController.mjs';
import { authenticateToken } from '../middleware/authMiddleware.mjs';
// import controllers สำหรับ like และ comment
import { 
  checkUserLike, 
  likePost, 
  unlikePost,
  getLikesCount
} from '../controllers/likeController.mjs';
import { 
  getComments, 
  addComment 
} from '../controllers/commentController.mjs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// API สำหรับหน้าเว็บสาธารณะ
router.get('/public', getPublicPosts);

// Routes สำหรับบทความ
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);

router.post('/upload-image', authenticateToken, upload.single('image'), uploadImage);

// เพิ่ม routes สำหรับระบบ Like (เพิ่ม explicit log เพื่อช่วยในการ debug)
router.get('/:id/check-like', authenticateToken, (req, res, next) => {
  console.log(`Check like route called for post ${req.params.id} by user ${req.user?.id}`);
  next();
}, checkUserLike);

router.post('/:id/like', authenticateToken, (req, res, next) => {
  console.log(`Like route called for post ${req.params.id} by user ${req.user?.id}`);
  next();
}, likePost);

router.post('/:id/unlike', authenticateToken, (req, res, next) => {
  console.log(`Unlike route called for post ${req.params.id} by user ${req.user?.id}`);
  next();
}, unlikePost);

router.get('/:id/likes-count', (req, res, next) => {
  console.log(`Get likes count route called for post ${req.params.id}`);
  next();
}, getLikesCount);

// เพิ่ม routes สำหรับระบบ Comment
router.get('/:id/comments', (req, res, next) => {
  console.log(`Get comments route called for post ${req.params.id}`);
  next();
}, getComments);

router.post('/:id/comments', authenticateToken, (req, res, next) => {
  console.log(`Add comment route called for post ${req.params.id} by user ${req.user?.id}`);
  console.log('Comment data:', req.body);
  next();
}, addComment);

export default router;