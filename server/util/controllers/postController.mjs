import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import cloudinary from '../cloudinaryConfig.mjs';
import fs from 'fs';

const prisma = new PrismaClient();

export const createPost = async (req, res) => {
  try {
    const { title, content, category_id, description, status_id, imageUrl, image } = req.body;
    
    // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ได้รับ
    console.log('Creating post with data:', req.body);
    console.log('Image URL received:', imageUrl || image);
    
    // ใช้ค่า imageUrl หรือ image ตามที่ส่งมา
    const finalImageUrl = imageUrl || image || null;
    
    const post = await prisma.posts.create({
      data: {
        title,
        content,
        category_id: parseInt(category_id),
        description: description || null,
        status_id: parseInt(status_id),
        image: finalImageUrl, // ตรวจสอบว่าใช้ชื่อฟิลด์ตรงกับ schema
        author_id: req.user.id,
      },
    });
    
    console.log('Post created with image:', post.image);
    
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        categories: true,
        statuses: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_pic: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    res.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const postId = parseInt(id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    const post = await prisma.posts.findUnique({
      where: { id: postId },
      include: {
        categories: true,
        statuses: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_pic: true
          }
        }
      }
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.status(200).json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

export const updatePostById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category_id, image, description, status_id } = req.body;

    const post = await prisma.posts.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        category_id: category_id ? parseInt(category_id) : undefined,
        image: image !== undefined ? image : undefined,
        description: description !== undefined ? description : undefined,
        status_id: status_id ? parseInt(status_id) : undefined,
      }
    });

    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post', details: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category_id, image, description, status_id } = req.body;

    const updateData = {};
    
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (category_id !== undefined) updateData.category_id = parseInt(category_id);
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;
    if (status_id !== undefined) updateData.status_id = parseInt(status_id);

    const updatedPost = await prisma.posts.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        categories: true,
        statuses: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_pic: true
          }
        }
      }
    });

    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post', details: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const postId = parseInt(id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    const existingPost = await prisma.posts.findUnique({
      where: { id: postId }
    });
    
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    await prisma.posts.delete({
      where: { id: postId }
    });
    
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cannot delete post because it has related comments or likes' });
    }
    
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

export const uploadImage = async (req, res) => {
  try {
    console.log('Upload image request received');
    console.log('Request file:', req.file);
    
    // ตรวจสอบว่ามีไฟล์ถูกอัปโหลดมาหรือไม่
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // อัปโหลดไฟล์ไปยัง Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'personal-blog', // ชื่อโฟลเดอร์ใน Cloudinary
    });

    // ลบไฟล์ที่อัปโหลดในเครื่องหลังจากอัปโหลดสำเร็จ
    fs.unlinkSync(req.file.path);

    // ส่ง URL ของรูปภาพกลับไป
    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url, // URL ของรูปภาพ
      publicId: result.public_id, // ใช้สำหรับลบรูปภาพในอนาคต
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};
