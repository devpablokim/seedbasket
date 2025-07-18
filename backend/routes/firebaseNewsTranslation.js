const express = require('express');
const router = express.Router();
const { verifyFirebaseToken } = require('../middleware/firebaseAuth');
const { translateNews } = require('../services/aiService');
const firebaseData = require('../services/firebaseDataService');

// Translate news summary and title to Korean
router.post('/translate/:newsId', verifyFirebaseToken, async (req, res) => {
  try {
    const { newsId } = req.params;
    
    // Get the news article
    const news = await firebaseData.getNewsById(newsId);
    if (!news) {
      return res.status(404).json({ error: 'News article not found' });
    }
    
    // Check if Korean translation already exists
    if (news.titleKo && news.summaryKo) {
      return res.json({ 
        titleTranslation: news.titleKo,
        summaryTranslation: news.summaryKo,
        cached: true 
      });
    }
    
    // Translate both title and summary
    const [titleTranslation, summaryTranslation] = await Promise.all([
      news.titleKo || translateNews(news.title, 'ko'),
      news.summaryKo || translateNews(news.summary || news.title, 'ko')
    ]);
    
    // Save the translations
    await firebaseData.updateNews(newsId, {
      titleKo: titleTranslation,
      summaryKo: summaryTranslation,
      translationUpdatedAt: new Date()
    });
    
    res.json({ 
      titleTranslation,
      summaryTranslation,
      cached: false 
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Failed to translate news' });
  }
});

// Get related ETF indicators for a news article
router.get('/etf-indicators/:newsId', verifyFirebaseToken, async (req, res) => {
  try {
    const { newsId } = req.params;
    
    // Get the news article
    const news = await firebaseData.getNewsById(newsId);
    if (!news) {
      return res.status(404).json({ error: 'News article not found' });
    }
    
    // Get ETF data for impacted ETFs
    const etfIndicators = [];
    
    if (news.impactedETFs && news.impactedETFs.length > 0) {
      for (const impactedETF of news.impactedETFs) {
        const etfData = await firebaseData.getMarketData(impactedETF.symbol);
        if (etfData) {
          etfIndicators.push({
            symbol: impactedETF.symbol,
            name: etfData.name,
            price: etfData.latestPrice,
            change: etfData.change,
            changePercent: etfData.changePercent,
            impact: impactedETF.impact,
            reason: impactedETF.reason
          });
        }
      }
    }
    
    res.json({ indicators: etfIndicators });
  } catch (error) {
    console.error('Error fetching ETF indicators:', error);
    res.status(500).json({ error: 'Failed to fetch ETF indicators' });
  }
});

module.exports = router;