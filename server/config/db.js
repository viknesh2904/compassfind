const mongoose = require('mongoose');

const connectDB = async () => {
  // If already connected or connecting, reuse connection (essential for serverless like Vercel)
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.warn('Warning: MONGO_URI is not set in environment variables.');
      return;
    }

    const conn = await mongoose.connect(mongoUri);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // In serverless environments (Vercel), don't kill the worker process
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
