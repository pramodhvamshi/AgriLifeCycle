const CropRecommendation = require('../models/CropRecommendation');
const QualityAssessment = require('../models/QualityAssessment');
const PostHarvestDecision = require('../models/PostHarvestDecision');

// Get all items for Expert Dashboard (Pending & Reviewed)
exports.getPendingItems = async (req, res) => {
    try {
        const crops = await CropRecommendation.find().sort({ createdAt: -1 }).populate('farmer', 'fullName email');
        const quality = await QualityAssessment.find().sort({ createdAt: -1 }).populate('farmer', 'fullName email');
        const decisions = await PostHarvestDecision.find().sort({ createdAt: -1 }).populate('farmer', 'fullName email');
        
        res.json({ crops, quality, decisions });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Approve or Modify Crop Recommendation
exports.validateCrop = async (req, res) => {
    const { id } = req.params;
    const { status, modifiedCrop, notes } = req.body;
    
    console.log("Validate Crop Request payload:", { id, status, modifiedCrop, notes });

    try {
        let rec = await CropRecommendation.findById(id);
        if (!rec) return res.status(404).json({ msg: 'Not found' });

        rec.expertValidation.status = status; // Approved, Modified, Rejected
        rec.expertValidation.expert = req.user.id;
        rec.expertValidation.notes = notes;
        rec.expertValidation.modifiedCrop = modifiedCrop || null;
        rec.expertValidation.verifiedAt = Date.now();

        await rec.save();
        res.json(rec);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Validate Quality
exports.validateQuality = async (req, res) => {
    const { id } = req.params;
    const { status, modifiedGrade, notes } = req.body;
    
    console.log("Validate Quality Request payload:", { id, status, modifiedGrade, notes });

    try {
        let item = await QualityAssessment.findById(id);
        if (!item) return res.status(404).json({ msg: 'Not found' });

        item.expertValidation.status = status;
        item.expertValidation.expert = req.user.id;
        item.expertValidation.notes = notes;
        item.expertValidation.modifiedGrade = modifiedGrade || null;
        item.expertValidation.verifiedAt = Date.now();

        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Validate Post-Harvest Decision
exports.validatePostHarvest = async (req, res) => {
    const { id } = req.params;
    const { status, modifiedAction, notes } = req.body;
    
    console.log("Validate Decision Request payload:", { id, status, modifiedAction, notes });

    try {
        let item = await PostHarvestDecision.findById(id);
        if (!item) return res.status(404).json({ msg: 'Not found' });

        item.expertValidation.status = status;
        item.expertValidation.expert = req.user.id;
        item.expertValidation.notes = notes;
        item.expertValidation.modifiedAction = modifiedAction || null;
        item.expertValidation.verifiedAt = Date.now();

        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
