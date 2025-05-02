import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { userEditName, resetPassword, uploadProfilePicture } from '../controllers/memberUpdateController.mjs';
import { authenticateToken } from '../middleware/authMiddleware.mjs';

const router = express.Router();

// สร้าง directory สำหรับเก็บรูปโปรไฟล์ชั่วคราว
const uploadDir = path.join(process.cwd(), 'uploads/profiles');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ตั้งค่า multer สำหรับเก็บไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `profile-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // อนุญาตเฉพาะไฟล์รูปภาพ
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

router.put('/edit', authenticateToken, userEditName);
router.put('/reset-password', authenticateToken, resetPassword);

// เพิ่ม route สำหรับอัพโหลดรูปโปรไฟล์
router.post('/upload-profile-pic', authenticateToken, upload.single('profileImage'), uploadProfilePicture);

export default router;