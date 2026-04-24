const { exec } = require('child_process');
const path = require('path');
const CropRecommendation = require('../models/CropRecommendation');

exports.predictCrop = async (req, res) => {
    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

    if (
        N === undefined || P === undefined || K === undefined ||
        temperature === undefined || humidity === undefined ||
        ph === undefined || rainfall === undefined
    ) {
        return res.status(400).json({ error: "Missing required soil parameters." });
    }

    // Path to the python script (ml/predict.py)
    const scriptPath = path.join(__dirname, '..', 'ml', 'predict.py');
    const command = `python "${scriptPath}" ${N} ${P} ${K} ${temperature} ${humidity} ${ph} ${rainfall}`;

    exec(command, async (err, stdout, stderr) => {
        if (err) {
            console.error("Execution error:", err);
            return res.status(500).json({ error: "Failed to predict crop." });
        }
        
        const predictedCrop = stdout.trim();
        
        try {
            // Save to Database as Pending Expert Validation
            const newRecommendation = new CropRecommendation({
                farmer: req.user.id,
                soilData: { N, P, K, temperature, humidity, ph, rainfall },
                mlPrediction: { crop: predictedCrop }
            });
            
            await newRecommendation.save();
            
            res.json({ 
                id: newRecommendation._id,
                crop: predictedCrop,
                status: "Pending",
                msg: "Prediction internal success, awaiting expert validation."
            });
        } catch (dbErr) {
            console.error("DB Error:", dbErr);
            res.status(500).json({ error: "Error saving prediction to database." });
        }
    });
};

exports.getFarmerPredictions = async (req, res) => {
    try {
        const predictions = await CropRecommendation.find({ farmer: req.user.id }).sort({ createdAt: -1 });
        res.json(predictions);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
