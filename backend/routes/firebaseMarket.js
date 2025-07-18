const express = require('express');
const router = express.Router();
const firebaseData = require('../services/firebaseDataService');
const { verifyFirebaseToken } = require('../middleware/firebaseAuth');
const { updateMarketData } = require('../services/marketDataServiceFirebase');

// Get all market data (cached)
router.get('/all', verifyFirebaseToken, async (req, res) => {
  try {
    // Use cached data first
    const marketData = await firebaseData.getLatestMarketData();
    res.json(marketData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Get ETFs only
router.get('/etfs', verifyFirebaseToken, async (req, res) => {
  try {
    const etfs = await firebaseData.getETFs();
    res.json(etfs);
  } catch (error) {
    console.error('Error fetching ETFs:', error);
    res.status(500).json({ error: 'Failed to fetch ETFs' });
  }
});

// Get commodities only
router.get('/commodities', verifyFirebaseToken, async (req, res) => {
  try {
    const commodities = await firebaseData.getCommodities();
    res.json(commodities);
  } catch (error) {
    console.error('Error fetching commodities:', error);
    res.status(500).json({ error: 'Failed to fetch commodities' });
  }
});

// Get specific symbol data
router.get('/symbol/:symbol', verifyFirebaseToken, async (req, res) => {
  try {
    const data = await firebaseData.getMarketData(req.params.symbol);
    if (!data) {
      return res.status(404).json({ error: 'Symbol not found' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching symbol data:', error);
    res.status(500).json({ error: 'Failed to fetch symbol data' });
  }
});

// Search and add new symbol
router.post('/search', verifyFirebaseToken, async (req, res) => {
  try {
    const { symbol } = req.body;
    
    if (!symbol || typeof symbol !== 'string' || symbol.length < 2 || symbol.length > 5) {
      return res.status(400).json({ error: 'Invalid symbol format' });
    }
    
    const upperSymbol = symbol.toUpperCase();
    
    // Check if symbol already exists
    const existingData = await firebaseData.getMarketData(upperSymbol);
    if (existingData) {
      return res.json(existingData);
    }
    
    // Fetch new symbol data from API
    const { getMarketDataForSymbol, addUserSearchedSymbol } = require('../services/marketDataServiceFirebase');
    const marketData = await getMarketDataForSymbol(upperSymbol);
    
    if (marketData) {
      // Save to database
      await firebaseData.saveMarketData(upperSymbol, marketData);
      
      // Add to user searched symbols list
      await addUserSearchedSymbol(upperSymbol);
      
      res.json(marketData);
    } else {
      res.status(404).json({ error: 'Symbol not found' });
    }
  } catch (error) {
    console.error('Error searching symbol:', error);
    res.status(500).json({ error: 'Failed to search symbol' });
  }
});

// Manual update trigger (admin only)
router.post('/update', verifyFirebaseToken, async (req, res) => {
  try {
    // In production, add admin check here
    await updateMarketData();
    res.json({ message: 'Market data update initiated' });
  } catch (error) {
    console.error('Error updating market data:', error);
    res.status(500).json({ error: 'Failed to update market data' });
  }
});

module.exports = router;