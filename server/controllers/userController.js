const User = require('../models/userModel.js');
const Item = require('../models/itemModel.js');
const { generateToken } = require('../middleware/authMiddleware.js');

// Base stats to start from (historical baseline)
const BASE_HELPED_USERS = 361;
const BASE_ITEMS_RECOVERED = 180;

// @desc    Get stats for helped users and items recovered
// @route   GET /api/users/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const currentUsers = await User.countDocuments();
    const currentItemsRecovered = await Item.countDocuments({ status: 'returned' });
    
    const helpedUsers = BASE_HELPED_USERS + currentUsers;
    const itemsRecovered = BASE_ITEMS_RECOVERED + currentItemsRecovered;
    
    res.json({
      helpedUsers,
      itemsRecovered
    });
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { rollNumber, password } = req.body;

  try {
    if (!rollNumber || !password) {
      return res.status(400).json({ message: 'Roll number and password are required' });
    }

    const normalizedRoll = rollNumber.trim().toLowerCase();
    const user = await User.findOne({ rollNumber: normalizedRoll });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        rollNumber: user.rollNumber,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid roll number or password' });
    }
  } catch (error) {
    console.error('Error authenticating user:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { rollNumber } = req.body;

  try {
    if (!rollNumber) {
      return res.status(400).json({ message: 'Roll number is required' });
    }

    const normalizedRoll = rollNumber.trim().toLowerCase();
    const userExists = await User.findOne({ rollNumber: normalizedRoll });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Default password is the uppercase version of the roll number
    const password = normalizedRoll.toUpperCase();

    const user = await User.create({
      rollNumber: normalizedRoll,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        rollNumber: user.rollNumber,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  authUser,
  registerUser,
  getStats
};
