const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const { authUser, registerUser, getStats } = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.get('/stats', protect, getStats);

router.post(
  '/login',
  [
    body('rollNumber', 'Roll number is required').notEmpty(),
    body('password', 'Password is required').notEmpty(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    authUser(req, res, next);
  }
);

router.post(
  '/register',
  [
    body('rollNumber', 'Roll number is required').notEmpty(),
    body('rollNumber', 'Roll number must be alphanumeric').isAlphanumeric(),
    body('rollNumber', 'Roll number must be between 5 and 20 characters').isLength({ min: 5, max: 20 })
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    registerUser(req, res, next);
  }
);

module.exports = router;
