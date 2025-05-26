import express from 'express';
import { storeMessage, getMessages } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/", getMessages);
router.post("/send/:id", storeMessage)

export default router;