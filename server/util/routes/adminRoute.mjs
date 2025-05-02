import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.mjs';
import { isAdmin } from '../middleware/adminMiddleware.mjs';
import { updateUserByAdmin, resetPasswordByAdmin } from '../controllers/adminController.mjs';

const router = express.Router();

// แก้ไขมิดเดิลแวร์ isAdmin
// หากต้องการให้ผู้ใช้ปกติอัพเดทโปรไฟล์ของตัวเองได้
router.put(
    '/users/:userId',
    authenticateToken,
    async (req, res, next) => {
        // อนุญาตให้ผู้ใช้อัพเดทข้อมูลของตัวเองได้
        if (req.user.id === req.params.userId) {
            return next();
        }
        // ถ้าไม่ใช่ของตัวเอง ต้องเป็นแอดมินเท่านั้น
        return isAdmin(req, res, next);
    },
    updateUserByAdmin
);

router.post(
    '/users/:userId/reset-password',
    authenticateToken,
    isAdmin,  // ต้องเป็นแอดมินเท่านั้น
    resetPasswordByAdmin
);

export default router;
