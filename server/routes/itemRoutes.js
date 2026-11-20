const express = require('express');
const router = express.Router();
const { createItem, getItems, getItemById, updateItemStatus } = require('../controllers/itemController.js');
const { protect } = require('../middleware/authMiddleware.js');
const upload = require('../middleware/uploadMiddleware.js');

router.post('/', protect, upload.single('photo'), createItem);

router.get('/', protect, getItems);

router.get('/:id', protect, getItemById);

router.put('/:id/status', protect, updateItemStatus);

module.exports = router;
