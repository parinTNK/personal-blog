import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import generateCookie from '../helpers/cookieHelper.mjs';

const prisma = new PrismaClient();

// Define fields to select for user data to avoid exposing sensitive info
const userSelectFields = {
  id: true,
  email: true,
  username: true,
  name: true,
  role: true,
};

/**
 * Handles user registration.
 */
const register = async (req, res) => {
  const { email, password, username, name } = req.body;

  // Basic validation (can be expanded with libraries like Joi or express-validator)
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password, and username are required.' });
  }

  try {
    // Check if email or username already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return res.status(400).json({ error: `${field} already exists.` });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        username,
        name: name || username, // Default name to username if not provided
        role: 'user', // Default role
      },
      select: userSelectFields, // Select only safe fields to return
    });

    // Respond with success message and selected user data
    res.status(201).json({ message: 'User registered successfully.', user: newUser });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user. Please try again later.' });
  }
};

/**
 * Handles user login.
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Find user by email
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      // Use a generic message for security (don't reveal if email exists)
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Compare provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT token containing user ID and role
    const tokenPayload = { id: user.id, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '1d', // Token expires in 1 day
    });

    // Set the token as an HTTP-only cookie
    generateCookie(res, token);

    // Respond with success message and selected user data
    // Exclude password from the returned user object
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      message: 'Login successful.',
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        username: userWithoutPassword.username,
        name: userWithoutPassword.name,
        role: userWithoutPassword.role,
      } // Explicitly select fields again or use the spread syntax carefully
    });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to log in. Please try again later.' });
  }
};

/**
 * Handles user logout by clearing the token cookie.
 */
const logout = (req, res) => {
  // Clear the 'token' cookie
  res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      // path: '/' // Optional: specify path if needed
  });
  res.status(200).json({ message: 'Logout successful.' });
};

/**
 * Gets the current user's data based on the validated token.
 */
const getCurrentUser = async (req, res) => {
  try {
    // User ID is attached to req.user by the authenticateToken middleware
    const userId = req.user?.id;

    if (!userId) {
        // This should technically not happen if authenticateToken runs first
        return res.status(401).json({ error: 'Authentication required.' });
    }

    // Fetch user data using the predefined selection
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: userSelectFields,
    });

    if (!user) {
      // If user associated with token doesn't exist anymore
      res.clearCookie('token');
      return res.status(404).json({ error: 'User not found.' });
    }

    // Respond with the user data
    res.status(200).json({ user });

  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Failed to fetch user data.' });
  }
};

export { register, login, logout, getCurrentUser };