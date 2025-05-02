import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ดึงคอมเมนต์ทั้งหมดของโพสต์
export const getComments = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    
    console.log("Getting comments for post:", postId);
    
    if (!postId || isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    // ตรวจสอบว่า post มีอยู่จริงหรือไม่
    const post = await prisma.posts.findUnique({
      where: { id: postId }
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const comments = await prisma.comments.findMany({
      where: {
        post_id: postId
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            profile_pic: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    
    console.log(`Found ${comments.length} comments for post ${postId}`);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// ตรวจสอบ postId ที่รับเข้ามาอย่างถี่ถ้วน

export const addComment = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;
    const { comment_text } = req.body;
    
    console.log("Adding comment to post:", postId, "by user:", userId);
    console.log("Comment data:", req.body);
    
    if (!postId || isNaN(postId)) {
      console.error("Invalid post ID:", req.params.id);
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    if (!comment_text || comment_text.trim() === '') {
      return res.status(400).json({ error: 'Comment text is required' });
    }
    
    // ตรวจสอบว่าบทความมีอยู่จริง
    const post = await prisma.posts.findUnique({
      where: { id: postId }
    });
    
    if (!post) {
      console.error("Post not found:", postId);
      return res.status(404).json({ error: 'Post not found' });
    }
    
    console.log("Adding comment to post:", postId);
    console.log("Comment text:", comment_text);
    
    const comment = await prisma.comments.create({
      data: {
        post_id: postId,
        user_id: userId,
        comment_text
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            profile_pic: true
          }
        }
      }
    });
    
    console.log("Comment created:", comment.id);
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment', details: error.message });
  }
};