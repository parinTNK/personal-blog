import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const userSelectFields = {
  id: true,
  email: true,
  username: true,
  name: true,
  role: true,
  profile_pic: true,
  bio: true,
};

export const updateUserByAdmin = async (req, res) => {
  const { userId } = req.params;
  const { username, name, email, bio } = req.body;

  if (!username && !name && !email && !bio) {
    return res.status(400).json({ error: 'No update data provided.' });
  }

  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;

    if (username || email) {
      const existingUserCheck = await prisma.users.findFirst({
        where: {
          AND: [
            { id: { not: userId } },
            {
              OR: [
                username ? { username: username } : undefined,
                email ? { email: email } : undefined,
              ].filter(Boolean),
            },
          ],
        },
      });

      if (existingUserCheck) {
        const field = existingUserCheck.username === username ? 'Username' : 'Email';
        return res.status(400).json({ error: `${field} is already taken by another user.` });
      }

      if (username) updateData.username = username;
      if (email) updateData.email = email;
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: updateData,
      select: userSelectFields,
    });

    res.status(200).json({ message: 'User updated successfully by admin.', user: updatedUser });

  } catch (error) {
    console.error('Error updating user by admin:', error);
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'User not found.' });
    }
    res.status(500).json({ error: 'Failed to update user.' });
  }
};

export const resetPasswordByAdmin = async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  try {
    const isOwnAccount = userId === req.user.id;

    if (isOwnAccount && !currentPassword) {
      return res.status(400).json({ error: 'Current password is required when resetting your own password.' });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, password: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (isOwnAccount) {
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: 'Password has been reset successfully.' });

  } catch (error) {
    console.error('Error resetting password by admin:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(500).json({ error: 'Failed to reset password.' });
  }
};
