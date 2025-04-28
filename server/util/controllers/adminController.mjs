import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // Needed if password change is added later

const prisma = new PrismaClient();

// --- Add this new function ---
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
      select: { // Select fields to return (exclude password)
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        profile_pic: true,
        bio: true, // Include bio if it's in your schema
      },
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
// --- End of new function ---

// Keep other existing functions like getUserById, etc.