import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    userId: String,
    message: String,
    role: { type: String, enum: ['user', 'model'], default: 'user' },
    sessionId: String, // Optional: for grouping conversations
    createdAt: { type: Date, default: Date.now }
}
);

const Message = mongoose.model('Message', messageSchema);

export default Message;