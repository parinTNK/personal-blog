import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const userEditName = async (req, res) => {
    const { name, username,  } = req.body;
    const userId = req.user.id; // ดึง user ID จาก token ที่ decode แล้ว

    if (!name && !username) {
        return res.status(400).json({ error: "At least one field (name, username, or password) is required." });
    }

    try {
        const dataToUpdate = {};
        if (name) dataToUpdate.name = name;
        if (username) dataToUpdate.username = username;

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: dataToUpdate,
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                profile_pic: true,
                role: true,
                bio: true,
            },
        });

        res.status(200).json({ message: "User updated successfully.", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user. Please try again later." });
    }
};

const resetPassword = async (req, res) => {
    const {currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.id; // ดึง user ID จาก token ที่ decode แล้ว

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ error: "Current password and new password are required." });
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ error: "New password and confirm new password do not match." });
    }
    try {
        const user = await prisma.users.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Current password is incorrect." });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.users.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Failed to update password. Please try again later." });
    }
}

export { userEditName, resetPassword };

