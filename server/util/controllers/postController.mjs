import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const createPost = async (req, res) => {
  try {
    const { title, content, category_id, image, description, status_id } = req.body;

    const finalStatusId = status_id ? parseInt(status_id) : 1;

    const post = await prisma.posts.create({
      data: {
        title,
        content,
        category_id: parseInt(category_id),
        image: image || null,
        description: description || null,
        status_id: finalStatusId,
        author_id: req.user.id
      }
    });

    res.status(201).json({ 
      message: 'Post created successfully',
      post
    });
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
    
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch posts' });
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
