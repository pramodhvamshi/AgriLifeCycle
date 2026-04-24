const mongoose = require('mongoose');

const qualityAssessmentSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    harvestData: {
        moisture: { type: Number, required: true },
        damage: { type: Number, required: true },
        maturity: { type: String, required: true }
    },
    systemGrade: {
        grade: { type: String, required: true }, // Grade A, B, or C
        status: { type: String, default: 'Rule-Based' }
    },
    expertValidation: {
        status: { 
            type: String, 
            enum: ['Pending', 'Approved', 'Modified'], 
            default: 'Pending' 
        },
        expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        modifiedGrade: { type: String },
        notes: { type: String },
        verifiedAt: { type: Date }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QualityAssessment', qualityAssessmentSchema);
