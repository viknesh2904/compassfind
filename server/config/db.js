const mongoose = require('mongoose');

const safeEncode = (str) => {
  if (!str) return '';
  try {
    return encodeURIComponent(decodeURIComponent(str));
  } catch (e) {
    return encodeURIComponent(str);
  }
};

const sanitizeMongoUri = (rawUri) => {
  if (!rawUri) return null;
  let uri = rawUri.trim();

  // Handle case where password inside uri contains unescaped special characters (@, #, etc.)
  const schemeMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/);
  if (schemeMatch) {
    const scheme = schemeMatch[1];
    const rest = schemeMatch[2];

    const lastAt = rest.lastIndexOf('@');
    if (lastAt !== -1) {
      const userPass = rest.slice(0, lastAt);
      const hostAndQuery = rest.slice(lastAt + 1);

      const firstColon = userPass.indexOf(':');
      if (firstColon !== -1) {
        const user = userPass.slice(0, firstColon);
        const pass = userPass.slice(firstColon + 1);
        uri = `${scheme}${safeEncode(user)}:${safeEncode(pass)}@${hostAndQuery}`;
      }
    }
  }

  // Ensure authSource=admin is specified for Atlas cloud clusters
  if (uri.includes('mongodb.net') && !uri.includes('authSource=')) {
    uri += (uri.includes('?') ? '&' : '?') + 'authSource=admin';
  }

  return uri;
};

const getMongoUri = () => {
  let uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) return null;

  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;

  if (username && password) {
    const safeUser = safeEncode(username);
    const safePass = safeEncode(password);

    if (uri.includes('<username>') || uri.includes('<password>')) {
      uri = uri
        .replace('<username>', safeUser)
        .replace('<password>', safePass);
    } else if (!uri.includes('@')) {
      // If uri format is mongodb+srv://cluster.mongodb.net/dbname without credentials
      if (uri.startsWith('mongodb+srv://')) {
        uri = 'mongodb+srv://' + safeUser + ':' + safePass + '@' + uri.slice('mongodb+srv://'.length);
      } else if (uri.startsWith('mongodb://')) {
        uri = 'mongodb://' + safeUser + ':' + safePass + '@' + uri.slice('mongodb://'.length);
      }
    }
  }

  return sanitizeMongoUri(uri);
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
