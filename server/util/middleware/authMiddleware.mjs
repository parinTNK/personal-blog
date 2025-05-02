import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        console.log("Token verification error:", err.message);
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      
      // ตรวจสอบว่าผู้ใช้ยังมีอยู่ในฐานข้อมูลหรือไม่
      try {
        const user = await prisma.users.findUnique({
          where: { id: payload.id }
        });
        
        if (!user) {
          console.log("User not found:", payload.id);
          return res.status(403).json({ error: 'User not found' });
        }
        
        req.user = payload;
        next();
      } catch (error) {
        console.error("Database error in auth middleware:", error);
        return res.status(500).json({ error: 'Authentication error' });
      }
    });
  } catch (error) {
    console.error("Unexpected error in auth middleware:", error);
    res.status(500).json({ error: 'Authentication error' });
  }
};