import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authenticateToken } from '../middleware/authMiddleware.mjs';
import { uploadImage } from '../controllers/uploadController.mjs';

const router = express.Router();

// กำหนด __dirname สำหรับ ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// กำหนดที่เก็บไฟล์อัปโหลด
const uploadsDir = path.join(__dirname, '../../uploads');

// สร้างโฟลเดอร์ถ้ายังไม่มี
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ตั้งค่า multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limit to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});

// อัพโหลดภาพ
router.post('/', authenticateToken, upload.single('image'), uploadImage);

export default router;