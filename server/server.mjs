import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './util/db.mjs';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors({
  origin: NODE_ENV === 'production' ? 'CLIENT_URL' : '*',
}));
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());

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

app.listen(PORT, () => {
  connectToDatabase();
  console.log(`Server is running on ${NODE_ENV} mode`);
});

