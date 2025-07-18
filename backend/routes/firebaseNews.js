const express = require('express');
const router = express.Router();
const firebaseData = require('../services/firebaseDataService');
const { verifyFirebaseToken } = require('../middleware/firebaseAuth');
const { fetchLatestNews } = require('../services/newsServiceFirebase');

// Get news with filters (cached)
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    
    // Try to get cached news first
    const cachedNews = await firebaseData.getCachedData('latest_news');
    let news;
    
    if (cachedNews) {
      // Filter cached news based on category
      news = category ? cachedNews.filter(n => n.category === category) : cachedNews;
    } else {
      // Fallback to database query
      const filters = {
        category,
        limit: parseInt(limit) * 2, // Get more to filter duplicates
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
      };
      
      news = await firebaseData.getNews(filters);
    }
    
    // Remove duplicates based on title similarity
    const uniqueNews = [];
    const seenTitles = new Set();
    
    for (const article of news) {
      const titleWords = article.title.toLowerCase().split(' ').filter(word => word.length > 3);
      let isDuplicate = false;
      
      // Check against already seen titles
      for (const seen of seenTitles) {
        const seenWords = seen.split(' ').filter(word => word.length > 3);
        const commonWords = titleWords.filter(word => seenWords.includes(word));
        
        // If 60% or more words match, consider it duplicate
        if (commonWords.length >= Math.min(titleWords.length, seenWords.length) * 0.6) {
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate && uniqueNews.length < parseInt(limit)) {
        uniqueNews.push(article);
        seenTitles.add(article.title.toLowerCase());
      }
    }
    
    res.json(uniqueNews);
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