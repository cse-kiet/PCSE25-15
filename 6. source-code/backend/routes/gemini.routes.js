import { GoogleGenerativeAI } from '@google/generative-ai';
import express from 'express';
const router = express.Router();

const API_KEY = 'AIzaSyBcV_2HCDlxaszZoo0Ypi8qKGmXWreyGFg';
const customModel = 'tunedModels/sam-lvbxa9cos2nm';

const genAI = new GoogleGenerativeAI(API_KEY);

// Store conversation histories in memory (consider using Redis/database for production)
const conversationStore = new Map();

// Optional: Clean up old conversations periodically
setInterval(() => {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [sessionId, data] of conversationStore.entries()) {
        if (now - data.lastUpdated > maxAge) {
            conversationStore.delete(sessionId);
        }
    }
}, 60 * 60 * 1000); // Clean up every hour

router.post("/chat", async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Use sessionId or create a default one
        const chatSessionId = sessionId || 'default';

        // Get or create conversation history
        if (!conversationStore.has(chatSessionId)) {
            conversationStore.set(chatSessionId, {
                history: [],
                lastUpdated: Date.now()
            });
        }

        const conversationData = conversationStore.get(chatSessionId);
        const history = conversationData.history;

        const model = genAI.getGenerativeModel({ model: customModel });

        // Start a chat session with history
        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        // Send the current message
        const result = await chat.sendMessage(message);
        const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";

        // Update conversation history
        history.push({
            role: "user",
            parts: [{ text: message }]
        });

        history.push({
            role: "model",
            parts: [{ text: text }]
        });

        // Update timestamp
        conversationData.lastUpdated = Date.now();

        console.log("Gemini Response:", text);
        console.log("Conversation length:", history.length);

        res.send({
            text,
            sessionId: chatSessionId,
            conversationLength: history.length / 2 // Divide by 2 since each exchange has user + model
        });

    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
});

// Optional: Add endpoint to clear conversation history
router.delete("/chat/:sessionId", (req, res) => {
    const { sessionId } = req.params;

    if (conversationStore.has(sessionId)) {
        conversationStore.delete(sessionId);
        res.json({ message: "Conversation history cleared" });
    } else {
        res.status(404).json({ error: "Session not found" });
    }
});

// Optional: Add endpoint to get conversation history
router.get("/chat/:sessionId", (req, res) => {
    const { sessionId } = req.params;

    if (conversationStore.has(sessionId)) {
        const conversationData = conversationStore.get(sessionId);
        res.json({
            history: conversationData.history,
            lastUpdated: conversationData.lastUpdated,
            conversationLength: conversationData.history.length / 2
        });
    } else {
        res.status(404).json({ error: "Session not found" });
    }
});

export default router;