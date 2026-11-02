import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

export const initializeDatabase = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set. Add your MongoDB connection string to the environment.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Error during database initialization:', error.message);
    process.exit(1);
  }
};

export const closeDatabase = () => mongoose.disconnect();
