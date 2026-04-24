const { exec, spawn } = require('child_process');
const path = require('path');
const CropRecommendation = require('../models/CropRecommendation');
const QualityAssessment = require('../models/QualityAssessment');
const PostHarvestDecision = require('../models/PostHarvestDecision');

exports.predictCrop = async (req, res) => {
    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

    if (
        N === undefined || P === undefined || K === undefined ||
        temperature === undefined || humidity === undefined ||
        ph === undefined || rainfall === undefined
    ) {
        return res.status(400).json({ error: "Missing required soil parameters." });
    }

    // Path to the python script (model/predict.py)
    const scriptPath = path.join(__dirname, '..', 'model', 'predict.py');
    const command = `python "${scriptPath}" ${N} ${P} ${K} ${temperature} ${humidity} ${ph} ${rainfall}`;

    exec(command, async (err, stdout, stderr) => {

        // ✅ FIX: HANDLE ERROR CASE ALSO (VERY IMPORTANT)
        if (err) {
            console.error("Execution error:", err);
            console.error("Stderr:", stderr);

            const output = stdout.trim();

            // 👉 If Python sent validation error
            if (output.startsWith("Error:")) {
                return res.status(400).json({ error: output });
            }

            // 👉 Otherwise generic error
            return res.status(500).json({ error: "Failed to predict crop via ML model." });
        }

        const output = stdout.trim();

        // ✅ EXISTING VALIDATION HANDLING (KEPT SAME)
        if (output.startsWith("Error:")) {
            return res.status(400).json({ error: output });
        }

        // EXISTING FLOW (UNCHANGED)
        const predictedCrop = output;

        try {
            const newRec = new CropRecommendation({
                farmer: req.user.id,
                soilData: { N, P, K, temperature, humidity, ph, rainfall },
                mlPrediction: { crop: predictedCrop }
            });
            await newRec.save();
            res.json(newRec);
        } catch (dbErr) {
            console.error('DB Error in predictCrop:', dbErr);
            res.status(500).json({ error: "Error saving prediction to database" });
        }
    });
};

exports.assessQuality = async (req, res) => {
    const { moisture, damage, maturity } = req.body;
    let grade = 'C';
    if (moisture < 12 && damage < 10) grade = 'A';
    else if (moisture < 18) grade = 'B';

    try {
        const assessment = new QualityAssessment({
            farmer: req.user.id,
            harvestData: { moisture, damage, maturity },
            systemGrade: { grade }
        });
        await assessment.save();
        res.json(assessment);
    } catch (e) { res.status(500).json({ error: "DB Error" }); }
};

exports.postHarvestDecision = async (req, res) => {
    try {
        // 1. Fetch latest predicted crop for the user
        const latestRec = await CropRecommendation.findOne({ farmer: req.user.id }).sort({ createdAt: -1 });

        if (!latestRec) {
            return res.status(404).json({ error: "No crop recommendation found. Please get a crop recommendation first." });
        }

        const cropName = latestRec.expertValidation.status === 'Modified'
            ? latestRec.expertValidation.modifiedCrop
            : latestRec.mlPrediction.crop;

        // 2. Call Python ML model via spawn (Async/Non-blocking)
        const scriptPath = path.join(__dirname, '..', 'model', 'predict_price.py');
        const pythonProcess = spawn('python', [scriptPath, cropName]);

        let resultData = '';
        let errorData = '';

        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
        });

        pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                console.error("Python Error:", errorData);
                return res.status(500).json({ error: "ML Model failed to execute" });
            }

            try {

                const mlOutput = JSON.parse(resultData);

                if (mlOutput.error) {
                    return res.status(400).json({ error: mlOutput.error });
                }

                const { current_price, next_7_days, predicted_next_week } = mlOutput;

                // ✅ FIXED
                const action = predicted_next_week > current_price ? 'Store' : 'Sell';

                const reason = action === 'Store'
                    ? `Price is expected to rise from ₹${current_price} to ₹${predicted_next_week}.`
                    : `Current market price (₹${current_price}) is optimal; price may fall.`;

                // ✅ ADD TREND LOGIC
                const trend = next_7_days[next_7_days.length - 1] > next_7_days[0]
                    ? "📈 Increasing"
                    : "📉 Decreasing";

                // 4. Save to MongoDB
                const decision = new PostHarvestDecision({
                    farmer: req.user.id,
                    cropName,
                    currentPrice: current_price,
                    predictedPrices: next_7_days, // ✅ FIXED
                    systemDecision: { action, reason },
                    trend // ✅ NEW FIELD (optional)
                });

                await decision.save();

                res.json({
                    ...decision.toObject(),
                    trend // ✅ send to frontend
                });

            } catch (parseErr) {
                console.error("Parse Error:", parseErr, resultData);
                res.status(500).json({ error: "Failed to parse ML output" });
            }
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getLatestDecision = async (req, res) => {
    try {
        const decision = await PostHarvestDecision.findOne({ farmer: req.user.id }).sort({ createdAt: -1 });
        if (!decision) return res.status(404).json({ error: "No historical decision found." });
        res.json(decision);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.getMyData = async (req, res) => {
    try {
        const crops = await CropRecommendation.find({ farmer: req.user.id }).sort({ createdAt: -1 });
        const quality = await QualityAssessment.find({ farmer: req.user.id }).sort({ createdAt: -1 });
        const decisions = await PostHarvestDecision.find({ farmer: req.user.id }).sort({ createdAt: -1 });
        res.json({ crops, quality, decisions });
    } catch (e) { res.status(500).send('Server error'); }
};