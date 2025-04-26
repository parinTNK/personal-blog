import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {

    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedPayload;
    next();
  } catch (error) {
    console.error("Invalid token:", error.message);

    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
    });

    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};