const express = require('express');
const router = express.Router();
const { verifyFirebaseToken } = require('../middleware/firebaseAuth');
const firebaseData = require('../services/firebaseDataService');
const { analyzeNewsWithSEEBA } = require('../services/aiService');

// Analyze specific news article with SEEBA AI
router.post('/analyze/:newsId', verifyFirebaseToken, async (req, res) => {
  try {
    const { newsId } = req.params;
    // Always use Korean for analysis
    const language = 'ko';
    
    // Get the news article
    const news = await firebaseData.getNewsById(newsId);
    if (!news) {
      return res.status(404).json({ error: 'News article not found' });
    }
    
    // Get current market data for context
    const [etfs, commodities] = await Promise.all([
      firebaseData.getETFs(),
      firebaseData.getCommodities()
    ]);
    
    // Analyze with SEEBA AI
    const analysis = await analyzeNewsWithSEEBA({
      news,
      etfs,
      commodities,
      language
    });
    
    // Save the analysis
    await firebaseData.updateNews(newsId, {
      seebaAnalysis: analysis,
      analysisUpdatedAt: new Date()
    });
    
    res.json({ analysis });
  } catch (error) {
    console.error('News analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze news' });
  }
});

// Get news with SEEBA analysis
router.get('/with-analysis', verifyFirebaseToken, async (req, res) => {
  try {
    const { category, limit = 20 } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    
    const news = await firebaseData.getNews(filters);
    
    // Filter news with SEEBA analysis
    const analyzedNews = news
      .filter(article => article.seebaAnalysis)
      .slice(0, parseInt(limit));
    
    res.json({ news: analyzedNews });
  } catch (error) {
    console.error('Error fetching analyzed news:', error);
    res.status(500).json({ error: 'Failed to fetch analyzed news' });
  }
});

module.exports = router;