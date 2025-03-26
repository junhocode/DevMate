import { InternalServerError } from '../errors/httpError';

const mongoose = require('mongoose');

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw new InternalServerError('몽고 DB 연결에 실패했습니다');
  }
};

export default connectDB;
