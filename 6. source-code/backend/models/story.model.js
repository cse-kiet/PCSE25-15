import mongoose from 'mongoose'

const storySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true
    },
})

export default mongoose.model('Story', storySchema)
