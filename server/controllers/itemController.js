const path = require('path');
const Item = require('../models/itemModel.js');

// @desc    Create a new item report
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  const { itemName, description, location, contactInfo, reportedBy, category, contactPreference } = req.body;
  
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }
    if (!category || !['lost', 'found'].includes(category)) {
      return res.status(400).json({ message: 'Please specify a valid category (lost or found)' });
    }
    if (!itemName || !description || !location) {
      return res.status(400).json({ message: 'Item name, description, and location are required' });
    }

    let parsedContactInfo = {};
    if (contactInfo) {
      if (typeof contactInfo === 'string') {
        try {
          parsedContactInfo = JSON.parse(contactInfo);
        } catch (e) {
          parsedContactInfo = { email: contactInfo };
        }
      } else {
        parsedContactInfo = contactInfo;
      }
    }

    // Determine image URL (Cloudinary absolute URL or local relative path)
    let imageUrl;
    if (req.file.path && (req.file.path.startsWith('http://') || req.file.path.startsWith('https://'))) {
      imageUrl = req.file.path;
    } else if (req.file.filename) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.file.path) {
      imageUrl = `/uploads/${path.basename(req.file.path)}`;
    }

    const reporterRoll = (req.user && req.user.rollNumber) ? req.user.rollNumber : (reportedBy || 'anonymous');

    const item = new Item({
      itemName: itemName.trim(),
      description: description.trim(),
      location: location.trim(),
      photo: imageUrl,
      contactInfo: parsedContactInfo,
      reportedBy: reporterRoll,
      category,
      contactPreference: category === 'found' ? (contactPreference === 'true' || contactPreference === true) : false,
      status: 'open'
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    console.error('Error creating item:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all items with filtering, search, and sorting
// @route   GET /api/items
// @access  Private
const getItems = async (req, res) => {
  try {
    const { category, status, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    let filter = {};
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { itemName: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { reportedBy: searchRegex }
      ];
    }

    let sortOptions = {};
    if (sortBy === 'latest' || sortBy === 'createdAt') {
      sortOptions.createdAt = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'oldest') {
      sortOptions.createdAt = order === 'desc' ? -1 : 1;
    } else {
      sortOptions[sortBy] = order === 'asc' ? 1 : -1;
    }
    if (Object.keys(sortOptions).length === 0) {
      sortOptions.createdAt = -1;
    }

    const items = await Item.find(filter).sort(sortOptions);
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get item by ID
// @route   GET /api/items/:id
// @access  Private
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error('Error fetching item by ID:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID format' });
    }
    res.status(404).json({ message: 'Item not found' });
  }
};

// @desc    Update item status (e.g., to 'returned')
// @route   PUT /api/items/:id/status
// @access  Private
const updateItemStatus = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the logged-in user is the one who reported the item
    if (req.user && item.reportedBy.toLowerCase() !== req.user.rollNumber.toLowerCase()) {
      return res.status(403).json({ message: 'User not authorized to update this item' });
    }

    if (req.body.status && req.body.status === 'returned') {
      item.status = 'returned';
    } else if (req.body.status && ['open', 'returned'].includes(req.body.status)) {
      item.status = req.body.status;
    } else {
      item.status = 'returned';
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item status:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID format' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItemStatus
};
