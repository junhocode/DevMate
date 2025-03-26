import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoute from './routes/userRoute';
import postRoute from './routes/postRoute';
import commentRoutes from './routes/commentRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import alarmRoute from './routes/alarmRoute';
import { sendSSE, sseHandler } from './utils/sse';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    allowedHeaders:
      'Authorization, Content-Type, authtoken, accessToken, refreshToken ',
    credentials: true,
  })
);
app.use(cookieParser());

const initializeServer = async () => {
  try {
    await connectDB();
    console.log('Database connected. Starting server');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server : ', error);
  }
};
app.use('/alarm', alarmRoute);
app.use('/auth', userRoute);
app.use('/comments', commentRoutes);
app.use('/boards/:boardId/posts', postRoute);

app.get('/events/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  sseHandler(req, res);
  sendSSE(userId, 'sse 연결 성공');
});

initializeServer();
