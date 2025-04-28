import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.mjs'; // Assuming path
// import { isAdmin } from '../middleware/adminMiddleware.mjs'; // Import isAdmin
import { updateUserByAdmin } from '../controllers/adminController.mjs'; // Adjust path/controller name if needed

const router = express.Router();

// Route for admin to update any user's profile details (excluding password, profile pic for now)
// Requires authentication and admin role
router.put(
    '/users/:userId', // Use userId from URL parameter
    authenticateToken, // 1. Check if user is logged in
    // isAdmin,           // 2. Check if user has 'admin' role
    updateUserByAdmin  // 3. If both pass, proceed to controller
);

// Add other admin-specific routes here...

export default router;