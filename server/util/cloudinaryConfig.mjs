import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // จาก Dashboard
  api_key: process.env.CLOUDINARY_API_KEY,       // จาก Dashboard
  api_secret: process.env.CLOUDINARY_API_SECRET, // จาก Dashboard
});

export default cloudinary;