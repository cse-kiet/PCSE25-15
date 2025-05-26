import mongoose from 'mongoose';

const stressScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    label: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },

},
    {
        timestamps: true
    }
);

const StressScore = mongoose.model('StressScore', stressScoreSchema);

export default StressScore;