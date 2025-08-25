import express from 'express';
const router = express.Router();
import { getWebsiteInfoAnswer } from '../utils/WebsiteInfo.js';

router.get('/website-info', (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    const answer = getWebsiteInfoAnswer(query);

    if (answer) {
        return res.status(200).json({ answer });
    } else {
        return res.status(404).json({ message: 'No relevant information found for your query.' });
    }
});

export default router;
