import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './util/db.mjs';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import authRoute from './util/routes/authRoute.mjs';
import moment from 'moment-timezone';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;


const allowedOrigins = [
  process.env.CLIENT_URL,,
  'http://localhost:5173',
];

app.use(cors({
  origin: (origin, callback) => {

    console.log('Request Origin:', origin);
    console.log('Allowed CLIENT_URL:', process.env.CLIENT_URL);
    console.log('Is Origin Allowed?', !origin || allowedOrigins.includes(origin));

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
     
      callback(new Error('Not allowed by CORS'));
    }
  },
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
app.use(cookieParser()); 
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



app.listen(PORT, async  () => {
  await connectToDatabase();
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});


