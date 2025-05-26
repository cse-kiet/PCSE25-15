import dotenv from "dotenv";
import connectDB from "./config/db.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/message.routes.js";
import messageRoutes from "./routes/message.routes.js";
import stressScoreRoutes from "./routes/stress.score.routes.js";
import featureRoutes from "./routes/feature.routes.js";
import geminiRoutes from "./routes/gemini.routes.js";
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
dotenv.config();

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/stress", stressScoreRoutes);
app.use("/api/feature", featureRoutes);
app.use('/api/gemini', geminiRoutes);

//listen for requests
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});