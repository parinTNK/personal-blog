const generateCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // ใช้ HTTPS ในโหมด production
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 วัน
  });
};

export default generateCookie;