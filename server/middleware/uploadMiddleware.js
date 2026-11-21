const multer = require('multer');
const path = require('path');
const fs = require('fs');

const os = require('os');
let storage;

const hasCloudinary = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  try {
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const cloudinary = require('../config/cloudinary');
    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'lost-and-found-items',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      },
    });
  } catch (err) {
    console.warn('Cloudinary initialization failed, falling back to local storage:', err.message);
  }
}

if (!storage) {
  // Local fallback storage (uses os.tmpdir() on Vercel/serverless to avoid EROFS read-only crashes)
  const uploadDir = process.env.VERCEL ? path.join(os.tmpdir(), 'uploads') : path.join(__dirname, '../uploads');
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (err) {
    // Read-only filesystem in serverless, ignore
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `item-${uniqueSuffix}${ext}`);
    }
  });
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, JPG, PNG, and WEBP image formats are supported'));
  }
});

module.exports = upload;
