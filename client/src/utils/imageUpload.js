import axios from 'axios';

const API_BASE_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

/**
 * อัปโหลดรูปภาพไปยัง Cloudinary ผ่าน API
 * @param {File} file - ไฟล์รูปภาพที่ต้องการอัปโหลด
 * @param {Function} onProgress - callback สำหรับการแสดงความคืบหน้า (optional)
 * @returns {Promise<{imageUrl: string, publicId: string}>} - URL และ ID ของรูปภาพที่อัปโหลด
 */
export const uploadImage = async (file, onProgress) => {
  if (!file) throw new Error('No file provided');
  
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  
  // ตรวจสอบประเภทไฟล์
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPG, PNG, GIF and WebP files are allowed');
  }
  
  // ตรวจสอบขนาดไฟล์ (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('Image size should be less than 5MB');
  }
  
  // สร้าง FormData
  const formData = new FormData();
  formData.append('image', file);
  
  // อัปโหลดรูปภาพ
  const response = await axios.post(
    `${API_BASE_URL}/api/upload`,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    }
  );
  
  if (!response.data || !response.data.imageUrl) {
    throw new Error('Invalid response from server');
  }
  
  return {
    imageUrl: response.data.imageUrl,
    publicId: response.data.publicId
  };
};