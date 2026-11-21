const express = require('express');
const path = require('path');
const os = require('os');
const cors = require('cors');
const connectDB = require('./config/db.js');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes.js');
const itemRoutes = require('./routes/itemRoutes.js');
const seedDatabase = require('./seedHandler.js');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists (use os.tmpdir() in serverless/Vercel to avoid EROFS read-only error)
const uploadsDir = process.env.VERCEL ? path.join(os.tmpdir(), 'uploads') : path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
} catch (e) {
  // Read-only filesystem in serverless, ignore
}
app.use('/uploads', express.static(uploadsDir));

// Database connection middleware for all /api requests (ensures DB is connected before query execution in serverless)
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error(`Database connection failed on ${req.method} ${req.originalUrl}:`, err.message);
    return res.status(503).json({
      message: 'Database connection failed. Please ensure MONGO_URI is set in Vercel and MongoDB Atlas has Network Access 0.0.0.0/0 enabled.',
      error: err.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Lost and Found API is running and connected to MongoDB',
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
});

// Safe Database Migration/Seeding endpoint for MongoDB Atlas setup
app.get('/api/seed', async (req, res) => {
  try {
    const result = await seedDatabase(req.query.force === 'true');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n[ERROR] Port ${PORT} is already in use by another process.`);
      console.error(`To free port ${PORT}, run:\n  npx kill-port ${PORT}\n`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });
}

module.exports = app;
