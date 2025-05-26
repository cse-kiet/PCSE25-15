import express from 'express';

import { storeStory } from '../controllers/story.controller.js';

const router = express.Router();

router.post('/story', storeStory);


export default router;