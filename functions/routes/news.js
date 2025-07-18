const express = require('express');
const router = express.Router();
const firebaseData = require('../services/firebaseDataService');
const { verifyFirebaseToken } = require('../middleware/auth');
const { fetchLatestNews } = require('../services/newsService');

// Get news with filters
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    
    const filters = {
      category,
      limit: parseInt(limit),
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    };
    
    const news = await firebaseData.getNews(filters);
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get today's news
router.get('/today', verifyFirebaseToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const news = await firebaseData.getNews({
      startDate: today,
      limit: 20
    });
    
    res.json(news);
  } catch (error) {
    console.error('Error fetching today\'s news:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s news' });
  }
});

// Manual news update (admin only)
router.post('/update', verifyFirebaseToken, async (req, res) => {
  try {
    // In production, add admin check here
    await fetchLatestNews();
    res.json({ message: 'News update initiated' });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: 'Failed to update news' });
  }
});

module.exports = router;