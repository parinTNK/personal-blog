export const isAdmin = (req, res, next) => {
  // console.log('isAdmin Middleware - req.user:', req.user);

  if (req.user && req.user.role === 'admin') {
    // console.log('isAdmin Middleware: Access Granted');
    next(); // User is admin, proceed
  } else {
    // console.log('isAdmin Middleware: Access Denied. Role:', req.user?.role);
    res.status(403).json({ error: 'Forbidden: Administrator access required.' });
  }
};
