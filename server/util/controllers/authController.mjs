import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import generateCookie from '../helpers/cookieHelper.mjs';

const prisma = new PrismaClient();

const userSelectFields = {
  id: true,
  email: true,
  username: true,
  name: true,
  role: true,
};


const register = async (req, res) => {
  const { email, password, username, name } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password, and username are required.' });
  }

  try {
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return res.status(400).json({ error: `${field} already exists.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        username,
        name: name || username,
        role: 'user',
      },
      select: userSelectFields,
    });


    res.status(201).json({ message: 'User registered successfully.', user: newUser });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user. Please try again later.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const tokenPayload = { id: user.id, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    generateCookie(res, token);

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      message: 'Login successful.',
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        username: userWithoutPassword.username,
        name: userWithoutPassword.name,
        role: userWithoutPassword.role,
      }
    });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to log in. Please try again later.' });
  }
};

const logout = (req, res) => {
  res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
  });
  res.status(200).json({ message: 'Logout successful.' });
};


const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: userSelectFields,
    });

    if (!user) {
      res.clearCookie('token');
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ user });

  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Failed to fetch user data.' });
  }
};

export { register, login, logout, getCurrentUser };