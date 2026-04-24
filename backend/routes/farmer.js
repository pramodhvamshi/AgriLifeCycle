const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
    predictCrop, 
    assessQuality, 
    postHarvestDecision, 
    getLatestDecision,
    getMyData 
} = require('../controllers/farmerController');

router.get('/my-dashboard', auth(['Farmer']), getMyData);
router.post('/predict-crop', auth(['Farmer']), predictCrop);
router.post('/assess-quality', auth(['Farmer']), assessQuality);
router.post('/post-harvest-decision', auth(['Farmer']), postHarvestDecision);
router.get('/latest-decision', auth(['Farmer']), getLatestDecision);

module.exports = router;
