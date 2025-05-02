import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ตรวจสอบว่าผู้ใช้กดไลค์โพสต์นี้หรือยัง
export const checkUserLike = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;
    
    console.log("Check like for post:", postId, "by user:", userId);
    
    // ตรวจสอบว่า post มีอยู่จริงหรือไม่
    const post = await prisma.posts.findUnique({
      where: { id: postId }
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const like = await prisma.likes.findFirst({
      where: {
        post_id: postId,
        user_id: userId
      }
    });
    
    res.json({ liked: !!like });
  } catch (error) {
    console.error('Error checking user like:', error);
    res.status(500).json({ error: 'Failed to check like status' });
  }
};

// เพิ่มไลค์
export const likePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;
    
    console.log("Adding like for post:", postId, "by user:", userId);
    
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
    
    // ตรวจสอบว่าเคยไลค์แล้วหรือไม่
    const existingLike = await prisma.likes.findFirst({
      where: {
        post_id: postId,
        user_id: userId
      }
    });

    if (existingLike) {
      return res.status(400).json({ error: 'You already liked this post' });
    }

    // เพิ่มไลค์
    await prisma.likes.create({
      data: {
        post_id: postId,
        user_id: userId
      }
    });

    // อัปเดตจำนวนไลค์ในตาราง posts
    await prisma.posts.update({
      where: { id: postId },
      data: {
        likes_count: {
          increment: 1
        }
      }
    });

    // นับจำนวนไลค์ทั้งหมด
    const likesCount = await prisma.likes.count({
      where: { post_id: postId }
    });

    res.json({ success: true, liked: true, likesCount });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to like post', details: error.message });
  }
};

// ยกเลิกไลค์
export const unlikePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;
    
    console.log("Removing like for post:", postId, "by user:", userId);
    
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

    // ตรวจสอบว่ามีไลค์อยู่หรือไม่ก่อนลบ
    const existingLike = await prisma.likes.findFirst({
      where: {
        post_id: postId,
        user_id: userId
      }
    });
    
    if (!existingLike) {
      return res.status(400).json({ error: 'You have not liked this post' });
    }

    // ลบไลค์
    await prisma.likes.deleteMany({
      where: {
        post_id: postId,
        user_id: userId
      }
    });

    // อัปเดตจำนวนไลค์ในตาราง posts
    await prisma.posts.update({
      where: { id: postId },
      data: {
        likes_count: {
          decrement: 1
        }
      }
    });

    // นับจำนวนไลค์ทั้งหมด
    const likesCount = await prisma.likes.count({
      where: { post_id: postId }
    });

    res.json({ success: true, liked: false, likesCount });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ error: 'Failed to unlike post', details: error.message });
  }
};

// ดึงจำนวนไลค์
export const getLikesCount = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    
    console.log("Getting likes count for post:", postId);
    
    if (!postId || isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    const likesCount = await prisma.likes.count({
      where: { post_id: postId }
    });
    
    res.json({ likesCount });
  } catch (error) {
    console.error('Error fetching likes count:', error);
    res.status(500).json({ error: 'Failed to fetch likes count' });
  }
};