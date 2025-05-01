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
    
    // ตรวจสอบว่า id ถูกส่งมาหรือไม่
    if (!id) {
      return res.status(400).json({ error: 'Post ID is required' });
    }
    
    // ดึงข้อมูลบทความและข้อมูลที่เกี่ยวข้อง
    const post = await prisma.posts.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        categories: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_pic: true,
            bio: true
          }
        }
      }
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // สร้างข้อมูลในรูปแบบที่ต้องการส่งกลับ
    const formattedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      description: post.description || '',
      category: post.categories?.name || 'Uncategorized',
      category_id: post.category_id,
      image: post.image || null,
      date: post.date || new Date(),
      author: post.author ? {
        id: post.author.id,
        name: post.author.name || 'Unknown',
        username: post.author.username || '',
        profile_pic: post.author.profile_pic || null,
        bio: post.author.bio || 'No bio available'
      } : {
        id: 0,
        name: 'Unknown',
        username: '',
        profile_pic: null,
        bio: 'No bio available'
      }
    };
    
    res.json(formattedPost);
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    res.status(500).json({ error: 'Failed to fetch post', details: error.message });
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

export const getPublicPosts = async (req, res) => {
  try {
    const { page = 1, limit = 6, category_id, search } = req.query;
    
    // แปลงค่าให้เป็นตัวเลข
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // สร้างเงื่อนไขสำหรับ query
    const whereConditions = {
      status_id: 2, // เฉพาะบทความที่เผยแพร่แล้วเท่านั้น (published)
    };
    
    // กรองตามหมวดหมู่ถ้ามีการระบุ
    if (category_id && category_id !== 'null') {
      whereConditions.category_id = parseInt(category_id);
    }
    
    // ค้นหาในชื่อและคำอธิบาย
    if (search) {
      whereConditions.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    console.log('Query conditions:', whereConditions);
    
    // Query ข้อมูลบทความพร้อมข้อมูลที่เกี่ยวข้อง
    const posts = await prisma.posts.findMany({
      where: whereConditions,
      include: {
        categories: true, // ข้อมูลหมวดหมู่
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_pic: true,
          },
        },
      },
      orderBy: {
        date: 'desc', // เรียงจากใหม่ไปเก่า
      },
      skip,
      take: limitNum,
    });
    
    console.log('Found posts:', posts.length);
    
    // นับจำนวนบทความทั้งหมดตามเงื่อนไข
    const total = await prisma.posts.count({ where: whereConditions });
    
    // แปลงข้อมูลก่อนส่งกลับ และตรวจสอบว่า author ไม่เป็น null
    const formattedPosts = posts.map(post => {
      // ตรวจสอบว่ามี author หรือไม่
      let authorData;
      if (post.author) {
        authorData = {
          id: post.author.id,
          name: post.author.name || 'Unknown',
          username: post.author.username || '',
          profile_pic: post.author.profile_pic || null
        };
      } else {
        authorData = {
          id: 0,
          name: 'Unknown',
          username: '',
          profile_pic: null
        };
      }
      
      return {
        id: post.id,
        title: post.title,
        description: post.description || '',
        category: post.categories?.name || 'Uncategorized',
        category_id: post.category_id,
        image: post.image || null,
        date: post.date || new Date(),
        author: authorData
      };
    });
    
    // ส่งข้อมูลกลับ
    res.json({
      posts: formattedPosts,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
    
  } catch (error) {
    console.error('Error fetching public posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
  }
};
