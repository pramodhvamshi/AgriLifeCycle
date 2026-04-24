const mongoose = require('mongoose');

const postHarvestDecisionSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropName: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    predictedPrices: [{ type: Number }], // Array of 7 values
    systemDecision: {
        action: { type: String, required: true }, // Store or Sell
        reason: { type: String }
    },
    expertValidation: {
        status: { 
            type: String, 
            enum: ['Pending', 'Approved', 'Modified'], 
            default: 'Pending' 
        },
        expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        modifiedAction: { type: String },
        notes: { type: String },
        verifiedAt: { type: Date }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PostHarvestDecision', postHarvestDecisionSchema);
