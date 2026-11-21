const mongoose = require('mongoose');

const getMongoUri = () => {
  let uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) return null;

  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;

  if (username && password) {
    if (uri.includes('<username>') || uri.includes('<password>')) {
      uri = uri
        .replace('<username>', encodeURIComponent(username))
        .replace('<password>', encodeURIComponent(password));
    } else if (!uri.includes('@')) {
      // If uri format is mongodb+srv://cluster.mongodb.net/dbname without credentials
      if (uri.startsWith('mongodb+srv://')) {
        uri = 'mongodb+srv://' + encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@' + uri.slice('mongodb+srv://'.length);
      } else if (uri.startsWith('mongodb://')) {
        uri = 'mongodb://' + encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@' + uri.slice('mongodb://'.length);
      }
    }
  }

  return uri;
};

const connectDB = async () => {
  // If already connected or connecting, reuse connection (essential for serverless like Vercel)
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const mongoUri = getMongoUri();
  if (!mongoUri) {
    throw new Error('Neither MONGO_URI nor MONGODB_URI environment variable is configured in Vercel.');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
