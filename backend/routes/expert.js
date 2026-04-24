const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getPendingItems, validateCrop, validateQuality, validatePostHarvest } = require('../controllers/expertController');

// Expert dashboard items
router.get('/pending-requests', auth(['Expert']), getPendingItems);

// Validation actions
router.post('/validate-crop/:id', auth(['Expert']), validateCrop);
router.post('/validate-quality/:id', auth(['Expert']), validateQuality);
router.post('/validate-post-harvest/:id', auth(['Expert']), validatePostHarvest);

module.exports = router;
