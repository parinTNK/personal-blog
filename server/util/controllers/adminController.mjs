import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // Needed if password change is added later

const prisma = new PrismaClient();

// User select fields constant for consistency
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
  const { userId } = req.params; // Get user ID from URL parameter
  const { username, name, email, bio } = req.body; // Data to update

  // Basic validation
  if (!username && !name && !email && !bio) {
    return res.status(400).json({ error: 'No update data provided.' });
  }

  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;

    // Check for username/email uniqueness if they are being changed
    if (username || email) {
      const existingUserCheck = await prisma.users.findFirst({
        where: {
          AND: [
            { id: { not: userId } }, // Exclude the current user being updated
            {
              OR: [
                username ? { username: username } : undefined,
                email ? { email: email } : undefined,
              ].filter(Boolean), // Filter out undefined conditions
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

    // Perform the update
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: updateData,
      select: userSelectFields,
    });

    res.status(200).json({ message: 'User updated successfully by admin.', user: updatedUser });

  } catch (error) {
    console.error('Error updating user by admin:', error);
    if (error.code === 'P2025') { // Prisma error code for record not found
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
    // First check if this is admin resetting their own password or another user's
    const isOwnAccount = userId === req.user.id;

    // If admin is resetting their own password, current password must be verified
    if (isOwnAccount && !currentPassword) {
      return res.status(400).json({ error: 'Current password is required when resetting your own password.' });
    }

    // Find the user to reset password
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, password: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // If admin is resetting their own password, verify the current password
    if (isOwnAccount) {
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: 'Password has been reset successfully.' });

  } catch (error) {
    console.error('Error resetting password by admin:', error);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(500).json({ error: 'Failed to reset password.' });
  }
};

// Keep other existing functions like getUserById, etc.