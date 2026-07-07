import mongoose from 'mongoose';

const DB_NAME = 'college-resource-hub';

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 5000
    });

    console.log(`MongoDB connected successfully to database: ${DB_NAME}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
