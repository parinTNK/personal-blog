import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // Get token from Authorization header (Bearer <token>)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token after "Bearer "

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedPayload; // Attach user payload (id, role) to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Invalid token:", error.message);
    // No need to clear cookie anymore
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};