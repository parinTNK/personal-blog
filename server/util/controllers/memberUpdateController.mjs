import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import path from 'path';
import fs from 'fs';

// เพิ่มการนำเข้า cloudinary หากต้องการใช้
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

// ตั้งค่า Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const userEditName = async (req, res) => {
    const { name, username, profile_pic } = req.body;
    const userId = req.user.id;

    if (!name && !username && !profile_pic) {
        return res.status(400).json({ error: "At least one field (name, username, or profile_pic) is required." });
    }

    try {
        // ตรวจสอบว่า username ซ้ำหรือไม่
        if (username) {
            const existingUser = await prisma.users.findFirst({
                where: {
                    username,
                    id: { not: userId }
                }
            });

            if (existingUser) {
                return res.status(400).json({ error: 'Username already exists' });
            }
        }

        const dataToUpdate = {};
        if (name) dataToUpdate.name = name;
        if (username) dataToUpdate.username = username;
        if (profile_pic) dataToUpdate.profile_pic = profile_pic;

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: dataToUpdate,
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                profile_pic: true,
                role: true,
                bio: true,
            },
        });

        res.status(200).json({ message: "User updated successfully.", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user. Please try again later." });
    }
};

const resetPassword = async (req, res) => {
    const {currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.id; // ดึง user ID จาก token ที่ decode แล้ว

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ error: "Current password and new password are required." });
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ error: "New password and confirm new password do not match." });
    }
    try {
        const user = await prisma.users.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Current password is incorrect." });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.users.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Failed to update password. Please try again later." });
    }
};

// เพิ่มฟังก์ชันอัพโหลดรูปโปรไฟล์
const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // อัพโหลดไฟล์ไปยัง Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'profile_pics',
            transformation: [
                { width: 500, height: 500, crop: 'limit' },
                { quality: 'auto' }
            ]
        });

        // ลบไฟล์หลังจากอัพโหลดเสร็จ
        fs.unlinkSync(req.file.path);

        // อัพเดท profile_pic ในฐานข้อมูล
        const updatedUser = await prisma.users.update({
            where: { id: req.user.id },
            data: { profile_pic: result.secure_url },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                profile_pic: true,
                role: true,
                bio: true,
            },
        });

        res.json({ 
            imageUrl: result.secure_url,
            user: updatedUser
        });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        // ลบไฟล์ที่อัพโหลดถ้าเกิดข้อผิดพลาด
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to upload profile picture' });
    }
};

export { userEditName, resetPassword, uploadProfilePicture };

