import Story from '../models/story.model.js'

export const storeStory = async (req, res) => {
    try {
        const { name, email, subject, story } = req.body;

        const newStory = new Story({
            name: name,
            email: email,
            subject: subject,
            story: story
        });

        await newStory.save();

        res.status(201).json({ message: "Story stored successfully" });
    } catch (error) {
        console.error("Error storing story:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}