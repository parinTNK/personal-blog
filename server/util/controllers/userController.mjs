import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    // ดึง user ID จาก req.user ที่เพิ่มโดย middleware authenticateToken
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profile_pic: true,
        role: true,
        bio: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};