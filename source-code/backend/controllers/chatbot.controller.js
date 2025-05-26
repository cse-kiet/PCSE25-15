import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.VITE_REACT_GOOGLE_GEN_AI_API_KEY);

app.post("/gemini", async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.body.message)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        const chat = await model.startChat({
            history: req.body.history,
        })
        const msg = req.body.message
        const result = await chat.sendMessage(msg)
        const text = await result.response
        res.send(text)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

