const mongoose = require('mongoose');

const cropRecommendationSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    soilData: {
        N: { type: Number, required: true },
        P: { type: Number, required: true },
        K: { type: Number, required: true },
        temperature: { type: Number, required: true },
        humidity: { type: Number, required: true },
        ph: { type: Number, required: true },
        rainfall: { type: Number, required: true }
    },
    mlPrediction: {
        crop: { type: String, required: true },
        confidence: { type: Number, default: 0.9 } // Dummy confidence
    },
    expertValidation: {
        status: { 
            type: String, 
            enum: ['Pending', 'Approved', 'Modified', 'Rejected'], 
            default: 'Pending' 
        },
        expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        modifiedCrop: { type: String },
        notes: { type: String },
        verifiedAt: { type: Date }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CropRecommendation', cropRecommendationSchema);
