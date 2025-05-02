import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './util/db.mjs';
import { PrismaClient } from '@prisma/client';
import authRoute from './util/routes/authRoute.mjs';
import moment from 'moment-timezone';
import memberUpdateRoute from './util/routes/memberUpdateRoute.mjs';
import adminRoutes from './util/routes/adminRoute.mjs'; // Import admin routes
import categoryRoutes from './util/routes/categoryRoute.mjs';
import postRoutes from './util/routes/postRoute.mjs';
import userRoutes from './util/routes/userRoute.mjs';
import uploadRoutes from './util/routes/uploadRoute.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
];

app.use(cors({
  origin: '*',
  credentials: true
}));

morgan.token('date', (req, res) => {
  return moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
});

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else if (NODE_ENV === 'production') {
  app.use(morgan(':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
}

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

const prisma = new PrismaClient();

app.get('/', async (req, res) => {
  try {
    const users = await prisma.posts.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.use('/api/auth', authRoute);
app.use('/api/member', memberUpdateRoute);
app.use('/api/admin', adminRoutes); // Mount admin routes under /api/admin
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);
app.use('/api/upload', uploadRoutes);

app.listen(PORT, async  () => {
  await connectToDatabase();
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});


