import StressScore from '../models/stress.score.model.js';

export const storeStressScore = async (req, res) => {
    try {
        // Extract user ID from request object
        const userId = req.params.id;

        const { label, score } = req.body;

        // Create new stress score document
        const newStressScore = new StressScore({
            userId: userId, // Associate stress score with user
            label: label,
            score: score
        });

        // Save stress score to the database
        await newStressScore.save();

        res.status(201).json({ message: "Stress score stored successfully" });
    } catch (error) {
        console.error("Error storing stress score:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getStressScores = async (req, res) => {
    try {
        const userId = req.params.id;

        const stressScores = await StressScore.find({ userId: userId });

        res.status(200).json(stressScores);
    } catch (error) {
        console.error("Error fetching stress scores:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}