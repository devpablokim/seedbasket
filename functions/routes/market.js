const express = require('express');
const router = express.Router();
const firebaseData = require('../services/firebaseDataService');
const { verifyFirebaseToken } = require('../middleware/auth');
const { updateMarketData } = require('../services/marketDataService');

// Get all market data
router.get('/all', verifyFirebaseToken, async (req, res) => {
  try {
    const [etfs, commodities] = await Promise.all([
      firebaseData.getETFs(),
      firebaseData.getCommodities()
    ]);
    
    res.json({ etfs, commodities });
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