import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// ตั้งค่า Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (req, res) => {
  try {
    console.log('Upload image request received');
    
    // ตรวจสอบว่ามีไฟล์ถูกอัปโหลดมาหรือไม่
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File received:', req.file);

    try {
      // อัปโหลดไฟล์ไปยัง Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'personal-blog', // ชื่อโฟลเดอร์ใน Cloudinary
      });

      console.log('Cloudinary upload result:', result);

      // ลบไฟล์ที่อัปโหลดในเครื่องหลังจากอัปโหลดสำเร็จ
      fs.unlinkSync(req.file.path);

      // ส่ง URL ของรูปภาพกลับไป
      res.status(200).json({
        message: 'Image uploaded successfully',
        imageUrl: result.secure_url, // URL ของรูปภาพ
        publicId: result.public_id, // ใช้สำหรับลบรูปภาพในอนาคต
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      return res.status(500).json({ error: 'Failed to upload to Cloudinary' });
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};