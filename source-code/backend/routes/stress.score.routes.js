import express from 'express';
import { storeStressScore, getStressScores } from '../controllers/stress.score.controller.js';

const router = express.Router();

router.post("/store/:id", storeStressScore);
router.get("/fetch/:id", getStressScores);

export default router;