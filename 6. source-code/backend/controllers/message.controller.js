import Message from '../models/message.model.js';

export const storeMessage = async (req, res) => {
    try {
        // Extract user ID from request object
        // console.log("req.user", req.params);
        const userId = req.params.id;

        // Extract message content from request body
        const { message } = req.body;

        // Create new message document
        const newMessage = new Message({
            userId: userId, // Associate message with user
            message: message
        });

        // Save message to the database
        await newMessage.save();

        res.status(201).json({ message: "Message stored successfully" });
    } catch (error) {
        console.error("Error storing message:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { userId, page = 1, limit = 20 } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "Missing userId" });
        }

        const messages = await Message.find({ userId })
            .sort({ createdAt: -1 }) // Newest first
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json(messages); // frontend will reverse before displaying
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ error: "Server error" });
    }
}
